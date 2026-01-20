import type { MiddlewareHandler } from 'astro';

// Simple in-memory rate limiting
// Map<IP, { count: number, resetTime: number }>
const rateLimits = new Map<string, { count: number, resetTime: number }>();

const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

// Cleanup interval (every 5 minutes) to prevent memory leaks
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimits.entries()) {
    if (now > data.resetTime) {
      rateLimits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Ensure interval doesn't block process exit
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

export const rateLimitMiddleware: MiddlewareHandler = async (context, next) => {
  const { url, clientAddress } = context;

  // Only rate limit admin routes
  if (url.pathname.startsWith('/admin')) {
    // Get client IP - fallback to 'unknown' if not available
    let ip = 'unknown';
    try {
        if (clientAddress) {
            ip = clientAddress;
        }
    } catch (e) {
        // Ignore errors retrieving IP
    }

    const now = Date.now();
    const limitData = rateLimits.get(ip);

    if (limitData) {
      if (now < limitData.resetTime) {
        limitData.count++;
        if (limitData.count > MAX_REQUESTS) {
           const retryAfter = Math.ceil((limitData.resetTime - now) / 1000);
           return new Response(`Too Many Requests. Please try again in ${retryAfter} seconds.`, {
             status: 429,
             headers: {
               'Retry-After': retryAfter.toString(),
               'Content-Type': 'text/plain'
             }
           });
        }
      } else {
        // Reset window
        limitData.count = 1;
        limitData.resetTime = now + WINDOW_SIZE_MS;
      }
    } else {
      // New entry
      rateLimits.set(ip, {
        count: 1,
        resetTime: now + WINDOW_SIZE_MS
      });
    }
  }

  return next();
};
