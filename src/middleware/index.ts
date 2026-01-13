import { sequence } from 'astro:middleware';
import { routingMiddleware } from './routing';
import { authMiddleware } from './auth';
import { securityMiddleware } from './security';

export const onRequest = sequence(
  securityMiddleware,
  authMiddleware,
  routingMiddleware
);
