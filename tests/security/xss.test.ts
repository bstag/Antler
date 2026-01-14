import { describe, it, expect } from 'vitest';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Setup JSDOM for DOMPurify to work in Node environment
const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

describe('XSS Prevention', () => {
  it('should sanitize malicious script tags in HTML', () => {
    const maliciousInput = '<p>Hello <script>alert("XSS")</script></p>';
    const clean = purify.sanitize(maliciousInput);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('Hello');
  });

  it('should sanitize javascript: href attributes', () => {
    const maliciousInput = '<a href="javascript:alert(1)">Click me</a>';
    const clean = purify.sanitize(maliciousInput);
    expect(clean).not.toContain('javascript:');
    expect(clean).toContain('Click me');
  });

  it('should sanitize malicious SVG content', () => {
    const maliciousSvg = '<svg><script>alert(1)</script><rect width="10" height="10" /></svg>';
    const clean = purify.sanitize(maliciousSvg);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('<rect');
  });

  it('should allow safe HTML', () => {
    const safeInput = '<p><strong>Safe</strong> content</p>';
    const clean = purify.sanitize(safeInput);
    expect(clean).toBe(safeInput);
  });
});
