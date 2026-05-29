import path from 'path';

/**
 * Check whether a resolved file path is inside any of the allowed directories.
 *
 * This is a **server-only** utility (uses Node.js `path` module).
 * Do not import it from client code.
 *
 * Both `filePath` and each entry in `allowedDirs` are resolved via
 * `path.resolve` before comparison, so relative paths work correctly.
 * The check uses `path.sep` for cross-platform separator handling.
 *
 * @param filePath - The path to check (may be relative or absolute).
 * @param allowedDirs - List of directories to allow access from.
 * @returns `true` if `filePath` is inside or exactly equal to one of `allowedDirs`.
 *
 * @example
 * isWithinDirs('/home/user/data/file.txt', ['/home/user/data'])
 * // => true
 *
 * isWithinDirs('/etc/passwd', ['/home/user/data'])
 * // => false
 */
export function isWithinDirs(filePath: string, allowedDirs: string[]): boolean {
  const resolved = path.resolve(filePath);
  return allowedDirs.some(dir => {
    const resolvedDir = path.resolve(dir);
    return resolved === resolvedDir || resolved.startsWith(resolvedDir + path.sep);
  });
}
