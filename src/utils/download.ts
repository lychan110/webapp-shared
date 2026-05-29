/**
 * Browser-side file download utilities.
 *
 * All functions use the `URL.createObjectURL` + programmatic click + revoke
 * pattern to trigger a file download without requiring a server round-trip.
 */

/**
 * Download an arbitrary blob as a file.
 *
 * @example
 * ```ts
 * const blob = new Blob(['hello'], { type: 'text/plain' });
 * downloadFile(blob, 'greeting.txt');
 * ```
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Serialise a JSON-serialisable value to a `.json` file and trigger a download.
 *
 * @example
 * ```ts
 * downloadJSON({ users: ['alice', 'bob'] }, 'users.json');
 * ```
 */
export function downloadJSON<T>(data: T, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  downloadFile(blob, filename);
}

/**
 * Serialise tabular data to a CSV string and trigger a download.
 *
 * @param headers - Column header names.
 * @param rows    - Array of cells per row. Each cell is coerced to a string and
 *                  wrapped in quotes to escape embedded commas or newlines.
 *
 * @example
 * ```ts
 * downloadCSV(
 *   ['Name', 'Email'],
 *   [
 *     ['Alice', 'alice@example.com'],
 *     ['Bob',   'bob@example.com'],
 *   ],
 *   'contacts.csv',
 * );
 * ```
 */
export function downloadCSV(
  headers: string[],
  rows: string[][],
  filename: string,
): void {
  const escapeCell = (cell: string): string => {
    const s = String(cell);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const csv = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
}
