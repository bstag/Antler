import { describe, it, expect, vi } from 'vitest';
import { securityMiddleware } from '../../src/middleware/security';

describe('Security Middleware', () => {
  it('should add security headers to the response', async () => {
    const context = {
      url: new URL('http://localhost:3000/'),
      request: new Request('http://localhost:3000/'),
    } as any;

    const next = vi.fn().mockResolvedValue(new Response('OK'));

    const response = await securityMiddleware(context, next) as Response;

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
  });
});
