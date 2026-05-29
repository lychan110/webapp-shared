import path from 'path';
import os from 'os';

/**
 * Resolve a filesystem path, expanding `~` to the user's home directory.
 *
 * This is a **server-only** utility (uses Node.js `path` and `os` modules).
 * Do not import it from client code.
 *
 * @param p - The path string to resolve. May start with `~` or `~/...`.
 * @returns An absolute, normalized filesystem path.
 *
 * @example
 * resolvePath('~/config/app.json')   // => '/home/user/config/app.json'
 * resolvePath('/tmp/test')           // => '/tmp/test'
 * resolvePath('./foo/bar')           // => '/current/cwd/foo/bar'
 */
export function resolvePath(p: string): string {
  return p.startsWith('~')
    ? path.join(os.homedir(), p.slice(1))
    : path.resolve(p);
}
