import { describe, it, expect } from 'vitest';
import { sleep } from '../sleep';

describe('sleep', () => {
  it('resolves after the given delay', async () => {
    const start = Date.now();
    await sleep(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(45);
  });

  it('resolves with void', async () => {
    const result = await sleep(10);
    expect(result).toBeUndefined();
  });

  it('handles 0 ms delay', async () => {
    const start = Date.now();
    await sleep(0);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it('handles large delay values', async () => {
    const start = Date.now();
    await sleep(10);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(5);
  });
});
