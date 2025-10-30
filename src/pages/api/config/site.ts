import type { APIRoute } from 'astro';
import { configManager } from '../../../lib/config/manager';
import type { SiteConfig } from '../../../types/config';
import { logger } from '../../../lib/utils/logger';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const config = await configManager.getConfig();
    
    return new Response(JSON.stringify(config), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    logger.error('Error fetching site configuration:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to fetch site configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const config = body as SiteConfig;
    
    const result = await configManager.saveConfig(config);
    
    if (!result.valid) {
      return new Response(JSON.stringify({
        error: 'Invalid configuration',
        errors: result.errors
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const updatedConfig = await configManager.getConfig();
    
    return new Response(JSON.stringify({
      success: true,
      config: updatedConfig
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    logger.error('Error updating site configuration:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to update site configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const updates = body as Partial<SiteConfig>;
    
    const result = await configManager.updateConfig(updates);
    
    if (!result.valid) {
      return new Response(JSON.stringify({
        error: 'Invalid configuration updates',
        errors: result.errors
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const updatedConfig = await configManager.getConfig();
    
    return new Response(JSON.stringify({
      success: true,
      config: updatedConfig
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    logger.error('Error partially updating site configuration:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to update site configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};