import type { APIRoute } from 'astro';
import { SITE_TEMPLATES } from '../../../lib/config/defaults';
import { configManager } from '../../../lib/config/manager';
import { logger } from '../../../lib/utils/logger';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    return new Response(JSON.stringify({
      templates: SITE_TEMPLATES
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    logger.error('Error fetching site templates:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to fetch site templates',
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
    const { templateId } = body;
    
    if (!templateId || typeof templateId !== 'string') {
      return new Response(JSON.stringify({
        error: 'Template ID is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const template = SITE_TEMPLATES[templateId];
    if (!template) {
      return new Response(JSON.stringify({
        error: 'Template not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const result = await configManager.applyTemplate(templateId);
    
    if (!result.valid) {
      return new Response(JSON.stringify({
        error: 'Failed to apply template',
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
      config: updatedConfig,
      template: template
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    logger.error('Error applying site template:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to apply site template',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};