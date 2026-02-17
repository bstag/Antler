import { getBaseUrlSSR } from './base-url';

/**
 * Checks if a pathname starts with a target path, accounting for the base URL.
 *
 * @param pathname The current request pathname (e.g. from context.url.pathname)
 * @param target The target path to check against (e.g. '/admin')
 * @returns true if the pathname starts with base + target
 */
export function startsWithBase(pathname: string, target: string): boolean {
  const base = getBaseUrlSSR();
  const prefix = base === '/' ? '' : base;
  const normalizedTarget = target.startsWith('/') ? target : `/${target}`;
  const fullTarget = `${prefix}${normalizedTarget}`;

  return pathname.startsWith(fullTarget);
}
