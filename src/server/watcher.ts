import chokidar from 'chokidar';
import { EventEmitter } from 'events';

/**
 * A chokidar file watcher wrapper that emits unified `'change'` events.
 *
 * **SERVER-ONLY** — This utility uses Node.js `events` and the `chokidar`
 * filesystem watcher library. Do not import it from client/browser code.
 *
 * Watches one or more directories and re-emits chokidar events
 * (`'add'`, `'change'`, `'unlink'`, `'addDir'`, `'unlinkDir'`) as
 * a single `'change'` event with `(event: string, path: string)` payload,
 * making it easy to bridge to WebSocket clients.
 *
 * Dot-files and dot-directories are ignored by default.
 *
 * @example
 * ```ts
 * import { WatcherManager } from '@lenya/webapp-shared/server/watcher';
 *
 * const watcher = new WatcherManager(['/data/projects']);
 * watcher.on('change', (event, filePath) => {
 *   ws.send(JSON.stringify({ type: 'file:change', event, path: filePath }));
 * });
 *
 * // Later, when shutting down:
 * watcher.close();
 * ```
 */
export class WatcherManager extends EventEmitter {
  private watcher: ReturnType<typeof chokidar.watch>;

  /**
   * @param dirs - One or more directory paths to watch.
   */
  constructor(dirs: string[]) {
    super();
    this.setMaxListeners(200);

    this.watcher = chokidar.watch(dirs, {
      ignoreInitial: true,
      ignored: /(^|[/\\])\\../,
      persistent: true,
      awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 100 },
    });

    for (const event of ['add', 'change', 'unlink', 'addDir', 'unlinkDir'] as const) {
      this.watcher.on(event, (p: string) => this.emit('change', event, p));
    }
  }

  /**
   * Stop watching all directories and release resources.
   */
  close(): void {
    this.watcher.close();
  }
}
