import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimitMiddleware } from '../../src/middleware/rate-limit';

describe('Rate Limit Middleware', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should allow requests under the limit', async () => {
    const next = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
    const context = {
      url: new URL('http://localhost/admin/dashboard'),
      clientAddress: '127.0.0.1'
    } as any;

    // Simulate 60 requests
    for (let i = 0; i < 60; i++) {
      const response = await rateLimitMiddleware(context, next);
      expect(response.status).toBe(200);
    }

    expect(next).toHaveBeenCalledTimes(60);
  });

  it('should block requests over the limit', async () => {
    const next = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
    const context = {
      url: new URL('http://localhost/admin/dashboard'),
      clientAddress: '127.0.0.2' // Different IP
    } as any;

    // Consume limit
    for (let i = 0; i < 60; i++) {
      await rateLimitMiddleware(context, next);
    }

    // 61st request
    const response = await rateLimitMiddleware(context, next);

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBeDefined();
    expect(await response.text()).toContain('Too Many Requests');

    // Next should not be called for blocked request
    expect(next).toHaveBeenCalledTimes(60);
  });

  it('should reset limit after window expires', async () => {
    const next = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
    const context = {
      url: new URL('http://localhost/admin/dashboard'),
      clientAddress: '127.0.0.3'
    } as any;

    // Consume limit
    for (let i = 0; i < 60; i++) {
      await rateLimitMiddleware(context, next);
    }

    // Verify blocked
    const blockedResponse = await rateLimitMiddleware(context, next);
    expect(blockedResponse.status).toBe(429);

    // Advance time by 61 seconds
    vi.advanceTimersByTime(61000);

    // Should be allowed again
    const allowedResponse = await rateLimitMiddleware(context, next);
    expect(allowedResponse.status).toBe(200);
  });

  it('should ignore non-admin routes', async () => {
    const next = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
    const context = {
      url: new URL('http://localhost/blog'),
      clientAddress: '127.0.0.4'
    } as any;

    // Send 100 requests
    for (let i = 0; i < 100; i++) {
      const response = await rateLimitMiddleware(context, next);
      expect(response.status).toBe(200);
    }
  });

  it('should handle missing clientAddress', async () => {
    const next = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
    const context = {
      url: new URL('http://localhost/admin/dashboard'),
      // clientAddress undefined
    } as any;

    // Should default to 'unknown' IP and still rate limit
    for (let i = 0; i < 60; i++) {
        await rateLimitMiddleware(context, next);
    }

    const response = await rateLimitMiddleware(context, next);
    expect(response.status).toBe(429);
  });
});
