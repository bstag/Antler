/**
 * Rehype plugin to add base URL to image paths in markdown content
 * This ensures images work correctly when deployed to GitHub Pages subdirectories
 */
import { visit } from 'unist-util-visit';

/**
 * @param {Object} options
 * @param {string} options.base - The base URL to prepend to relative paths
 */
export default function rehypeAddBaseUrl(options = {}) {
  const base = options.base || '';

  return (tree) => {
    // Visit all image nodes in the HTML AST
    visit(tree, 'element', (node) => {
      // Handle img tags
      if (node.tagName === 'img' && node.properties && node.properties.src) {
        const src = node.properties.src;

        // Only transform relative paths that start with /
        // Don't transform external URLs or data URIs
        if (
          typeof src === 'string' &&
          src.startsWith('/') &&
          !src.startsWith('//') &&
          !src.startsWith('http://') &&
          !src.startsWith('https://') &&
          !src.startsWith('data:')
        ) {
          // Prepend base URL, avoiding double slashes
          const normalizedBase = base.endsWith('/') && base.length > 1
            ? base.slice(0, -1)
            : base;

          node.properties.src = normalizedBase ? `${normalizedBase}${src}` : src;
        }
      }
    });
  };
}
