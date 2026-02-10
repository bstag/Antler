import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authMiddleware } from '../../middleware/auth';
import * as authConfig from '../../middleware/auth-config';

// Mock the entire auth-config module
vi.mock('../../middleware/auth-config', () => ({
  getAdminPassword: vi.fn(),
  getAdminUser: vi.fn(),
  isDev: vi.fn(),
}));

describe('authMiddleware', () => {
  let context: any;
  let next: any;

  beforeEach(() => {
    context = {
      url: new URL('http://localhost:3000/'),
      request: {
        headers: new Map(),
      },
    };
    next = vi.fn(() => 'next-called');

    // Default mock implementation
    vi.mocked(authConfig.isDev).mockReturnValue(true);
    vi.mocked(authConfig.getAdminPassword).mockReturnValue(undefined);
    vi.mocked(authConfig.getAdminUser).mockReturnValue('admin');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('allows access when ADMIN_PASSWORD is not set', async () => {
    context.url = new URL('http://localhost:3000/admin/dashboard');
    vi.mocked(authConfig.getAdminPassword).mockReturnValue(undefined);

    const result = await authMiddleware(context, next);

    expect(next).toHaveBeenCalled();
    expect(result).toBe('next-called');
  });

  it('allows access to non-admin routes even if password is set', async () => {
    vi.mocked(authConfig.getAdminPassword).mockReturnValue('secret');
    context.url = new URL('http://localhost:3000/blog');

    const result = await authMiddleware(context, next);

    expect(next).toHaveBeenCalled();
    expect(result).toBe('next-called');
  });

  it('denies access to /admin when ADMIN_PASSWORD is set and no header', async () => {
    vi.mocked(authConfig.getAdminPassword).mockReturnValue('secret');
    context.url = new URL('http://localhost:3000/admin/dashboard');

    const result = await authMiddleware(context, next) as Response;

    expect(next).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(401);
    expect(result.headers.get('WWW-Authenticate')).toBe('Basic realm="Admin Area"');
  });

  it('denies access with incorrect credentials', async () => {
    vi.mocked(authConfig.getAdminPassword).mockReturnValue('secret');
    context.url = new URL('http://localhost:3000/admin/dashboard');
    context.request.headers.set('Authorization', 'Basic ' + btoa('admin:wrong'));

    const result = await authMiddleware(context, next) as Response;

    expect(next).not.toHaveBeenCalled();
    expect(result.status).toBe(401);
  });

  it('allows access with correct credentials', async () => {
    vi.mocked(authConfig.getAdminPassword).mockReturnValue('secret');
    context.url = new URL('http://localhost:3000/admin/dashboard');
    context.request.headers.set('Authorization', 'Basic ' + btoa('admin:secret'));

    const result = await authMiddleware(context, next);

    expect(next).toHaveBeenCalled();
    expect(result).toBe('next-called');
  });

  it('respects custom ADMIN_USER', async () => {
    vi.mocked(authConfig.getAdminPassword).mockReturnValue('secret');
    vi.mocked(authConfig.getAdminUser).mockReturnValue('superadmin');
    context.url = new URL('http://localhost:3000/admin/dashboard');
    context.request.headers.set('Authorization', 'Basic ' + btoa('superadmin:secret'));

    const result = await authMiddleware(context, next);

    expect(next).toHaveBeenCalled();
    expect(result).toBe('next-called');
  });

  // Security Regression Tests
  it('denies access to /api/config routes when unauthenticated', async () => {
    vi.mocked(authConfig.getAdminPassword).mockReturnValue('secret');
    context.url = new URL('http://localhost:3000/api/config/site');

    const result = await authMiddleware(context, next) as Response;

    expect(next).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(401);
  });

  it('denies access to /api/theme routes when unauthenticated', async () => {
    vi.mocked(authConfig.getAdminPassword).mockReturnValue('secret');
    context.url = new URL('http://localhost:3000/api/theme/set-default');

    const result = await authMiddleware(context, next) as Response;

    expect(next).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(401);
  });

  it('allows access to /api/config routes when authenticated', async () => {
    vi.mocked(authConfig.getAdminPassword).mockReturnValue('secret');
    context.url = new URL('http://localhost:3000/api/config/site');
    context.request.headers.set('Authorization', 'Basic ' + btoa('admin:secret'));

    const result = await authMiddleware(context, next);

    expect(next).toHaveBeenCalled();
    expect(result).toBe('next-called');
  });
});
