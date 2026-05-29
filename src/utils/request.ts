/**
 * Typed fetch wrapper with JSON request/response handling.
 *
 * Makes an HTTP request with optional JSON body, parses the JSON response,
 * and throws a descriptive error on non-OK status codes.
 * The error message is extracted from the response body's `error` field
 * if available, falling back to `statusText`.
 *
 * @typeParam T - The expected shape of the JSON response body.
 * @param method - HTTP method (`'GET'`, `'POST'`, `'DELETE'`, etc.).
 * @param url - The request URL (may be relative if a base is configured upstream).
 * @param body - Optional JSON-serializable request body (sets `Content-Type: application/json`).
 * @returns The parsed JSON response typed as `T`.
 * @throws `Error` with a human-readable message if the response is not OK.
 *
 * @example
 * const config = await req<{ requiresPin: boolean }>('GET', '/api/scripts/config');
 *
 * @example
 * const result = await req<{ id: string }>('POST', '/api/items', { name: 'foo' });
 */
export async function req<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err: { error?: string } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }

  return res.json() as Promise<T>;
}
