/**
 * API Endpoint: GET /api/theme/metadata
 * Returns metadata for all available themes
 */

import type { APIRoute } from 'astro';
import { getAllThemeMetadata } from '../../../lib/theme/theme-registry';
import { logger } from '../../../lib/utils/logger';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const themes = getAllThemeMetadata();

    return new Response(
      JSON.stringify({
        themes,
        count: themes.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    logger.error('Error fetching theme metadata:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to load theme metadata',
        themes: [],
        count: 0,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
