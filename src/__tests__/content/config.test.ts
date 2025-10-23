import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Define the schemas directly for testing (extracted from config.ts)
const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publicationDate: z.coerce.date(),
  tags: z.array(z.string()),
  featuredImage: z.string().optional(),
  author: z.string().optional(),
  readingTime: z.number().optional(),
  featured: z.boolean().optional(),
});

const projectsSchema = z.object({
  projectName: z.string(),
  projectImage: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  githubLink: z.string().optional(),
  liveUrl: z.string().optional(),
  featured: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
});

const docsSchema = z.object({
  title: z.string(),
  group: z.string(),
  order: z.number(),
  description: z.string().optional(),
});

// Mock data for testing
const mockBlogPost = {
  title: 'Test Blog Post',
  description: 'This is a test blog post description',
  publicationDate: new Date('2024-01-15'),
  tags: ['test', 'blog', 'astro'],
  featuredImage: '/images/test-blog.jpg',
  author: 'Test Author',
  readingTime: 5,
  featured: true,
};

const mockProject = {
  projectName: 'Test Project',
  projectImage: '/images/test-project.jpg',
  description: 'This is a test project description',
  technologies: ['React', 'TypeScript', 'Tailwind CSS'],
  githubLink: 'https://github.com/test/project',
  liveUrl: 'https://test-project.com',
  featured: true,
  createdAt: new Date('2024-01-10'),
};

const mockDoc = {
  title: 'Test Documentation',
  group: 'getting-started',
  order: 1,
  description: 'This is test documentation',
};

describe('Content Schema Validation', () => {
  describe('Blog Collection Schema', () => {
    it('should validate valid blog post data', () => {
      const result = blogSchema.safeParse(mockBlogPost);
      expect(result.success).toBe(true);
    });

    it('should require title field', () => {
      const invalidData = { ...mockBlogPost };
      delete invalidData.title;
      
      const result = blogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('should require description field', () => {
      const invalidData = { ...mockBlogPost };
      delete invalidData.description;
      
      const result = blogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('description');
      }
    });

    it('should require publicationDate field', () => {
      const invalidData = { ...mockBlogPost };
      delete invalidData.publicationDate;
      
      const result = blogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('publicationDate');
      }
    });

    it('should require tags field', () => {
      const invalidData = { ...mockBlogPost };
      delete invalidData.tags;
      
      const result = blogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('tags');
      }
    });

    it('should validate tags as array of strings', () => {
      const invalidData = { 
        ...mockBlogPost, 
        tags: ['valid', 123, 'another-valid'] // Invalid: number in array
      };
      
      const result = blogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should coerce date strings to Date objects', () => {
      const dataWithStringDate = {
        ...mockBlogPost,
        publicationDate: '2024-01-15'
      };
      
      const result = blogSchema.safeParse(dataWithStringDate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.publicationDate).toBeInstanceOf(Date);
      }
    });

    it('should allow optional fields to be undefined', () => {
      const minimalData = {
        title: 'Test Title',
        description: 'Test Description',
        publicationDate: new Date(),
        tags: ['test']
      };
      
      const result = blogSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should validate featuredImage as string when provided', () => {
      const dataWithImage = {
        ...mockBlogPost,
        featuredImage: 123 // Invalid: should be string
      };
      
      const result = blogSchema.safeParse(dataWithImage);
      expect(result.success).toBe(false);
    });

    it('should validate readingTime as number when provided', () => {
      const dataWithReadingTime = {
        ...mockBlogPost,
        readingTime: 'five minutes' // Invalid: should be number
      };
      
      const result = blogSchema.safeParse(dataWithReadingTime);
      expect(result.success).toBe(false);
    });

    it('should validate featured as boolean when provided', () => {
      const dataWithFeatured = {
        ...mockBlogPost,
        featured: 'yes' // Invalid: should be boolean
      };
      
      const result = blogSchema.safeParse(dataWithFeatured);
      expect(result.success).toBe(false);
    });
  });

  describe('Projects Collection Schema', () => {
    it('should validate valid project data', () => {
      const result = projectsSchema.safeParse(mockProject);
      expect(result.success).toBe(true);
    });

    it('should require projectName field', () => {
      const invalidData = { ...mockProject };
      delete invalidData.projectName;
      
      const result = projectsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('projectName');
      }
    });

    it('should require projectImage field', () => {
      const invalidData = { ...mockProject };
      delete invalidData.projectImage;
      
      const result = projectsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('projectImage');
      }
    });

    it('should require description field', () => {
      const invalidData = { ...mockProject };
      delete invalidData.description;
      
      const result = projectsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('description');
      }
    });

    it('should require technologies field', () => {
      const invalidData = { ...mockProject };
      delete invalidData.technologies;
      
      const result = projectsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('technologies');
      }
    });

    it('should validate technologies as array of strings', () => {
      const invalidData = { 
        ...mockProject, 
        technologies: ['React', 42, 'TypeScript'] // Invalid: number in array
      };
      
      const result = projectsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should allow optional URL fields', () => {
      const minimalData = {
        projectName: 'Test Project',
        projectImage: '/test-image.jpg',
        description: 'Test Description',
        technologies: ['React', 'TypeScript']
      };
      
      const result = projectsSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should validate URLs as strings when provided', () => {
      const dataWithInvalidUrl = {
        ...mockProject,
        githubLink: 123 // Invalid: should be string
      };
      
      const result = projectsSchema.safeParse(dataWithInvalidUrl);
      expect(result.success).toBe(false);
    });

    it('should coerce date strings for createdAt field', () => {
      const dataWithStringDate = {
        ...mockProject,
        createdAt: '2024-01-15'
      };
      
      const result = projectsSchema.safeParse(dataWithStringDate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.createdAt).toBeInstanceOf(Date);
      }
    });
  });

  describe('Docs Collection Schema', () => {

    it('should validate a complete valid doc', () => {
      const validDoc = {
        title: 'Getting Started Guide',
        description: 'A comprehensive getting started guide',
        group: 'getting-started',
        order: 1,
      };

      const result = docsSchema.safeParse(validDoc);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.title).toBe('Getting Started Guide');
        expect(result.data.order).toBe(1);
      }
    });

    it('should validate a minimal valid doc', () => {
      const minimalDoc = {
        title: 'API Reference',
        group: 'api',
        order: 2,
      };

      const result = docsSchema.safeParse(minimalDoc);
      expect(result.success).toBe(true);
    });

    it('should reject doc without required title', () => {
      const invalidDoc = {
        group: 'test',
        order: 1,
      };

      const result = docsSchema.safeParse(invalidDoc);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['title'],
            code: 'invalid_type',
          })
        );
      }
    });

    it('should reject doc without required group', () => {
      const invalidDoc = {
        title: 'Test Doc',
        order: 1,
      };

      const result = docsSchema.safeParse(invalidDoc);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['group'],
            code: 'invalid_type',
          })
        );
      }
    });

    it('should reject doc without required order', () => {
      const invalidDoc = {
        title: 'Test Doc',
        group: 'test',
      };

      const result = docsSchema.safeParse(invalidDoc);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['order'],
            code: 'invalid_type',
          })
        );
      }
    });

    it('should validate order as number', () => {
      const doc = {
        title: 'Order Test',
        group: 'test',
        order: 42,
      };

      const result = docsSchema.safeParse(doc);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(typeof result.data.order).toBe('number');
        expect(result.data.order).toBe(42);
      }
    });
  });
});