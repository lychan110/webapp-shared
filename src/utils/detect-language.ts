import path from 'path';

/**
 * Mapping of file extensions and well-known filenames to editor language identifiers.
 */
const LANGUAGE_MAP: Record<string, string> = {
  '.sh': 'shell',
  '.bash': 'shell',
  '.zsh': 'shell',
  '.js': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.json': 'json',
  '.json5': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.css': 'css',
  '.scss': 'css',
  '.html': 'html',
  '.htm': 'html',
  '.py': 'python',
  '.md': 'markdown',
  '.mdx': 'markdown',
  '.toml': 'toml',
  '.xml': 'xml',
};

/**
 * Detect a code-editor language identifier from a file path.
 *
 * Uses the file extension first, then checks for well-known filenames
 * (`.env*`, `Makefile`, `Dockerfile`). Falls back to `'text'`.
 *
 * This is a **server-only** utility (uses Node.js `path` module).
 * Do not import it from client code.
 *
 * @param filePath - Relative or absolute file path.
 * @returns A language identifier string (e.g. `'typescript'`, `'python'`, `'yaml'`).
 *
 * @example
 * detectLanguage('src/index.ts')        // => 'typescript'
 * detectLanguage('Dockerfile')          // => 'shell'
 * detectLanguage('config.yaml')         // => 'yaml'
 * detectLanguage('unknown.xyz')         // => 'text'
 */
export function detectLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const basename = path.basename(filePath).toLowerCase();

  if (basename.startsWith('.env')) return 'shell';
  if (basename === 'makefile') return 'shell';
  if (basename === 'dockerfile') return 'shell';

  return LANGUAGE_MAP[ext] ?? 'text';
}
