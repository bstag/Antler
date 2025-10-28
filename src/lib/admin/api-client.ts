/**
 * Admin API Client Utility
 * Handles base URL prefixing for all admin API calls
 */

// Get base URL from environment
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use meta tag or import.meta.env
    const meta = document.querySelector('meta[name="base-url"]');
    if (meta) {
      return meta.getAttribute('content') || '';
    }
  }
  // Fallback to import.meta.env
  return import.meta.env.BASE_URL || '';
};

/**
 * Build full API URL with base URL prefix
 */
export const buildApiUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Ensure baseUrl doesn't have trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  // Construct full URL
  return cleanBaseUrl ? `${cleanBaseUrl}/${cleanPath}` : `/${cleanPath}`;
};

/**
 * Fetch wrapper that automatically includes base URL
 */
export const adminFetch = async (path: string, options?: RequestInit): Promise<Response> => {
  const url = buildApiUrl(path);
  return fetch(url, options);
};

/**
 * Helper to get base URL for use in components
 */
export const getAdminBaseUrl = (): string => {
  return getBaseUrl();
};
