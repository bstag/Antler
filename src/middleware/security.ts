import type { MiddlewareHandler } from 'astro';

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

  return response;
};
