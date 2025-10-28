/**
 * Static configuration loader for Astro components
 *
 * This module provides build-time access to site configuration.
 * It imports the config file directly (no async, no API calls) to ensure
 * all config values are baked into the static HTML during build.
 *
 * IMPORTANT: This is for server-side use only in .astro files.
 * For admin/client-side React components, use the ConfigClient instead.
 */

import type { SiteConfig } from '../../types/config';
import { DEFAULT_SITE_CONFIG } from './defaults';
import { configManager } from './manager';

/**
 * Get site configuration for use in Astro components (build-time only)
 *
 * This function returns the site configuration synchronously by loading
 * it from the file system at build time. The configuration is cached
 * for performance.
 */
let cachedConfig: SiteConfig | null = null;

export async function getSiteConfig(): Promise<SiteConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    cachedConfig = await configManager.getConfig();
    return cachedConfig;
  } catch (error) {
    console.warn('Failed to load site configuration, using defaults:', error);
    return DEFAULT_SITE_CONFIG;
  }
}

/**
 * Helper to safely access nested configuration values with fallback
 */
export function getConfigValue<T>(
  config: SiteConfig,
  path: string,
  defaultValue: T
): T {
  const keys = path.split('.');
  let value: any = config;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value !== undefined ? value : defaultValue;
}

/**
 * Get base URL with proper trailing slash handling
 */
export function getBaseUrl(config: SiteConfig): string {
  const baseUrl = config.customization.urls.baseUrl || '';
  const basePath = config.customization.urls.basePath || '';

  // Remove trailing slash from baseUrl and leading slash from basePath
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanBasePath = basePath.replace(/^\//, '');

  return cleanBasePath ? `${cleanBaseUrl}/${cleanBasePath}` : cleanBaseUrl;
}

/**
 * Resolve a path with the configured base path
 */
export function resolvePath(config: SiteConfig, path: string): string {
  const basePath = config.customization.urls.basePath || '';

  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If basePath exists, prepend it
  if (basePath) {
    const cleanBasePath = basePath.replace(/\/$/, '');
    return `${cleanBasePath}${cleanPath}`;
  }

  return cleanPath;
}
