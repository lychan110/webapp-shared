/**
 * Convert a string into a URL-friendly slug.
 *
 * Lowercases the input, replaces non-alphanumeric characters with hyphens,
 * and trims leading/trailing hyphens.
 *
 * @example
 * ```ts
 * slugify('Hello World!');     // 'hello-world'
 * slugify('Foo  Bar  Baz');    // 'foo-bar-baz'
 * slugify('--hello--');        // 'hello'
 * ```
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
