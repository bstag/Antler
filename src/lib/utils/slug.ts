/**
 * Generates a URL-safe slug from text
 * 
 * @param text - The input text to convert to a slug
 * @param maxLength - Maximum length of the generated slug (default: 50)
 * @returns A URL-safe slug string
 * 
 * @example
 * ```typescript
 * generateSlug('Hello World!') // 'hello-world'
 * generateSlug('My Blog Post', 10) // 'my-blog-po'
 * generateSlug('---Special Characters!!!---') // 'special-characters'
 * ```
 */
export function generateSlug(text: string, maxLength: number = 50): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, maxLength);
}