import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithBackoff } from '../fetch-with-backoff';

describe('fetchWithBackoff', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  it('returns response on success (200)', async () => {
    const mockResponse = new Response('ok', { status: 200 });
    globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

    // Real timers here since we don't need to simulate delays
    vi.useRealTimers();
    const res = await fetchWithBackoff('https://example.com/api', {});
    expect(res.status).toBe(200);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('retries on 429 (rate limited) then succeeds', async () => {
    const failResponse = new Response('rate limited', { status: 429 });
    const successResponse = new Response('ok', { status: 200 });

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(failResponse)
      .mockResolvedValueOnce(successResponse);

    globalThis.fetch = fetchMock;

    // We need to advance timers for the retry delays
    const promise = fetchWithBackoff('https://example.com/api', {}, 5);

    // First attempt returns 429, then there's a delay
    // Advance past the initial delay (2000ms + jitter)
    await vi.advanceTimersByTimeAsync(3000);

    const res = await promise;
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('exhausts retries and returns last response', async () => {
    const failResponse = new Response('service unavailable', { status: 503 });

    const fetchMock = vi.fn().mockResolvedValue(failResponse);
    globalThis.fetch = fetchMock;

    const promise = fetchWithBackoff('https://example.com/api', {}, 2);

    // Advance past all retry delays (max 2 retries = 3 total attempts)
    // delays: 2000, 4000
    await vi.advanceTimersByTimeAsync(20000);

    const res = await promise;
    expect(res.status).toBe(503);
    // maxRetries=2 means up to 3 attempts (0, 1, 2)
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('does not retry on 404', async () => {
    const notFoundResponse = new Response('not found', { status: 404 });
    globalThis.fetch = vi.fn().mockResolvedValue(notFoundResponse);

    vi.useRealTimers();
    const res = await fetchWithBackoff('https://example.com/api', {});
    expect(res.status).toBe(404);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 500 (only 429 and 503)', async () => {
    const serverErrorResponse = new Response('server error', { status: 500 });
    globalThis.fetch = vi.fn().mockResolvedValue(serverErrorResponse);

    vi.useRealTimers();
    const res = await fetchWithBackoff('https://example.com/api', {});
    expect(res.status).toBe(500);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('passes init options to fetch', async () => {
    const mockResponse = new Response('ok', { status: 200 });
    const fetchMock = vi.fn().mockResolvedValue(mockResponse);
    globalThis.fetch = fetchMock;

    const init: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' }),
    };

    vi.useRealTimers();
    await fetchWithBackoff('https://example.com/api', init);
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/api', init);
  });
});
