/**
 * Return today's date as a `YYYY-MM-DD` string.
 *
 * Useful for generating date-based slugs, filenames, or API query parameters.
 *
 * @example
 * ```ts
 * todaySlug(); // '2026-05-29'
 * ```
 */
export function todaySlug(): string {
  return new Date().toISOString().slice(0, 10);
}
