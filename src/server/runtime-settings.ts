/**
 * RuntimeSettingsStore — JSON file persistence with hot-reload support.
 *
 * Provides CRUD operations for settings stored in a JSON file, with built-in
 * secret redaction support for sensitive fields like API keys and tokens.
 *
 * @example
 * ```ts
 * interface AppSettings {
 *   port: number;
 *   apiKey?: string;
 *   dbUrl?: string;
 * }
 *
 * const store = createSettingsStore<AppSettings>({
 *   filePath: '/path/to/settings.json',
 *   defaults: { port: 3000 },
 *   secrets: ['apiKey'],
 * });
 *
 * const settings = store.get();          // apiKey is redacted
 * store.set({ port: 8080 });             // update port
 * const raw = store.getRaw();            // full settings including secrets
 * store.watch((updated) => { ... });     // react to file changes
 * ```
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { createEventHub } from '../utils/event-hub';

// ── Types ───────────────────────────────────────────────────────────────────

export interface SettingsStoreOptions<T extends Record<string, unknown>> {
  /** Absolute or relative path to the JSON settings file. */
  filePath: string;
  /** Default settings used when the file does not exist or is malformed. */
  defaults: T;
  /** Keys whose values should be redacted in the public `get()` response.
   *  Use strings like `'apiKey'`, `'secret'`, or dot-notation like `'auth.token'`. */
  secrets?: string[];
  /** If true, watch the file for external changes (default: false). */
  watch?: boolean;
  /** Polling interval in ms when watching (default: 2000). */
  watchInterval?: number;
}

export type SettingsChangeListener<T> = (settings: T) => void;

export interface SettingsStore<T extends Record<string, unknown>> {
  /** Get settings with secret fields redacted to `'[REDACTED]'`. */
  get(): T;

  /** Get the full, unredacted settings object. */
  getRaw(): T;

  /** Merge partial updates into the current settings and persist. */
  set(partial: Partial<T>): T;

  /** Replace all settings entirely and persist. */
  replace(settings: T): T;

  /** Reload settings from disk (triggers if file changed externally). */
  reload(): T;

  /** Subscribe to changes. Callback fires after every successful write or reload. */
  watch(listener: SettingsChangeListener<T>): () => void;

  /** Unsubscribe a change listener. */
  unwatch(listener: SettingsChangeListener<T>): void;

  /** Get the raw file path being used. */
  readonly filePath: string;
}

// ── Implementation ──────────────────────────────────────────────────────────

function isDotKey(key: string): boolean {
  return key.includes('.');
}

function setDeep(obj: Record<string, unknown>, dotKey: string, value: unknown): void {
  const parts = dotKey.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
      current[parts[i]] = {};
    }
    current = current[parts[i]] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

function getDeep(obj: Record<string, unknown>, dotKey: string): unknown {
  return dotKey.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/**
 * Create a runtime settings store backed by a JSON file.
 *
 * - Secrets are redacted in `get()` but available in `getRaw()`.
 * - External file changes are detected when `watch: true` is passed.
 * - All mutations are synchronous and atomic (write to temp file, then rename).
 */
export function createSettingsStore<T extends Record<string, unknown>>(
  options: SettingsStoreOptions<T>,
): SettingsStore<T> {
  const {
    filePath: rawFilePath,
    defaults,
    secrets = [],
    watch = false,
    watchInterval = 2000,
  } = options;

  const filePath = path.resolve(rawFilePath);
  const dir = path.dirname(filePath);
  const tempPath = filePath + '.tmp';

  const hub = createEventHub<{
    change: T;
  }>();

  let cached: T;
  let watchTimer: ReturnType<typeof setInterval> | null = null;

  // ── File I/O ──────────────────────────────────────────────────────────────

  function ensureDir(): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  function readFromDisk(): T {
    try {
      if (!fs.existsSync(filePath)) return { ...defaults };
      const raw = fs.readFileSync(filePath, 'utf-8');
      return { ...defaults, ...JSON.parse(raw) };
    } catch {
      return { ...defaults };
    }
  }

  function writeToDisk(settings: T): void {
    ensureDir();
    // Atomic write: write to temp file, then rename
    fs.writeFileSync(tempPath, JSON.stringify(settings, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  }

  // ── Redaction ─────────────────────────────────────────────────────────────

  function redact(settings: T): T {
    if (secrets.length === 0) return { ...settings };

    const clone = JSON.parse(JSON.stringify(settings)) as T;

    for (const key of secrets) {
      if (isDotKey(key)) {
        const value = getDeep(clone as unknown as Record<string, unknown>, key);
        if (value !== undefined) {
          setDeep(clone as unknown as Record<string, unknown>, key, '[REDACTED]');
        }
      } else {
        if ((clone as Record<string, unknown>)[key] !== undefined) {
          (clone as Record<string, unknown>)[key] = '[REDACTED]';
        }
      }
    }

    return clone;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  function get(): T {
    return redact(cached);
  }

  function getRaw(): T {
    return { ...cached };
  }

  function set(partial: Partial<T>): T {
    const next: T = { ...cached, ...partial };
    writeToDisk(next);
    cached = next;
    hub.emit('change', next);
    return redact(next);
  }

  function replace(settings: T): T {
    writeToDisk(settings);
    cached = settings;
    hub.emit('change', settings);
    return redact(settings);
  }

  function reload(): T {
    cached = readFromDisk();
    hub.emit('change', cached);
    return redact(cached);
  }

  // ── Watch for external changes ────────────────────────────────────────────

  function startWatching(): void {
    if (watchTimer) return;
    let mtime = getMtime();

    watchTimer = setInterval(() => {
      const current = getMtime();
      if (current !== null && current !== mtime) {
        mtime = current;
        reload();
      }
    }, watchInterval);
  }

  function getMtime(): number | null {
    try {
      const stat = fs.statSync(filePath);
      return stat.mtimeMs;
    } catch {
      return null;
    }
  }

  // ── Initialisation ────────────────────────────────────────────────────────

  cached = readFromDisk();
  if (watch) {
    startWatching();
  }

  const store: SettingsStore<T> = {
    get,
    getRaw,
    set,
    replace,
    reload,
    watch: (listener) => hub.on('change', listener),
    unwatch: (listener) => hub.off('change', listener),
    get filePath() {
      return filePath;
    },
  };

  return store;
}
