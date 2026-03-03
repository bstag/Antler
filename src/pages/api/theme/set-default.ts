/**
 * API Endpoint: POST /api/theme/set-default
 * Updates the site default theme in site.config.json
 * Admin only endpoint
 */

import type { APIRoute } from 'astro';
import { configManager } from '../../../lib/config/manager';
import { logger } from '../../../lib/utils/logger';

export const prerender = false;

// List of valid theme names
const VALID_THEMES = [
  'blue', 'indigo', 'purple', 'pink', 'rose', 'red',
  'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'slate',
];

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json();
    const { theme } = body;

    // Validate theme
    if (!theme || typeof theme !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Invalid request: theme is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!VALID_THEMES.includes(theme)) {
      return new Response(
        JSON.stringify({
          error: `Invalid theme: ${theme}. Must be one of: ${VALID_THEMES.join(', ')}`,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Read current config
    const config = await configManager.getConfig();

    // Update theme default
    const currentCustomization = config.customization || {};
    const updatedCustomization = {
      ...currentCustomization,
      theme: currentCustomization.theme ? {
        ...currentCustomization.theme,
        default: theme
      } : {
        default: theme,
        allowUserOverride: true,
        availableThemes: VALID_THEMES,
      }
    };

    // Write updated config
    const updateResult = await configManager.updateConfig({ customization: updatedCustomization });

    if (!updateResult.valid) {
      return new Response(
        JSON.stringify({
          error: 'Invalid configuration updates',
          errors: updateResult.errors
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        theme: theme,
        message: `Site default theme updated to ${theme}`,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    logger.error('Error updating theme:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to update theme configuration',
        details: error instanceof Error ? error.message : 'Unknown error',
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
