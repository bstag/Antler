import { sequence } from 'astro:middleware';
import { routingMiddleware } from './routing';

export const onRequest = sequence(
  routingMiddleware
);