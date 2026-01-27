import crypto from 'node:crypto';

/**
 * Performs a constant-time comparison of two strings.
 * This prevents timing attacks where an attacker can determine
 * valid credentials by measuring the time it takes to compare strings.
 *
 * @param a The first string to compare (e.g. user input)
 * @param b The second string to compare (e.g. stored secret)
 * @returns True if the strings are identical, false otherwise
 */
export function safeCompare(a: string, b: string): boolean {
  // Hash both strings to ensure they are the same length
  // timingSafeEqual requires buffers of equal length
  const bufferA = crypto.createHash('sha256').update(a).digest();
  const bufferB = crypto.createHash('sha256').update(b).digest();

  return crypto.timingSafeEqual(bufferA, bufferB);
}
