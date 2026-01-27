import { describe, it, expect } from 'vitest';
import { safeCompare } from '../../../lib/utils/security';

describe('safeCompare', () => {
  it('returns true for identical strings', () => {
    expect(safeCompare('secret', 'secret')).toBe(true);
    expect(safeCompare('super-long-password-123!', 'super-long-password-123!')).toBe(true);
  });

  it('returns false for different strings of same length', () => {
    expect(safeCompare('secret', 'secreT')).toBe(false);
    expect(safeCompare('123456', '123455')).toBe(false);
  });

  it('returns false for different strings of different length', () => {
    expect(safeCompare('secret', 'secret1')).toBe(false);
    expect(safeCompare('super', 'sup')).toBe(false);
  });

  it('handles empty strings', () => {
    expect(safeCompare('', '')).toBe(true);
    expect(safeCompare('a', '')).toBe(false);
    expect(safeCompare('', 'a')).toBe(false);
  });

  it('handles unicode characters', () => {
    expect(safeCompare('🚀', '🚀')).toBe(true);
    expect(safeCompare('🚀', '🛸')).toBe(false);
  });
});
