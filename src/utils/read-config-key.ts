/**
 * Read a configuration value from multiple sources with fallback priority:
 *
 *   1. **`sessionStorage`** — runtime override (e.g. set by user in dev tools).
 *   2. **`import.meta.env`** — build-time / Vite environment variables.
 *   3. **`fallback`** — hard-coded default.
 *
 * Type-safe: pass the same type parameter for all sources.
 *
 * @param key     - The `sessionStorage` key (and conventionally the Vite env var name).
 * @param envKey  - The `import.meta.env` key to check (e.g. `'VITE_OPENAI_API_KEY'`).
 * @param fallback - Fallback value used when neither source is available.
 * @returns The resolved value.
 *
 * @example
 * const apiKey = readConfigKey('my_api_key', 'VITE_MY_API_KEY', 'default-key');
 *
 * @example
 * // With explicit number type:
 * const port = readConfigKey<number>('my_port', 'VITE_MY_PORT', 8080);
 */
export function readConfigKey<T = string>(
  key: string,
  envKey: string,
  fallback: T,
): T {
  // sessionStorage — runtime override
  if (typeof sessionStorage !== 'undefined') {
    const stored = sessionStorage.getItem(key);
    if (stored !== null) return stored as unknown as T;
  }

  // Vite env var (build-time / CI)
  if (typeof import.meta !== 'undefined') {
    const env = (import.meta as Record<string, any>).env;
    if (env && env[envKey] !== undefined) {
      return env[envKey] as T;
    }
  }

  return fallback;
}
