import { describe, it, expect } from 'vitest';
import { slugify } from '../slugify';

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz');
  });

  it('replaces consecutive non-alphanumeric chars with single hyphen', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('removes leading/trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
  });

  it('handles special characters', () => {
    expect(slugify('Hello World! @test #2024')).toBe('hello-world-test-2024');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles strings with only special chars', () => {
    expect(slugify('!!! @@@ ###')).toBe('');
  });

  it('handles already-slugified input', () => {
    expect(slugify('hello-world')).toBe('hello-world');
  });

  it('preserves numbers', () => {
    expect(slugify('Version 2.0 Release')).toBe('version-2-0-release');
  });

  it('handles underscores', () => {
    expect(slugify('snake_case_text')).toBe('snake-case-text');
  });
});
