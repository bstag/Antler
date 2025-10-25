import type { MiddlewareHandler } from 'astro';
import { configManager } from '../lib/config/manager';

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

    // Get current site configuration
    const config = await configManager.getConfig();
    
    // Check if the requested route corresponds to a disabled content type
    const matchingContentType = config.contentTypes.find(ct => 
      pathname.startsWith(ct.route) && pathname !== '/'
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
      pathname.startsWith(nav.href) && pathname !== '/'
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
    console.error('Routing middleware error:', error);
    // On error, allow the request to continue to avoid breaking the site
    return next();
  }
};

export default routingMiddleware;