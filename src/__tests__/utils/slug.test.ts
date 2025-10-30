import { describe, it, expect } from 'vitest';
import { generateSlug } from '../../lib/utils/slug';

describe('generateSlug', () => {
  it('should convert basic text to lowercase slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('should handle multiple words with spaces', () => {
    expect(generateSlug('My Blog Post')).toBe('my-blog-post');
  });

  it('should remove special characters', () => {
    expect(generateSlug('Hello! @#$ World?')).toBe('hello-world');
  });

  it('should respect maxLength parameter', () => {
    const longText = 'This is a very long title that should be truncated';
    expect(generateSlug(longText, 20)).toHaveLength(20);
    expect(generateSlug(longText, 20)).toBe('this-is-a-very-long-');
  });

  it('should trim leading and trailing dashes', () => {
    expect(generateSlug('---hello---')).toBe('hello');
  });

  it('should handle empty strings', () => {
    expect(generateSlug('')).toBe('');
  });

  it('should handle strings with only special characters', () => {
    expect(generateSlug('!@#$%^&*()')).toBe('');
  });

  it('should handle mixed case with numbers', () => {
    expect(generateSlug('Project 123 Version 2.0')).toBe('project-123-version-2-0');
  });

  it('should handle unicode characters', () => {
    expect(generateSlug('Café & Restaurant')).toBe('caf-restaurant');
  });

  it('should handle consecutive special characters', () => {
    expect(generateSlug('Hello!!!   World???')).toBe('hello-world');
  });

  it('should use default maxLength of 50', () => {
    const longText = 'a'.repeat(100);
    expect(generateSlug(longText)).toHaveLength(50);
  });

  it('should handle whitespace-only strings', () => {
    expect(generateSlug('   ')).toBe('');
  });

  it('should preserve numbers and letters only', () => {
    expect(generateSlug('abc123XYZ')).toBe('abc123xyz');
  });

  it('should handle strings that start and end with valid characters', () => {
    expect(generateSlug('hello-world')).toBe('hello-world');
  });

  it('should handle maxLength shorter than result', () => {
    expect(generateSlug('hello-world', 5)).toBe('hello');
  });

  it('should handle maxLength of 0', () => {
    expect(generateSlug('hello world', 0)).toBe('');
  });
});