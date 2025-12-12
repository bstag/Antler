import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST, PUT, DELETE } from '../../../../pages/admin/api/content/[collection]';
import fs from 'fs/promises';
import matter from 'gray-matter';
import { getCollection } from 'astro:content';

// Mock dependencies
vi.mock('fs/promises', () => ({
  default: {
    writeFile: vi.fn(),
    unlink: vi.fn(),
    readdir: vi.fn(),
    readFile: vi.fn(),
    stat: vi.fn(),
  }
}));

vi.mock('../../../../lib/utils/slug', () => ({
  generateSlug: vi.fn((str: string) => str.toLowerCase().replace(/\s+/g, '-'))
}));

describe('Admin API - Content Collection Endpoint', () => {
  const mockBlogEntries = [
    {
      slug: 'first-post',
      data: {
        title: 'First Post',
        description: 'First post description',
        publicationDate: new Date('2024-01-01'),
        tags: ['test']
      }
    },
    {
      slug: 'second-post',
      data: {
        title: 'Second Post',
        description: 'Second post description',
        publicationDate: new Date('2024-01-15'),
        tags: ['blog']
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET - List content', () => {
    it('should return list of blog posts', async () => {
      (getCollection as any).mockResolvedValue(mockBlogEntries);

      const request = new Request('http://localhost/admin/api/content/blog?page=1&limit=20');
      const response = await GET({
        params: { collection: 'blog' },
        url: new URL(request.url),
        request
      } as any);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.items).toHaveLength(2);
      expect(data.data.total).toBe(2);
      expect(data.data.items[0].title).toBe('First Post');
    });

    it('should handle pagination', async () => {
      (getCollection as any).mockResolvedValue(mockBlogEntries);

      const request = new Request('http://localhost/admin/api/content/blog?page=1&limit=1');
      const response = await GET({
        params: { collection: 'blog' },
        url: new URL(request.url),
        request
      } as any);

      const data = await response.json();
      expect(data.data.items).toHaveLength(1);
      expect(data.data.hasMore).toBe(true);
      expect(data.data.page).toBe(1);
      expect(data.data.limit).toBe(1);
    });

    it('should filter by search term', async () => {
      (getCollection as any).mockResolvedValue(mockBlogEntries);

      const request = new Request('http://localhost/admin/api/content/blog?search=first');
      const response = await GET({
        params: { collection: 'blog' },
        url: new URL(request.url),
        request
      } as any);

      const data = await response.json();
      expect(data.data.items).toHaveLength(1);
      expect(data.data.items[0].title).toBe('First Post');
    });

    it('should return 400 if collection is missing', async () => {
      const request = new Request('http://localhost/admin/api/content/');
      const response = await GET({
        params: {},
        url: new URL(request.url),
        request
      } as any);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Collection parameter required');
    });

    it('should return 500 if getCollection fails', async () => {
      (getCollection as any).mockRejectedValue(new Error('Collection not found'));

      const request = new Request('http://localhost/admin/api/content/blog');
      const response = await GET({
        params: { collection: 'blog' },
        url: new URL(request.url),
        request
      } as any);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it('should handle default pagination values', async () => {
      (getCollection as any).mockResolvedValue(mockBlogEntries);

      const request = new Request('http://localhost/admin/api/content/blog');
      const response = await GET({
        params: { collection: 'blog' },
        url: new URL(request.url),
        request
      } as any);

      const data = await response.json();
      expect(data.data.page).toBe(1);
      expect(data.data.limit).toBe(20);
    });

    it('should include all required fields in response', async () => {
      (getCollection as any).mockResolvedValue(mockBlogEntries);

      const request = new Request('http://localhost/admin/api/content/blog');
      const response = await GET({
        params: { collection: 'blog' },
        url: new URL(request.url),
        request
      } as any);

      const data = await response.json();
      const item = data.data.items[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('collection');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('filePath');
      expect(item).toHaveProperty('frontmatter');
      expect(item).toHaveProperty('createdAt');
      expect(item).toHaveProperty('updatedAt');
    });
  });

  describe('POST - Create content', () => {
    it('should create new blog post', async () => {
      (fs.writeFile as any).mockResolvedValue(undefined);

      const request = new Request('http://localhost/admin/api/content/blog', {
        method: 'POST',
        body: JSON.stringify({
          frontmatter: {
            title: 'New Post',
            description: 'A new blog post',
            publicationDate: '2024-03-01',
            tags: ['new']
          },
          content: '# New Post\n\nContent here'
        })
      });

      const response = await POST({
        params: { collection: 'blog' },
        request
      } as any);

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('new-post');
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should use custom filename if provided', async () => {
      (fs.writeFile as any).mockResolvedValue(undefined);

      const request = new Request('http://localhost/admin/api/content/blog', {
        method: 'POST',
        body: JSON.stringify({
          frontmatter: { title: 'Custom' },
          content: 'Content',
          filename: 'custom-filename'
        })
      });

      const response = await POST({
        params: { collection: 'blog' },
        request
      } as any);

      const data = await response.json();
      expect(data.data.id).toBe('custom-filename');
    });

    it('should return 400 if collection is missing', async () => {
      const request = new Request('http://localhost/admin/api/content/', {
        method: 'POST',
        body: JSON.stringify({ frontmatter: {}, content: '' })
      });

      const response = await POST({
        params: {},
        request
      } as any);

      expect(response.status).toBe(400);
    });

    it('should return 500 if write fails', async () => {
      (fs.writeFile as any).mockRejectedValue(new Error('Write error'));

      const request = new Request('http://localhost/admin/api/content/blog', {
        method: 'POST',
        body: JSON.stringify({
          frontmatter: { title: 'Test' },
          content: 'Content'
        })
      });

      const response = await POST({
        params: { collection: 'blog' },
        request
      } as any);

      expect(response.status).toBe(500);
    });

    it('should create proper markdown with frontmatter', async () => {
      let writtenContent = '';
      (fs.writeFile as any).mockImplementation(async (path: string, content: string) => {
        writtenContent = content;
      });

      const frontmatter = {
        title: 'Test Post',
        description: 'Test description'
      };
      const content = '# Test Post\n\nContent here';

      const request = new Request('http://localhost/admin/api/content/blog', {
        method: 'POST',
        body: JSON.stringify({ frontmatter, content })
      });

      await POST({
        params: { collection: 'blog' },
        request
      } as any);

      expect(writtenContent).toContain('---');
      expect(writtenContent).toContain('title: Test Post');
      expect(writtenContent).toContain('# Test Post');
    });
  });

  describe('PUT - Update content', () => {
    it('should update existing blog post', async () => {
      (fs.writeFile as any).mockResolvedValue(undefined);

      const request = new Request('http://localhost/admin/api/content/blog?id=first-post', {
        method: 'PUT',
        body: JSON.stringify({
          frontmatter: {
            title: 'Updated Post',
            description: 'Updated description'
          },
          content: '# Updated\n\nUpdated content'
        })
      });

      const response = await PUT({
        params: { collection: 'blog' },
        request
      } as any);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('first-post');
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should return 400 if collection is missing', async () => {
      const request = new Request('http://localhost/admin/api/content/?id=test', {
        method: 'PUT',
        body: JSON.stringify({ frontmatter: {}, content: '' })
      });

      const response = await PUT({
        params: {},
        request
      } as any);

      expect(response.status).toBe(400);
    });

    it('should return 400 if id is missing', async () => {
      const request = new Request('http://localhost/admin/api/content/blog', {
        method: 'PUT',
        body: JSON.stringify({ frontmatter: {}, content: '' })
      });

      const response = await PUT({
        params: { collection: 'blog' },
        request
      } as any);

      expect(response.status).toBe(400);
    });

    it('should return 500 if write fails', async () => {
      (fs.writeFile as any).mockRejectedValue(new Error('Write error'));

      const request = new Request('http://localhost/admin/api/content/blog?id=first-post', {
        method: 'PUT',
        body: JSON.stringify({
          frontmatter: { title: 'Updated' },
          content: 'Content'
        })
      });

      const response = await PUT({
        params: { collection: 'blog' },
        request
      } as any);

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE - Delete content', () => {
    it('should delete existing blog post', async () => {
      (fs.unlink as any).mockResolvedValue(undefined);

      const request = new Request('http://localhost/admin/api/content/blog?id=first-post', {
        method: 'DELETE'
      });

      const response = await DELETE({
        params: { collection: 'blog' },
        request
      } as any);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('first-post');
      expect(fs.unlink).toHaveBeenCalled();
    });

    it('should return 400 if collection is missing', async () => {
      const request = new Request('http://localhost/admin/api/content/?id=test', {
        method: 'DELETE'
      });

      const response = await DELETE({
        params: {},
        request
      } as any);

      expect(response.status).toBe(400);
    });

    it('should return 400 if id is missing', async () => {
      const request = new Request('http://localhost/admin/api/content/blog', {
        method: 'DELETE'
      });

      const response = await DELETE({
        params: { collection: 'blog' },
        request
      } as any);

      expect(response.status).toBe(400);
    });

    it('should return 500 if delete fails', async () => {
      (fs.unlink as any).mockRejectedValue(new Error('Delete error'));

      const request = new Request('http://localhost/admin/api/content/blog?id=first-post', {
        method: 'DELETE'
      });

      const response = await DELETE({
        params: { collection: 'blog' },
        request
      } as any);

      expect(response.status).toBe(500);
    });
  });

  describe('Static Site Generation Integration', () => {
    it('should work with prerender: false setting', async () => {
      // Verify that the endpoint is set up for SSR
      (getCollection as any).mockResolvedValue(mockBlogEntries);

      const request = new Request('http://localhost/admin/api/content/blog');
      const response = await GET({
        params: { collection: 'blog' },
        url: new URL(request.url),
        request
      } as any);

      expect(response.status).toBe(200);
      // This demonstrates that the endpoint can be called at runtime,
      // not just at build time
    });

    it('should create files that will be picked up by next build', async () => {
      let writtenPath = '';
      (fs.writeFile as any).mockImplementation(async (path: string) => {
        writtenPath = path;
      });

      const request = new Request('http://localhost/admin/api/content/blog', {
        method: 'POST',
        body: JSON.stringify({
          frontmatter: { title: 'New Post' },
          content: 'Content'
        })
      });

      await POST({
        params: { collection: 'blog' },
        request
      } as any);

      // Verify the file is written to the content directory
      expect(writtenPath).toContain('src/content/blog');
      expect(writtenPath).toContain('.md');
    });

    it('should handle different collections correctly', async () => {
      // Test blog collection
      (getCollection as any).mockResolvedValue(mockBlogEntries);
      let request = new Request('http://localhost/admin/api/content/blog');
      let response = await GET({
        params: { collection: 'blog' },
        url: new URL(request.url),
        request
      } as any);
      let data = await response.json();
      expect(data.data.items[0].collection).toBe('blog');

      // Test projects collection
      const mockProjectEntries = [
        {
          slug: 'my-project',
          data: {
            projectName: 'My Project',
            projectImage: '/image.jpg',
            description: 'Project desc',
            technologies: ['React']
          }
        }
      ];
      (getCollection as any).mockResolvedValue(mockProjectEntries);
      request = new Request('http://localhost/admin/api/content/projects');
      response = await GET({
        params: { collection: 'projects' },
        url: new URL(request.url),
        request
      } as any);
      data = await response.json();
      expect(data.data.items[0].collection).toBe('projects');
    });
  });
});
