import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContentService } from '../../../lib/admin/content-service';
import path from 'path';
import matter from 'gray-matter';
import type { ContentItem } from '../../../lib/admin/types';

// Mock the file system
vi.mock('fs/promises', () => ({
  default: {
    readdir: vi.fn(),
    readFile: vi.fn(),
    stat: vi.fn(),
    access: vi.fn(),
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    unlink: vi.fn()
  }
}));

vi.mock('../../../lib/utils/logger', () => ({
  logger: {
    error: vi.fn()
  }
}));

import fs from 'fs/promises';

describe('ContentService', () => {
  const mockFiles = {
    'blog': [
      {
        name: 'first-post.md',
        content: matter.stringify('# First Post\n\nContent here', {
          title: 'First Post',
          description: 'This is the first post',
          publicationDate: new Date('2024-01-01'),
          tags: ['test', 'blog'],
          featured: true
        }),
        stats: {
          birthtime: new Date('2024-01-01'),
          mtime: new Date('2024-01-02')
        }
      },
      {
        name: 'second-post.md',
        content: matter.stringify('# Second Post\n\nMore content', {
          title: 'Second Post',
          description: 'This is the second post',
          publicationDate: new Date('2024-01-15'),
          tags: ['tutorial'],
          featured: false
        }),
        stats: {
          birthtime: new Date('2024-01-15'),
          mtime: new Date('2024-01-16')
        }
      }
    ],
    'projects': [
      {
        name: 'my-project.md',
        content: matter.stringify('# My Project\n\nProject description', {
          projectName: 'My Project',
          projectImage: '/images/project.jpg',
          description: 'A cool project',
          technologies: ['React', 'TypeScript'],
          githubLink: 'https://github.com/user/project',
          featured: true
        }),
        stats: {
          birthtime: new Date('2024-02-01'),
          mtime: new Date('2024-02-02')
        }
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getContentList', () => {
    it('should return paginated list of blog posts', async () => {
      const blogFiles = mockFiles.blog;

      (fs.readdir as any).mockResolvedValue(blogFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.content || '';
      });
      (fs.stat as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.stats || { birthtime: new Date(), mtime: new Date() };
      });

      const result = await ContentService.getContentList('blog', { page: 1, limit: 10 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.hasMore).toBe(false);
      expect(result.items[0].title).toBe('First Post');
      expect(result.items[0].collection).toBe('blog');
    });

    it('should handle pagination correctly', async () => {
      const blogFiles = mockFiles.blog;

      (fs.readdir as any).mockResolvedValue(blogFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.content || '';
      });
      (fs.stat as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.stats || { birthtime: new Date(), mtime: new Date() };
      });

      const result = await ContentService.getContentList('blog', { page: 1, limit: 1 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(2);
      expect(result.hasMore).toBe(true);
    });

    it('should filter by search term', async () => {
      const blogFiles = mockFiles.blog;

      (fs.readdir as any).mockResolvedValue(blogFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.content || '';
      });
      (fs.stat as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.stats || { birthtime: new Date(), mtime: new Date() };
      });

      const result = await ContentService.getContentList('blog', { search: 'first' });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('First Post');
    });

    it('should filter by frontmatter values', async () => {
      const blogFiles = mockFiles.blog;

      (fs.readdir as any).mockResolvedValue(blogFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.content || '';
      });
      (fs.stat as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.stats || { birthtime: new Date(), mtime: new Date() };
      });

      const result = await ContentService.getContentList('blog', {
        filters: { featured: true }
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('First Post');
      expect(result.items[0].frontmatter.featured).toBe(true);
    });

    it('should filter by array field values', async () => {
      const blogFiles = mockFiles.blog;

      (fs.readdir as any).mockResolvedValue(blogFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.content || '';
      });
      (fs.stat as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.stats || { birthtime: new Date(), mtime: new Date() };
      });

      const result = await ContentService.getContentList('blog', {
        filters: { tags: 'tutorial' }
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('Second Post');
    });

    it('should sort by title ascending', async () => {
      const blogFiles = mockFiles.blog;

      (fs.readdir as any).mockResolvedValue(blogFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.content || '';
      });
      (fs.stat as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.stats || { birthtime: new Date(), mtime: new Date() };
      });

      const result = await ContentService.getContentList('blog', {
        sortBy: 'title',
        sortOrder: 'asc'
      });

      expect(result.items[0].title).toBe('First Post');
      expect(result.items[1].title).toBe('Second Post');
    });

    it('should sort by updatedAt descending', async () => {
      const blogFiles = mockFiles.blog;

      (fs.readdir as any).mockResolvedValue(blogFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.content || '';
      });
      (fs.stat as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.stats || { birthtime: new Date(), mtime: new Date() };
      });

      const result = await ContentService.getContentList('blog', {
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      });

      expect(result.items[0].title).toBe('Second Post');
      expect(result.items[1].title).toBe('First Post');
    });

    it('should handle errors gracefully', async () => {
      (fs.readdir as any).mockRejectedValue(new Error('Directory not found'));

      const result = await ContentService.getContentList('blog');

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('getContentItem', () => {
    it('should return a single content item with content', async () => {
      const blogFile = mockFiles.blog[0];

      (fs.readFile as any).mockResolvedValue(blogFile.content);
      (fs.stat as any).mockResolvedValue(blogFile.stats);

      const result = await ContentService.getContentItem('blog', 'first-post');

      expect(result).toBeDefined();
      expect(result?.id).toBe('first-post');
      expect(result?.title).toBe('First Post');
      expect(result?.collection).toBe('blog');
      expect(result?.content).toContain('# First Post');
      expect(result?.frontmatter.title).toBe('First Post');
    });

    it('should return null if file not found', async () => {
      (fs.readFile as any).mockRejectedValue(new Error('File not found'));

      const result = await ContentService.getContentItem('blog', 'non-existent');

      expect(result).toBeNull();
    });

    it('should handle projects collection', async () => {
      const projectFile = mockFiles.projects[0];

      (fs.readFile as any).mockResolvedValue(projectFile.content);
      (fs.stat as any).mockResolvedValue(projectFile.stats);

      const result = await ContentService.getContentItem('projects', 'my-project');

      expect(result).toBeDefined();
      expect(result?.title).toBe('My Project');
      expect(result?.frontmatter.projectName).toBe('My Project');
    });
  });

  describe('createContentItem', () => {
    it('should create a new content item', async () => {
      (fs.access as any).mockRejectedValue(new Error('File does not exist'));
      (fs.mkdir as any).mockResolvedValue(undefined);
      (fs.writeFile as any).mockResolvedValue(undefined);
      (fs.readFile as any).mockResolvedValue(
        matter.stringify('New content', { title: 'New Post' })
      );
      (fs.stat as any).mockResolvedValue({
        birthtime: new Date(),
        mtime: new Date()
      });

      const result = await ContentService.createContentItem('blog', {
        frontmatter: { title: 'New Post', description: 'A new post' },
        content: 'New content'
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.title).toBe('New Post');
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should generate slug from title', async () => {
      (fs.access as any).mockRejectedValue(new Error('File does not exist'));
      (fs.mkdir as any).mockResolvedValue(undefined);
      (fs.writeFile as any).mockResolvedValue(undefined);
      (fs.readFile as any).mockResolvedValue(
        matter.stringify('Content', { title: 'My Awesome Post!' })
      );
      (fs.stat as any).mockResolvedValue({
        birthtime: new Date(),
        mtime: new Date()
      });

      const result = await ContentService.createContentItem('blog', {
        frontmatter: { title: 'My Awesome Post!' },
        content: 'Content'
      });

      expect(result.success).toBe(true);
      const writeCall = (fs.writeFile as any).mock.calls[0];
      expect(writeCall[0]).toContain('my-awesome-post.md');
    });

    it('should return error if file already exists', async () => {
      (fs.access as any).mockResolvedValue(undefined);

      const result = await ContentService.createContentItem('blog', {
        frontmatter: { title: 'Existing Post' },
        content: 'Content'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('already exists');
    });

    it('should handle errors during creation', async () => {
      (fs.access as any).mockRejectedValue(new Error('File does not exist'));
      (fs.mkdir as any).mockRejectedValue(new Error('Cannot create directory'));

      const result = await ContentService.createContentItem('blog', {
        frontmatter: { title: 'New Post' },
        content: 'Content'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('updateContentItem', () => {
    it('should update an existing content item', async () => {
      (fs.access as any).mockResolvedValue(undefined);
      (fs.writeFile as any).mockResolvedValue(undefined);
      (fs.readFile as any).mockResolvedValue(
        matter.stringify('Updated content', { title: 'Updated Post' })
      );
      (fs.stat as any).mockResolvedValue({
        birthtime: new Date(),
        mtime: new Date()
      });

      const result = await ContentService.updateContentItem('blog', 'first-post', {
        frontmatter: { title: 'Updated Post', description: 'Updated description' },
        content: 'Updated content'
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.title).toBe('Updated Post');
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should return error if file not found', async () => {
      (fs.access as any).mockRejectedValue(new Error('File not found'));

      const result = await ContentService.updateContentItem('blog', 'non-existent', {
        frontmatter: { title: 'Updated' },
        content: 'Content'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should handle errors during update', async () => {
      (fs.access as any).mockResolvedValue(undefined);
      (fs.writeFile as any).mockRejectedValue(new Error('Write error'));

      const result = await ContentService.updateContentItem('blog', 'first-post', {
        frontmatter: { title: 'Updated' },
        content: 'Content'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('deleteContentItem', () => {
    it('should delete an existing content item', async () => {
      (fs.access as any).mockResolvedValue(undefined);
      (fs.unlink as any).mockResolvedValue(undefined);

      const result = await ContentService.deleteContentItem('blog', 'first-post');

      expect(result.success).toBe(true);
      expect(fs.unlink).toHaveBeenCalled();
    });

    it('should return error if file not found', async () => {
      (fs.access as any).mockRejectedValue(new Error('File not found'));

      const result = await ContentService.deleteContentItem('blog', 'non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should handle errors during deletion', async () => {
      (fs.access as any).mockResolvedValue(undefined);
      (fs.unlink as any).mockRejectedValue(new Error('Delete error'));

      const result = await ContentService.deleteContentItem('blog', 'first-post');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getCollectionStats', () => {
    it('should return stats for a collection', async () => {
      const blogFiles = mockFiles.blog;

      (fs.readdir as any).mockResolvedValue(blogFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.content || '';
      });
      (fs.stat as any).mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        const file = blogFiles.find(f => f.name === fileName);
        return file?.stats || { birthtime: new Date(), mtime: new Date() };
      });

      const result = await ContentService.getCollectionStats('blog');

      expect(result.total).toBe(2);
      expect(result.featured).toBe(1);
      expect(result.recent).toBeGreaterThanOrEqual(0);
    });

    it('should handle collections without featured content', async () => {
      const docsFiles = [
        {
          name: 'doc1.md',
          content: matter.stringify('# Doc 1', { title: 'Doc 1', group: 'guide', order: 1 }),
          stats: { birthtime: new Date(), mtime: new Date() }
        }
      ];

      (fs.readdir as any).mockResolvedValue(docsFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async () => docsFiles[0].content);
      (fs.stat as any).mockImplementation(async () => docsFiles[0].stats);

      const result = await ContentService.getCollectionStats('docs');

      expect(result.total).toBe(1);
      expect(result.featured).toBeUndefined();
    });

    it('should count recent items correctly', async () => {
      const recentFiles = [
        {
          name: 'recent.md',
          content: matter.stringify('Recent', { title: 'Recent' }),
          stats: {
            birthtime: new Date(),
            mtime: new Date() // Very recent
          }
        }
      ];

      (fs.readdir as any).mockResolvedValue(recentFiles.map(f => f.name));
      (fs.readFile as any).mockImplementation(async () => recentFiles[0].content);
      (fs.stat as any).mockImplementation(async () => recentFiles[0].stats);

      const result = await ContentService.getCollectionStats('blog');

      expect(result.recent).toBe(1);
    });

    it('should handle errors gracefully', async () => {
      (fs.readdir as any).mockRejectedValue(new Error('Directory not found'));

      const result = await ContentService.getCollectionStats('blog');

      expect(result.total).toBe(0);
      expect(result.recent).toBe(0);
    });
  });
});
