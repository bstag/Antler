/**
 * Theme Configuration API
 * Handles reading and updating theme settings in site.config.json
 */

import type { ThemeMetadata } from './theme-registry';
import { logger } from '../utils/logger';

export interface SiteThemeConfig {
  default: string;
  allowUserOverride: boolean;
  availableThemes: string[];
}

export interface ThemeConfigResponse {
  siteDefault: string;
  userPreference: string | null;
  active: string;
  allowUserOverride: boolean;
  availableThemes: string[];
}

/**
 * Get current theme configuration
 * Falls back to reading from inline config if API not available (static mode)
 */
export async function getThemeConfig(): Promise<ThemeConfigResponse> {
  try {
    const response = await fetch('/api/theme/current');
    if (!response.ok) {
      throw new Error('Failed to fetch theme config');
    }
    return await response.json();
  } catch (error) {
    logger.warn('API not available (static mode), reading from inline config:', error);

    // Fallback: Read from inline JSON config (static sites)
    const configEl = document.getElementById('theme-config');
    if (configEl) {
      try {
        const config = JSON.parse(configEl.textContent || '{}');
        const userPref = localStorage.getItem('antler-selected-theme');

        return {
          siteDefault: config.default || 'blue',
          userPreference: userPref,
          active: userPref || config.default || 'blue',
          allowUserOverride: true,
          availableThemes: config.available || ['blue'],
        };
      } catch (parseError) {
        logger.error('Error parsing inline theme config:', parseError);
      }
    }

    // Ultimate fallback
    return {
      siteDefault: 'blue',
      userPreference: null,
      active: 'blue',
      allowUserOverride: true,
      availableThemes: ['blue'],
    };
  }
}

/**
 * Update the site default theme (admin only)
 * Only works in dev mode with server APIs
 */
export async function updateSiteDefaultTheme(themeName: string): Promise<boolean> {
  try {
    const response = await fetch('/api/theme/set-default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme: themeName }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Failed to update site default theme:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.warn('Cannot update site default in static mode:', error);
    logger.info('To change site default theme in static mode, edit site.config.json and rebuild');
    return false;
  }
}

/**
 * Get all available theme metadata
 * Falls back to importing registry directly in static mode
 */
export async function getAvailableThemesMetadata(): Promise<ThemeMetadata[]> {
  try {
    const response = await fetch('/api/theme/metadata');
    if (!response.ok) {
      throw new Error('Failed to fetch theme metadata');
    }
    const data = await response.json();
    return data.themes || [];
  } catch (error) {
    logger.warn('API not available (static mode), using local theme registry:', error);

    // Fallback: Import theme registry directly (works in static mode)
    const { getAllThemeMetadata } = await import('./theme-registry');
    return getAllThemeMetadata();
  }
}

/**
 * Read site.config.json from the server
 * Note: This is for client-side use
 */
export async function getSiteConfig(): Promise<SiteThemeConfig> {
  try {
    const response = await fetch('/api/config/site');
    if (!response.ok) {
      throw new Error('Failed to fetch site config');
    }
    const data = await response.json();
    return data.customization?.theme || {
      default: 'blue',
      allowUserOverride: true,
      availableThemes: ['blue'],
    };
  } catch (error) {
    logger.error('Error fetching site config:', error);
    return {
      default: 'blue',
      allowUserOverride: true,
      availableThemes: ['blue'],
    };
  }
}
