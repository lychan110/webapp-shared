/**
 * LCS-based line-diff utilities.
 *
 * Computes the longest-common-subsequence diff between two strings
 * (split by newline) and provides helpers for context collapsing and
 * change counting.  Zero external dependencies.
 *
 * @module
 */

/** A single line in a raw diff result. */
export type DiffLine = { type: 'equal' | 'add' | 'del'; text: string };

/** A line in a context-collapsed diff, possibly representing a gap. */
export type HunkLine = DiffLine | { type: 'gap'; count: number };

/**
 * Compute an LCS line-diff from `a` → `b`.
 *
 * - `'del'` lines exist only in `a` (removed going a→b).
 * - `'add'` lines exist only in `b` (added going a→b).
 * - `'equal'` lines are unchanged.
 *
 * Falls back to a naïve full-add/del when the input exceeds 600 000
 * cells (≈775 × 775 lines) to avoid O(mn) memory blowup.
 *
 * @param aText - The original text.
 * @param bText - The modified text.
 *
 * @example
 * const diff = diffLines('a\nb\nc', 'a\nd\nc');
 * // → [{ type:'equal', text:'a' }, { type:'del', text:'b' },
 * //     { type:'add', text:'d' }, { type:'equal', text:'c' }]
 */
export function diffLines(aText: string, bText: string): DiffLine[] {
  const a = aText.split('\n');
  const b = bText.split('\n');
  const m = a.length;
  const n = b.length;

  // Safety: avoid O(mn) blowup on very large inputs
  if (m * n > 600_000) {
    return [
      ...a.map((text) => ({ type: 'del' as const, text })),
      ...b.map((text) => ({ type: 'add' as const, text })),
    ];
  }

  // Build LCS table (backwards)
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  // Walk the table to produce the diff
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && a[i] === b[j]) {
      result.push({ type: 'equal', text: a[i] });
      i++;
      j++;
    } else if (j < n && (i >= m || dp[i + 1][j] <= dp[i][j + 1])) {
      result.push({ type: 'add', text: b[j] });
      j++;
    } else {
      result.push({ type: 'del', text: a[i] });
      i++;
    }
  }

  return result;
}

/**
 * Collapse long runs of unchanged lines, keeping `ctx` lines of context
 * around each changed region.
 *
 * @param diff - The raw diff output from {@link diffLines}.
 * @param ctx  - Number of unchanged lines to keep on each side (default `3`).
 * @returns A condensed diff with `{ type: 'gap', count }` markers inserted
 *          where whole runs were removed.
 *
 * @example
 * withContext(diff, 2)
 * // → keeps up to 2 equal lines before/after each change,
 * //   replaces longer equal runs with a gap marker.
 */
export function withContext(diff: DiffLine[], ctx = 3): HunkLine[] {
  const n = diff.length;

  // Indices of lines that changed
  const changed = new Set<number>();
  diff.forEach((l, i) => {
    if (l.type !== 'equal') changed.add(i);
  });
  if (changed.size === 0) return [];

  // Expand to include context lines
  const visible = new Set<number>();
  for (const ci of changed) {
    for (let k = Math.max(0, ci - ctx); k <= Math.min(n - 1, ci + ctx); k++) visible.add(k);
  }

  const result: HunkLine[] = [];
  let prev = -1;
  for (let i = 0; i < n; i++) {
    if (!visible.has(i)) continue;
    if (prev !== -1 && i > prev + 1) result.push({ type: 'gap', count: i - prev - 1 });
    result.push(diff[i]);
    prev = i;
  }

  return result;
}

/**
 * Count added / deleted lines in a diff result.
 *
 * @returns An object with `adds`, `dels`, and `total` counts.
 */
export function countChanges(diff: DiffLine[]): { adds: number; dels: number; total: number } {
  let adds = 0;
  let dels = 0;
  for (const l of diff) {
    if (l.type === 'add') adds++;
    else if (l.type === 'del') dels++;
  }
  return { adds, dels, total: adds + dels };
}
