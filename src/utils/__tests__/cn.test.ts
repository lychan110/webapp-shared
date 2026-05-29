import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn', () => {
  it('merges class strings', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('handles conditional classes via boolean', () => {
    expect(cn('base', true && 'visible', false && 'hidden')).toBe('base visible');
  });

  it('handles conditional classes via ternary', () => {
    expect(cn('base', false ? 'a' : 'b')).toBe('base b');
  });

  it('merges conflicting Tailwind classes (last wins)', () => {
    // tailwind-merge should resolve conflicts — 'px-4' wins over 'px-2'
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('merges padding conflicts correctly', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles null and undefined', () => {
    expect(cn('a', null, undefined, 'b')).toBe('a b');
  });

  it('handles array arguments', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });

  it('resolves margin conflicts', () => {
    expect(cn('m-2', 'm-4')).toBe('m-4');
  });

  it('preserves non-conflicting classes', () => {
    expect(cn('text-red-500', 'bg-blue-200')).toBe('text-red-500 bg-blue-200');
  });
});
