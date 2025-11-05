import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildApiUrl, adminFetch, getAdminBaseUrl } from '../../../lib/admin/api-client';

describe('Admin API Client', () => {
  beforeEach(() => {
    // Reset import.meta.env
    vi.stubGlobal('import', {
      meta: {
        env: {
          BASE_URL: ''
        }
      }
    });

    // Reset DOM
    if (typeof document !== 'undefined') {
      document.head.innerHTML = '';
    }
  });

  describe('buildApiUrl', () => {
    it('should build URL without base URL', () => {
      const url = buildApiUrl('/admin/api/content/blog');
      expect(url).toBe('/admin/api/content/blog');
    });

    it('should build URL with base URL from environment', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/my-site'
          }
        }
      });

      const url = buildApiUrl('/admin/api/content/blog');
      expect(url).toBe('/my-site/admin/api/content/blog');
    });

    it('should handle path without leading slash', () => {
      const url = buildApiUrl('admin/api/content/blog');
      expect(url).toBe('/admin/api/content/blog');
    });

    it('should handle base URL with trailing slash', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/my-site/'
          }
        }
      });

      const url = buildApiUrl('/admin/api/content/blog');
      expect(url).toBe('/my-site/admin/api/content/blog');
    });

    it('should handle complex paths', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/base'
          }
        }
      });

      const url = buildApiUrl('/admin/api/content/blog?page=1&limit=10');
      expect(url).toBe('/base/admin/api/content/blog?page=1&limit=10');
    });

    it('should handle nested base URLs', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/nested/path'
          }
        }
      });

      const url = buildApiUrl('/admin/api/files/list');
      expect(url).toBe('/nested/path/admin/api/files/list');
    });

    it('should handle meta tag base URL in browser', () => {
      // Simulate browser environment
      if (typeof document !== 'undefined') {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'base-url');
        meta.setAttribute('content', '/from-meta');
        document.head.appendChild(meta);

        const url = buildApiUrl('/admin/api/schema/blog');
        expect(url).toBe('/from-meta/admin/api/schema/blog');
      }
    });
  });

  describe('adminFetch', () => {
    beforeEach(() => {
      // Mock global fetch
      global.fetch = vi.fn();
    });

    it('should call fetch with correct URL', async () => {
      const mockResponse = new Response(JSON.stringify({ success: true }));
      (global.fetch as any).mockResolvedValue(mockResponse);

      await adminFetch('/admin/api/content/blog');

      expect(global.fetch).toHaveBeenCalledWith('/admin/api/content/blog', undefined);
    });

    it('should call fetch with base URL prefix', async () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/my-site'
          }
        }
      });

      const mockResponse = new Response(JSON.stringify({ success: true }));
      (global.fetch as any).mockResolvedValue(mockResponse);

      await adminFetch('/admin/api/content/blog');

      expect(global.fetch).toHaveBeenCalledWith('/my-site/admin/api/content/blog', undefined);
    });

    it('should pass through fetch options', async () => {
      const mockResponse = new Response(JSON.stringify({ success: true }));
      (global.fetch as any).mockResolvedValue(mockResponse);

      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: 'data' })
      };

      await adminFetch('/admin/api/content/blog', options);

      expect(global.fetch).toHaveBeenCalledWith('/admin/api/content/blog', options);
    });

    it('should return response from fetch', async () => {
      const mockData = { success: true, data: { items: [] } };
      const mockResponse = new Response(JSON.stringify(mockData));
      (global.fetch as any).mockResolvedValue(mockResponse);

      const response = await adminFetch('/admin/api/content/blog');
      const data = await response.json();

      expect(data).toEqual(mockData);
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(adminFetch('/admin/api/content/blog')).rejects.toThrow('Network error');
    });

    it('should handle 404 responses', async () => {
      const mockResponse = new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404
      });
      (global.fetch as any).mockResolvedValue(mockResponse);

      const response = await adminFetch('/admin/api/content/blog');

      expect(response.status).toBe(404);
    });

    it('should handle 500 responses', async () => {
      const mockResponse = new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500
      });
      (global.fetch as any).mockResolvedValue(mockResponse);

      const response = await adminFetch('/admin/api/content/blog');

      expect(response.status).toBe(500);
    });
  });

  describe('getAdminBaseUrl', () => {
    it('should return empty string when no base URL is set', () => {
      const baseUrl = getAdminBaseUrl();
      expect(baseUrl).toBe('');
    });

    it('should return base URL from environment', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/my-site'
          }
        }
      });

      const baseUrl = getAdminBaseUrl();
      expect(baseUrl).toBe('/my-site');
    });

    it('should return base URL from meta tag in browser', () => {
      if (typeof document !== 'undefined') {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'base-url');
        meta.setAttribute('content', '/from-meta');
        document.head.appendChild(meta);

        const baseUrl = getAdminBaseUrl();
        expect(baseUrl).toBe('/from-meta');
      }
    });

    it('should prefer meta tag over environment variable', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/from-env'
          }
        }
      });

      if (typeof document !== 'undefined') {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'base-url');
        meta.setAttribute('content', '/from-meta');
        document.head.appendChild(meta);

        const baseUrl = getAdminBaseUrl();
        expect(baseUrl).toBe('/from-meta');
      }
    });
  });

  describe('URL construction edge cases', () => {
    it('should handle empty path', () => {
      const url = buildApiUrl('');
      expect(url).toBe('/');
    });

    it('should handle path with only slash', () => {
      const url = buildApiUrl('/');
      expect(url).toBe('/');
    });

    it('should handle multiple consecutive slashes', () => {
      const url = buildApiUrl('//admin//api//content');
      expect(url).toBe('/admin//api//content');
    });

    it('should handle query parameters correctly', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/base'
          }
        }
      });

      const url = buildApiUrl('/api/content?search=test&page=2&limit=20');
      expect(url).toBe('/base/api/content?search=test&page=2&limit=20');
    });

    it('should handle URL with hash', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/base'
          }
        }
      });

      const url = buildApiUrl('/api/content#section');
      expect(url).toBe('/base/api/content#section');
    });
  });

  describe('integration with static site generation', () => {
    it('should support different base URLs for different deployments', () => {
      // Simulate GitHub Pages deployment
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/my-repo'
          }
        }
      });

      let url = buildApiUrl('/admin/api/content/blog');
      expect(url).toBe('/my-repo/admin/api/content/blog');

      // Simulate root deployment
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/'
          }
        }
      });

      url = buildApiUrl('/admin/api/content/blog');
      expect(url).toBe('/admin/api/content/blog');
    });

    it('should handle subdomain deployments', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            BASE_URL: '/staging'
          }
        }
      });

      const url = buildApiUrl('/admin/api/content/blog');
      expect(url).toBe('/staging/admin/api/content/blog');
    });
  });
});
