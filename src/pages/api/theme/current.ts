/**
 * API Endpoint: GET /api/theme/current
 * Returns current theme configuration and user preferences
 */

import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { logger } from '../../../lib/utils/logger';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Read site.config.json
    const configPath = path.join(process.cwd(), 'site.config.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configData);

    const themeConfig = config.customization?.theme || {
      default: 'blue',
      allowUserOverride: true,
      availableThemes: ['blue'],
    };

    // Check for user preference in request (from localStorage on client)
    // Note: localStorage is client-side only, so we can't access it server-side
    // The client will handle merging this with their localStorage
    const response = {
      siteDefault: themeConfig.default,
      userPreference: null, // Client will fill this from localStorage
      active: themeConfig.default, // Default to site default
      allowUserOverride: themeConfig.allowUserOverride,
      availableThemes: themeConfig.availableThemes,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    logger.error('Error reading theme config:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to load theme configuration',
        siteDefault: 'blue',
        userPreference: null,
        active: 'blue',
        allowUserOverride: true,
        availableThemes: ['blue'],
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
