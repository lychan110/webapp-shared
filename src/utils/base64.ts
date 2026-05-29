/**
 * Encode a string to a URL-safe base64 string.
 *
 * Converts the input to UTF-8 bytes via `encodeURIComponent` / `unescape`,
 * then base64-encodes with `btoa` and strips padding characters.
 * Standard base64 `+` and `/` are replaced with `-` and `_` respectively
 * for URL-safe transport (RFC 4648 §5).
 *
 * Useful for Gmail API `raw` message payloads, JWT tokens, and any
 * context requiring base64url encoding in the browser.
 *
 * @example
 * toBase64Url('hello world')       // => 'aGVsbG8gd29ybGQ'
 * toBase64Url('héllo wörld')       // => 'aMOpbGxvIHfDtnJsZA'
 * toBase64Url('a+b/c=d')           // => 'YStiL2M9ZA'
 */
export function toBase64Url(s: string): string {
  return btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
