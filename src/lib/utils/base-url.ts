/**
 * Base URL utilities for handling GitHub Pages subdirectory deployment
 */

/**
 * Get the base URL from the meta tag injected during build
 * Falls back to '/' for local development
 */
export function getBaseUrl(): string {
  if (typeof document === 'undefined') return '/';

  const meta = document.querySelector('meta[name="base-url"]');
  const baseUrl = meta?.getAttribute('content') || '/';

  // Ensure no trailing slash for consistency
  return baseUrl.endsWith('/') && baseUrl.length > 1
    ? baseUrl.slice(0, -1)
    : baseUrl;
}

/**
 * Prepend the base URL to a path
 * @param path - The path to prepend (should start with /)
 * @returns The full path with base URL
 */
export function withBase(path: string): string {
  const base = getBaseUrl();

  // If path doesn't start with /, add it
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // If base is just '/', return the path as-is
  if (base === '/') return normalizedPath;

  // Combine base and path
  return `${base}${normalizedPath}`;
}

/**
 * Check if a path is active based on current location
 * Handles base URL automatically
 */
export function isActivePath(href: string, currentPath: string): boolean {
  const fullHref = withBase(href);

  if (fullHref === withBase('/') && currentPath === withBase('/')) return true;
  if (fullHref !== withBase('/') && currentPath.startsWith(fullHref)) return true;

  return false;
}
