/**
 * API Endpoint: POST /api/theme/set-default
 * Updates the site default theme in site.config.json
 * Admin only endpoint
 */

import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

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
    const configPath = path.join(process.cwd(), 'site.config.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configData);

    // Update theme default
    if (!config.customization) {
      config.customization = {};
    }
    if (!config.customization.theme) {
      config.customization.theme = {
        default: theme,
        allowUserOverride: true,
        availableThemes: VALID_THEMES,
      };
    } else {
      config.customization.theme.default = theme;
    }

    // Update lastModified
    config.lastModified = new Date().toISOString();

    // Write updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

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
    console.error('Error updating theme:', error);

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
