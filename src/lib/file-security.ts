import path from 'path';

/**
 * Safely resolves a path and ensures it is within the allowed root directory.
 * Used to prevent directory traversal attacks.
 *
 * @param rootDir The absolute path of the root directory (e.g. process.cwd() + '/public')
 * @param requestedPath The relative path requested by the user
 * @returns The resolved absolute path if safe
 * @throws Error if the path attempts to traverse outside the root directory
 */
export function resolveSafePath(rootDir: string, requestedPath: string): string {
  // Resolve the full path
  const resolvedPath = path.resolve(rootDir, requestedPath);

  // Check if the resolved path starts with the root directory
  // We add a trailing separator to rootDir to avoid partial matches (e.g. /var/www vs /var/www-secret)
  const normalizedRoot = rootDir.endsWith(path.sep) ? rootDir : rootDir + path.sep;

  if (!resolvedPath.startsWith(normalizedRoot) && resolvedPath !== rootDir) {
    throw new Error('Access denied: Path traversal detected');
  }

  return resolvedPath;
}
