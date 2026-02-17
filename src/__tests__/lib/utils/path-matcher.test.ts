import { describe, it, expect, vi } from 'vitest';
import { startsWithBase } from '../../../lib/utils/path-matcher';
import { getBaseUrlSSR } from '../../../lib/utils/base-url';

// Mock getBaseUrlSSR
vi.mock('../../../lib/utils/base-url', () => ({
  getBaseUrlSSR: vi.fn(),
}));

describe('startsWithBase', () => {
  it('correctly matches paths when base is /', () => {
    vi.mocked(getBaseUrlSSR).mockReturnValue('/');

    expect(startsWithBase('/admin', '/admin')).toBe(true);
    expect(startsWithBase('/admin/dashboard', '/admin')).toBe(true);
    expect(startsWithBase('/api/config', '/api/config')).toBe(true);

    expect(startsWithBase('/', '/admin')).toBe(false);
    expect(startsWithBase('/blog', '/admin')).toBe(false);
  });

  it('correctly matches paths when base is /Antler', () => {
    vi.mocked(getBaseUrlSSR).mockReturnValue('/Antler');

    expect(startsWithBase('/Antler/admin', '/admin')).toBe(true);
    expect(startsWithBase('/Antler/admin/dashboard', '/admin')).toBe(true);
    expect(startsWithBase('/Antler/api/config', '/api/config')).toBe(true);

    expect(startsWithBase('/admin', '/admin')).toBe(false); // Wrong base
    expect(startsWithBase('/Antler', '/admin')).toBe(false);
    expect(startsWithBase('/Antler/blog', '/admin')).toBe(false);
  });

  it('handles target paths without leading slash', () => {
    vi.mocked(getBaseUrlSSR).mockReturnValue('/');
    expect(startsWithBase('/admin', 'admin')).toBe(true);

    vi.mocked(getBaseUrlSSR).mockReturnValue('/Antler');
    expect(startsWithBase('/Antler/admin', 'admin')).toBe(true);
  });
});
