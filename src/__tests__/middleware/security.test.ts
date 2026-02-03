import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { securityMiddleware } from '../../middleware/security';
import * as authConfig from '../../middleware/auth-config';

// Mock the auth-config module
vi.mock('../../middleware/auth-config', () => ({
  getAdminPassword: vi.fn(),
  getAdminUser: vi.fn(),
  isDev: vi.fn(),
}));

describe('securityMiddleware', () => {
  let context: any;
  let next: any;

  beforeEach(() => {
    context = {
      url: new URL('http://localhost:3000/admin/dashboard'), // Default to admin route
      request: {
        headers: new Map(),
      },
    };
    next = vi.fn(() => new Response('ok'));

    // Default mock implementation
    vi.mocked(authConfig.isDev).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('adds security headers to admin response', async () => {
    const result = await securityMiddleware(context, next) as Response;

    expect(next).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Response);

    // Existing headers
    expect(result.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(result.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(result.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(result.headers.get('Strict-Transport-Security')).toBeDefined();
    expect(result.headers.get('X-XSS-Protection')).toBe('1; mode=block');
  });

  it('does NOT add security headers to non-admin response', async () => {
    context.url = new URL('http://localhost:3000/blog/my-post');
    const result = await securityMiddleware(context, next) as Response;

    expect(result.headers.get('Content-Security-Policy')).toBeNull();
    expect(result.headers.get('X-Frame-Options')).toBeNull();
  });

  it('adds Content-Security-Policy header to admin routes', async () => {
    const result = await securityMiddleware(context, next) as Response;
    const csp = result.headers.get('Content-Security-Policy');

    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
  });

  it('adds Permissions-Policy header to admin routes', async () => {
    const result = await securityMiddleware(context, next) as Response;
    const pp = result.headers.get('Permissions-Policy');

    expect(pp).toBeDefined();
    expect(pp).toContain("camera=()");
  });

  it('excludes upgrade-insecure-requests in dev mode', async () => {
    vi.mocked(authConfig.isDev).mockReturnValue(true);
    const result = await securityMiddleware(context, next) as Response;
    const csp = result.headers.get('Content-Security-Policy');

    if (csp) {
        expect(csp).not.toContain('upgrade-insecure-requests');
    }
  });

  it('includes upgrade-insecure-requests in prod mode', async () => {
    vi.mocked(authConfig.isDev).mockReturnValue(false);
    const result = await securityMiddleware(context, next) as Response;
    const csp = result.headers.get('Content-Security-Policy');

    expect(csp).toBeDefined();
    expect(csp).toContain('upgrade-insecure-requests');
  });
});
