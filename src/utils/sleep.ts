/**
 * Sleep for a given number of milliseconds.
 *
 * Useful for introducing artificial delays, rate-limiting, or waiting
 * between asynchronous operations.
 *
 * @example
 * ```ts
 * await sleep(1000); // wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
