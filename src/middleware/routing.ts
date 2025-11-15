import type { MiddlewareHandler } from 'astro';
import { configManager } from '../lib/config/manager';
import { logger } from '../lib/utils/logger';

export const routingMiddleware: MiddlewareHandler = async (context, next) => {
  const { url } = context;
  const pathname = url.pathname;

  try {
    // Skip middleware for API routes, admin routes, and static assets
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/_astro/') ||
      pathname.startsWith('/favicon') ||
      pathname.includes('.')
    ) {
      return next();
    }

    const config = await configManager.getConfig();
    const base = (import.meta as any).env?.BASE_URL || '';
    const basePrefix = typeof base === 'string' ? (base.endsWith('/') ? base.slice(0, -1) : base) : '';
    const normalizedPath = basePrefix && pathname.startsWith(basePrefix) ? pathname.slice(basePrefix.length) || '/' : pathname;
    
    // Check if the requested route corresponds to a disabled content type
    const matchingContentType = config.contentTypes.find(ct => 
      normalizedPath.startsWith(ct.route) && normalizedPath !== '/'
    );

    if (matchingContentType && !matchingContentType.enabled) {
      // Content type is disabled, return 404
      return new Response(null, {
        status: 404,
        statusText: 'Not Found'
      });
    }

    // Check if navigation item exists and is enabled for the route
    const matchingNavItem = config.navigation.find(nav => 
      normalizedPath.startsWith(nav.href) && normalizedPath !== '/'
    );

    if (matchingNavItem && !matchingNavItem.enabled) {
      // Navigation item is disabled, return 404
      return new Response(null, {
        status: 404,
        statusText: 'Not Found'
      });
    }

    // Continue with the request
    return next();
  } catch (error) {
    logger.error('Routing middleware error:', error);
    // On error, allow the request to continue to avoid breaking the site
    return next();
  }
};

export default routingMiddleware;
