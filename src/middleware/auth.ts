import type { MiddlewareHandler } from 'astro';
import { safeCompare } from '../lib/utils/security';
import { getAdminPassword, getAdminUser, isDev } from './auth-config';
import { startsWithBase } from '../lib/utils/path-matcher';

export const authMiddleware: MiddlewareHandler = async (context, next) => {
  const { url, request } = context;
  const adminPassword = getAdminPassword();

  const isProtectedPath = startsWithBase(url.pathname, '/admin') ||
                          startsWithBase(url.pathname, '/api/config') ||
                          startsWithBase(url.pathname, '/api/theme');

  // If no password configured, proceed
  // In a real production environment, we might want to default to denying access,
  // but to avoid breaking existing deployments that haven't set the env var yet,
  // we allow access and log a warning in development.
  if (!adminPassword) {
    if (isProtectedPath && isDev()) {
       console.warn('⚠️ ADMIN_PASSWORD not set. Admin interface and API are unsecured.');
    }
    return next();
  }

  // Protect Admin UI and Administrative APIs
  if (isProtectedPath) {
    const authHeader = request.headers.get('Authorization');

    if (authHeader) {
      const match = authHeader.match(/^Basic (.+)$/);
      if (match) {
        try {
            const credentials = atob(match[1]).split(':');
            const user = credentials[0];
            const pass = credentials[1];

            const validUser = getAdminUser() || 'admin';

            // Sentinel: Use constant-time comparison to prevent timing attacks
            const userStr = typeof user === 'string' ? user : '';
            const passStr = typeof pass === 'string' ? pass : '';
            const userOk = safeCompare(userStr, validUser);
            const passOk = safeCompare(passStr, adminPassword);

            if (userOk && passOk) {
              return next();
            }
        } catch (e) {
            // Malformed base64 or other error, treat as auth failure
        }
      }
    }

    // Return 401 Unauthorized which triggers the browser's native login prompt
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"'
      }
    });
  }

  return next();
};
