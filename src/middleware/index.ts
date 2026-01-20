import { sequence } from 'astro:middleware';
import { routingMiddleware } from './routing';
import { authMiddleware } from './auth';
import { securityMiddleware } from './security';
import { rateLimitMiddleware } from './rate-limit';

export const onRequest = sequence(
  securityMiddleware,
  rateLimitMiddleware,
  authMiddleware,
  routingMiddleware
);
