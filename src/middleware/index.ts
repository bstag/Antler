import { sequence } from 'astro:middleware';
import { routingMiddleware } from './routing';
import { authMiddleware } from './auth';

export const onRequest = sequence(
  authMiddleware,
  routingMiddleware
);
