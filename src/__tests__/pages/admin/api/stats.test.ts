import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../../../pages/admin/api/stats';
import { getCollection } from 'astro:content';

// Mock dependencies
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
  defineCollection: vi.fn(),
  z: {
    object: vi.fn().mockReturnThis(),
    string: vi.fn().mockReturnThis(),
    number: vi.fn().mockReturnThis(),
    boolean: vi.fn().mockReturnThis(),
    array: vi.fn().mockReturnThis(),
    coerce: { date: vi.fn().mockReturnThis() },
    optional: vi.fn().mockReturnThis(),
    default: vi.fn().mockReturnThis(),
  }
}));

// Mock config to ensure we have a known set of collections
vi.mock('../../../../content/config', () => ({
  collections: {
    blog: {},
    projects: {},
    docs: {}
  }
}));

describe('Admin API - Stats Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return stats for all collections', async () => {
    // Mock getCollection to return different counts based on collection name
    (getCollection as any).mockImplementation(async (collection: string) => {
      switch (collection) {
        case 'blog': return Array(5).fill({});
        case 'projects': return Array(3).fill({});
        case 'docs': return Array(10).fill({});
        default: return [];
      }
    });

    const response = await GET({} as any);

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual({
      blog: { total: 5 },
      projects: { total: 3 },
      docs: { total: 10 }
    });
  });

  it('should handle errors gracefully', async () => {
    // Mock getCollection to throw for one collection
    (getCollection as any).mockImplementation(async (collection: string) => {
      if (collection === 'blog') throw new Error('Failed');
      return [];
    });

    const response = await GET({} as any);

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.blog).toEqual({ total: 0 });
    expect(body.data.projects).toEqual({ total: 0 });
  });
});
