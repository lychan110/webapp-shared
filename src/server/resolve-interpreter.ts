import path from 'path';

/**
 * Mapping from file extension to interpreter command for script execution.
 *
 * **SERVER-ONLY** — This utility uses Node.js `path` and is designed to be
 * used with `child_process.spawn`. Do not import it from client/browser code.
 *
 * @param filePath - The path to the script file to interpret.
 * @returns An object with `command` (interpreter binary) and `args` (arguments
 * including the script path) suitable for passing to `spawn()`.
 *
 * @example
 * ```ts
 * import { resolveInterpreter } from '@lenya/webapp-shared/server/resolve-interpreter';
 *
 * const { command, args } = resolveInterpreter('/path/to/script.py');
 * // => { command: 'python3', args: ['/path/to/script.py'] }
 *
 * const proc = spawn(command, args, { cwd: path.dirname(msg.path) });
 * ```
 */
export function resolveInterpreter(filePath: string): { command: string; args: string[] } {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.py':
      return { command: 'python3', args: [filePath] };
    case '.js':
    case '.mjs':
      return { command: 'node', args: [filePath] };
    case '.sh':
    case '.bash':
    case '.zsh':
      return { command: 'bash', args: [filePath] };
    default:
      return { command: 'bash', args: [filePath] };
  }
}
