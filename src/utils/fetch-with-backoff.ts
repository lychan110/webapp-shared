/**
 * Fetch with exponential backoff — retries on transient server errors.
 *
 * Retries when the response status is `429 Too Many Requests` or
 * `503 Service Unavailable`.  Each retry doubles the delay (capped at 64 s)
 * with ±20 % jitter to avoid thundering-herd contention.
 *
 * @param url     - The URL to fetch.
 * @param init    - Standard `RequestInit` options (method, headers, body, …).
 * @param maxRetries - Maximum number of retry attempts (default `5`).
 * @returns The response from the first non-retryable status, or the last
 *          retryable response if all retries are exhausted.
 *
 * @example
 * const res = await fetchWithBackoff('https://api.example.com/data', {
 *   headers: { Authorization: 'Bearer …' },
 * });
 * if (!res.ok) throw new Error(`API error ${res.status}`);
 */
export async function fetchWithBackoff(
  url: string,
  init: RequestInit,
  maxRetries = 5,
): Promise<Response> {
  let delay = 2000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, init);

    // Only retry on rate-limit / temporary server overload
    if (res.status !== 429 && res.status !== 503) return res;
    if (attempt === maxRetries) return res;

    // Jitter: ±20 % of current delay
    const jitter = delay * 0.2 * (Math.random() * 2 - 1);
    await new Promise<void>((r) => setTimeout(r, delay + jitter));

    delay = Math.min(delay * 2, 64_000);
  }

  // TypeScript guard — the loop always returns or throws above
  throw new Error('Unreachable');
}
