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

/**
 * Get the base URL for server-side rendering (Astro)
 * Uses import.meta.env.BASE_URL which is available at build time
 */
export function getBaseUrlSSR(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) {
    const baseUrl = import.meta.env.BASE_URL;
    // Ensure no trailing slash for consistency
    return baseUrl.endsWith('/') && baseUrl.length > 1
      ? baseUrl.slice(0, -1)
      : baseUrl;
  }
  return '';
}

/**
 * Prepend base URL to asset paths (images, etc.)
 * Works in both SSR and client-side contexts
 * @param assetPath - The asset path (e.g., "/images/photo.jpg")
 * @returns The full path with base URL
 */
export function withBaseAsset(assetPath: string | undefined): string {
  if (!assetPath) return '';

  // If it's already a full URL (http/https), return as-is
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }

  // For server-side rendering (build time)
  if (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) {
    const base = getBaseUrlSSR();
    const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
    return base && base !== '/' ? `${base}${normalizedPath}` : normalizedPath;
  }

  // For client-side (runtime)
  if (typeof document !== 'undefined') {
    const base = getBaseUrl();
    const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
    return base !== '/' ? `${base}${normalizedPath}` : normalizedPath;
  }

  return assetPath;
}
