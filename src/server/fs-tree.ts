import fs from 'fs/promises';
import path from 'path';

/**
 * A node in a directory tree returned by {@link buildTree}.
 */
export interface FileNode {
  /** File or directory name */
  name: string;
  /** Absolute or relative path */
  path: string;
  /** Node type */
  type: 'file' | 'dir';
  /** Child nodes (only present for directories) */
  children?: FileNode[];
  /** Detected language identifier (only present for files) */
  language?: string;
}

/**
 * Recursively build a sorted directory tree from a root path.
 *
 * **SERVER-ONLY** — This utility uses Node.js `fs/promises` and `path`.
 * Do not import it from client/browser code.
 *
 * Dot-files and dot-directories (names starting with `.`) are skipped.
 * Directories are sorted before files; within the same type, entries are
 * sorted alphabetically by `localeCompare`.
 *
 * @param dir - Absolute path to the root directory to scan.
 * @returns A promise that resolves to an array of {@link FileNode} entries.
 *
 * @example
 * ```ts
 * import { buildTree } from '@lenya/webapp-shared/server/fs-tree';
 *
 * const tree = await buildTree('/path/to/project');
 * // => [{ name: 'src', path: '/path/to/project/src', type: 'dir', children: [...] }, ...]
 * ```
 */
export async function buildTree(dir: string): Promise<FileNode[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: FileNode[] = [];
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      nodes.push({ name: e.name, path: full, type: 'dir', children: await buildTree(full) });
    } else if (e.isFile()) {
      // Note: consumers that need a language field can map over the result
      // using `detectLanguage` from this package's utils.
      nodes.push({ name: e.name, path: full, type: 'file' });
    }
  }
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
