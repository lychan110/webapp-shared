import { describe, it, expect } from 'vitest';
import { diffLines, withContext, countChanges, type DiffLine } from '../diff';

const A = ['a', 'b', 'c'].join('\n');
const A_no_b = ['a', 'c'].join('\n');
const A_with_d = ['a', 'd', 'c'].join('\n');
const B = ['x', 'y', 'z'].join('\n');
const single = 'abc';
const other = 'xyz';

describe('diffLines', () => {
  it('handles identical multi-line strings', () => {
    const result = diffLines(A, A);
    // May return empty array or array of equal lines — both are valid
    expect(result.every((l: { type: string }) => l.type === 'equal' || result.length === 0)).toBe(true);
  });

  it('detects additions', () => {
    const result = diffLines(A_no_b, A);
    const adds = result.filter((l) => l.type === 'add');
    expect(adds.length).toBeGreaterThanOrEqual(1);
    expect(adds.some((l) => l.text === 'b')).toBe(true);
  });

  it('detects deletions', () => {
    const result = diffLines(A, A_no_b);
    const dels = result.filter((l) => l.type === 'del');
    expect(dels.length).toBeGreaterThanOrEqual(1);
    expect(dels.some((l) => l.text === 'b')).toBe(true);
  });

  it('detects mixed changes', () => {
    const result = diffLines(A, A_with_d);
    expect(result.some((l) => l.type === 'del' && l.text === 'b')).toBe(true);
    expect(result.some((l) => l.type === 'add' && l.text === 'd')).toBe(true);
  });

  it('handles completely different strings', () => {
    const result = diffLines(single, other);
    expect(result.some((l) => l.type === 'del')).toBe(true);
    expect(result.some((l) => l.type === 'add')).toBe(true);
  });

  it('handles empty strings', () => {
    const emptyToA = diffLines('', 'a');
    const aToEmpty = diffLines('a', '');
    // At least one of them should have a non-equal line
    expect(emptyToA.length + aToEmpty.length).toBeGreaterThan(0);
  });
});

describe('withContext', () => {
  it('returns empty for unchanged diff', () => {
    expect(withContext([])).toEqual([]);
  });

  it('collapses context around changes', () => {
    const diff: DiffLine[] = [
      { type: 'equal', text: 'a' },
      { type: 'equal', text: 'b' },
      { type: 'equal', text: 'c' },
      { type: 'del', text: 'd' },
      { type: 'add', text: 'e' },
      { type: 'equal', text: 'f' },
      { type: 'equal', text: 'g' },
      { type: 'equal', text: 'h' },
    ];
    const result = withContext(diff, 1);
    expect(result.length).toBeLessThan(diff.length);
  });
});

describe('countChanges', () => {
  it('counts additions and deletions', () => {
    const diff: DiffLine[] = [
      { type: 'equal', text: 'a' },
      { type: 'del', text: 'b' },
      { type: 'add', text: 'c' },
      { type: 'add', text: 'd' },
      { type: 'equal', text: 'e' },
    ];
    expect(countChanges(diff)).toEqual({ adds: 2, dels: 1, total: 3 });
  });

  it('returns zeros for empty diff', () => {
    expect(countChanges([])).toEqual({ adds: 0, dels: 0, total: 0 });
  });
});
