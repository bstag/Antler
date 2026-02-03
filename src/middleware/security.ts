import type { MiddlewareHandler } from 'astro';
import { isDev } from './auth-config';

export const securityMiddleware: MiddlewareHandler = async (context, next) => {
  const response = await next();

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HSTS - 1 year, include subdomains
  // Only applied if served over HTTPS (or in production generally)
  // For now we add it always as it's best practice, browsers ignore it on plain HTTP
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // X-XSS-Protection is largely deprecated in favor of CSP, but still useful for older browsers
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https: wss: ws:", // Allow ws/wss for HMR
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ];

  // Upgrade insecure requests only in production
  if (!isDev()) {
    csp.push("upgrade-insecure-requests");
  }

  response.headers.set('Content-Security-Policy', csp.join('; '));

  // Permissions Policy
  const permissions = [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "interest-cohort=()",
  ];

  response.headers.set('Permissions-Policy', permissions.join(', '));

  return response;
};
