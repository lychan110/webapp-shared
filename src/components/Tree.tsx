/* ══════════════════════════════════════════════════════════════════════════
   Tree — Recursive tree from flat file paths
   ══════════════════════════════════════════════════════════════════════════
   Builds a collapsible tree from an array of flat file paths. Supports
   configurable icons via render props, collapsible folder nodes, and
   custom node click handlers.

   Usage:
     <Tree
       paths={[
         'src/components/Button.tsx',
         'src/components/Card.tsx',
         'src/utils/cn.ts',
       ]}
       onSelect={(path) => console.log('Selected:', path)}
     />
   ══════════════════════════════════════════════════════════════════════════ */

import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { cn } from '../utils/cn';

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface TreeNode {
  /** Display name (last segment of the path) */
  name: string;
  /** Full path from root */
  path: string;
  /** Node type */
  type: 'folder' | 'file';
  /** Child nodes (folders only) */
  children?: TreeNode[];
}

export interface TreeProps {
  /** Array of file paths to build the tree from */
  paths: string[];
  /** Called when a file node is clicked */
  onSelect?: (path: string) => void;
  /** Custom icon renderer for folders */
  renderFolderIcon?: (expanded: boolean) => ReactNode;
  /** Custom icon renderer for files */
  renderFileIcon?: () => ReactNode;
  /** Custom chevron renderer for expandable nodes */
  renderChevron?: (expanded: boolean) => ReactNode;
  /** Initially expanded paths (Set of path strings) */
  defaultExpanded?: string[];
  /** Show root label */
  showRootLabel?: boolean;
  /** Root label text */
  rootLabel?: string;
  /** Additional classes for the container */
  className?: string;
  /** Additional class for tree node rows */
  nodeClassName?: string;
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */

/**
 * Build a tree structure from flat file paths.
 * Groups files under their directory segments, sorting folders before files,
 * and alphabetically within each group.
 */
function buildTree(paths: string[]): TreeNode[] {
  const root: Record<string, TreeNode> = {};

  for (const fullPath of paths) {
    const parts = fullPath.split('/');
    let current = root;
    let accumulated = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      accumulated = accumulated ? `${accumulated}/${part}` : part;
      const isFile = i === parts.length - 1;

      if (!current[part]) {
        current[part] = {
          name: part,
          path: accumulated,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
        };
      }
    }
  }

  const toArray = (obj: Record<string, TreeNode>): TreeNode[] =>
    Object.values(obj)
      .sort((a, b) => {
        // Folders before files
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
      .map((node) => ({
        ...node,
        children: node.children
          ? toArray(
              node.children.reduce(
                (acc, child) => {
                  acc[child.name] = child;
                  return acc;
                },
                {} as Record<string, TreeNode>,
              ),
            )
          : undefined,
      }));

  return toArray(root);
}

/* ─── Default Icons ───────────────────────────────────────────────────── */

function DefaultFolderIcon(expanded: boolean) {
  return <span className="text-xs">{expanded ? '📂' : '📁'}</span>;
}

function DefaultFileIcon() {
  return <span className="text-xs text-gray-400">📄</span>;
}

function DefaultChevron(expanded: boolean) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'transition-transform duration-150',
        expanded && 'rotate-90',
      )}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* ─── Recursive Node Renderer ──────────────────────────────────────────── */

interface TreeNodeRendererProps {
  node: TreeNode;
  level: number;
  expanded: Set<string>;
  onToggle: (path: string) => void;
  onSelect: (path: string) => void;
  renderFolderIcon: (expanded: boolean) => ReactNode;
  renderFileIcon: () => ReactNode;
  renderChevron: (expanded: boolean) => ReactNode;
  nodeClassName?: string;
}

function TreeNodeRenderer({
  node,
  level,
  expanded,
  onToggle,
  onSelect,
  renderFolderIcon,
  renderFileIcon,
  renderChevron,
  nodeClassName,
}: TreeNodeRendererProps) {
  const isExpanded = expanded.has(node.path);

  if (node.type === 'folder') {
    return (
      <div>
        <button
          type="button"
          onClick={() => onToggle(node.path)}
          className={cn(
            'w-full text-left px-2 py-1 text-sm rounded flex items-center gap-1.5',
            'hover:bg-ink-soft/10 dark:hover:bg-white/10 transition-colors duration-150',
            'text-ink-soft dark:text-white/80',
            nodeClassName,
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <span className="shrink-0 text-[10px] opacity-60">
            {renderChevron(isExpanded)}
          </span>
          <span className="shrink-0">{renderFolderIcon(isExpanded)}</span>
          <span className="truncate">{node.name}</span>
        </button>
        {isExpanded && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNodeRenderer
                key={child.path}
                node={child}
                level={level + 1}
                expanded={expanded}
                onToggle={onToggle}
                onSelect={onSelect}
                renderFolderIcon={renderFolderIcon}
                renderFileIcon={renderFileIcon}
                renderChevron={renderChevron}
                nodeClassName={nodeClassName}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(node.path)}
      className={cn(
        'w-full text-left px-2 py-1 text-sm rounded flex items-center gap-1.5',
        'hover:bg-ink-soft/10 dark:hover:bg-white/10 transition-colors duration-150',
        'text-ink-soft dark:text-white/80',
        nodeClassName,
      )}
      style={{ paddingLeft: `${level * 16 + 8}px` }}
    >
      <span className="w-[10px] shrink-0" />
      <span className="shrink-0">{renderFileIcon()}</span>
      <span className="truncate">{node.name}</span>
    </button>
  );
}

/* ─── Component ────────────────────────────────────────────────────────── */

/**
 * Tree — A recursive tree component built from flat file paths.
 *
 * Accepts an array of file path strings, builds a nested folder/file
 * tree, and renders it as a collapsible, interactive list. Supports
 * custom folder/file icons, chevrons, and click handlers.
 *
 * Usage:
 *   <Tree
 *     paths={['a/b.ts', 'a/c.ts', 'd/e.ts']}
 *     onSelect={(path) => console.log('open', path)}
 *   />
 */
export function Tree({
  paths,
  onSelect,
  renderFolderIcon,
  renderFileIcon,
  renderChevron,
  defaultExpanded,
  showRootLabel = false,
  rootLabel = 'Files',
  className,
  nodeClassName,
}: TreeProps) {
  const tree = useMemo(() => buildTree(paths), [paths]);

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(defaultExpanded),
  );

  const toggleExpand = useCallback((path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const handleSelect = useCallback(
    (path: string) => {
      onSelect?.(path);
    },
    [onSelect],
  );

  if (paths.length === 0) {
    return null;
  }

  const folderIcon = renderFolderIcon ?? DefaultFolderIcon;
  const fileIcon = renderFileIcon ?? DefaultFileIcon;
  const chevron = renderChevron ?? DefaultChevron;

  return (
    <div className={cn('', className)}>
      {showRootLabel && (
        <div className="font-semibold text-xs text-ink-soft/60 dark:text-white/40 uppercase tracking-wider mb-1 px-2">
          {rootLabel}
        </div>
      )}
      <div className="text-xs space-y-0">
        {tree.map((node) => (
          <TreeNodeRenderer
            key={node.path}
            node={node}
            level={0}
            expanded={expanded}
            onToggle={toggleExpand}
            onSelect={handleSelect}
            renderFolderIcon={folderIcon}
            renderFileIcon={fileIcon}
            renderChevron={chevron}
            nodeClassName={nodeClassName}
          />
        ))}
      </div>
    </div>
  );
}

Tree.displayName = 'Tree';
