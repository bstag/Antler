import { describe, it, expect, beforeEach } from 'vitest';
import { SchemaParser } from '../../../lib/admin/schema-parser';
import { z } from 'zod';
import type { FieldDefinition, SchemaDefinition } from '../../../lib/admin/types';

describe('SchemaParser', () => {
  describe('parseSchema', () => {
    it('should parse a simple string field', () => {
      const schema = z.object({
        title: z.string()
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.collection).toBe('test');
      expect(result.type).toBe('content');
      expect(result.fields).toHaveLength(1);
      expect(result.fields[0]).toMatchObject({
        name: 'title',
        type: 'string',
        required: true,
        optional: false
      });
    });

    it('should parse optional string field', () => {
      const schema = z.object({
        description: z.string().optional()
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'description',
        type: 'string',
        required: false,
        optional: true
      });
    });

    it('should parse string field with default value', () => {
      const schema = z.object({
        status: z.string().default('draft')
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'status',
        type: 'string',
        defaultValue: 'draft'
      });
    });

    it('should parse number field', () => {
      const schema = z.object({
        count: z.number()
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'count',
        type: 'number',
        required: true,
        optional: false
      });
    });

    it('should parse number field with min/max validation', () => {
      const schema = z.object({
        age: z.number().min(0).max(120)
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'age',
        type: 'number',
        validation: {
          min: 0,
          max: 120
        }
      });
    });

    it('should parse boolean field', () => {
      const schema = z.object({
        featured: z.boolean()
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'featured',
        type: 'boolean',
        required: true,
        optional: false
      });
    });

    it('should parse date field', () => {
      const schema = z.object({
        createdAt: z.date()
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'createdAt',
        type: 'date',
        required: true,
        optional: false
      });
    });

    it('should parse array of strings', () => {
      const schema = z.object({
        tags: z.array(z.string())
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'tags',
        type: 'array',
        arrayType: 'string',
        required: true,
        optional: false
      });
    });

    it('should parse array of numbers', () => {
      const schema = z.object({
        scores: z.array(z.number())
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'scores',
        type: 'array',
        arrayType: 'number'
      });
    });

    it('should parse array of objects', () => {
      const schema = z.object({
        items: z.array(z.object({ name: z.string() }))
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'items',
        type: 'array',
        arrayType: 'object'
      });
    });

    it('should parse object field', () => {
      const schema = z.object({
        metadata: z.object({ key: z.string() })
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'metadata',
        type: 'object',
        required: true,
        optional: false
      });
    });

    it('should parse enum field', () => {
      const schema = z.object({
        status: z.enum(['draft', 'published', 'archived'])
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'status',
        type: 'string',
        enumValues: ['draft', 'published', 'archived']
      });
    });

    it('should parse literal field', () => {
      const schema = z.object({
        type: z.literal('blog')
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'type',
        type: 'string',
        enumValues: ['blog']
      });
    });

    it('should parse union of literals as enum', () => {
      const schema = z.object({
        size: z.union([z.literal('small'), z.literal('medium'), z.literal('large')])
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.fields[0]).toMatchObject({
        name: 'size',
        type: 'string',
        enumValues: ['small', 'medium', 'large']
      });
    });

    it('should parse complex schema with multiple field types', () => {
      const schema = z.object({
        title: z.string(),
        description: z.string().optional(),
        publicationDate: z.date(),
        tags: z.array(z.string()),
        featured: z.boolean().default(false),
        readingTime: z.number().min(1).max(60).optional()
      });

      const result = SchemaParser.parseSchema(schema, 'blog');

      expect(result.collection).toBe('blog');
      expect(result.fields).toHaveLength(6);

      // Verify each field
      const titleField = result.fields.find(f => f.name === 'title');
      expect(titleField).toMatchObject({
        name: 'title',
        type: 'string',
        required: true
      });

      const descriptionField = result.fields.find(f => f.name === 'description');
      expect(descriptionField).toMatchObject({
        name: 'description',
        type: 'string',
        optional: true
      });

      const dateField = result.fields.find(f => f.name === 'publicationDate');
      expect(dateField).toMatchObject({
        name: 'publicationDate',
        type: 'date'
      });

      const tagsField = result.fields.find(f => f.name === 'tags');
      expect(tagsField).toMatchObject({
        name: 'tags',
        type: 'array',
        arrayType: 'string'
      });

      const featuredField = result.fields.find(f => f.name === 'featured');
      expect(featuredField).toMatchObject({
        name: 'featured',
        type: 'boolean',
        defaultValue: false
      });

      const readingTimeField = result.fields.find(f => f.name === 'readingTime');
      expect(readingTimeField).toMatchObject({
        name: 'readingTime',
        type: 'number',
        optional: true,
        validation: { min: 1, max: 60 }
      });
    });
  });

  describe('relationship inference', () => {
    it('should not infer relationships for non-ID fields', () => {
      const schema = z.object({
        title: z.string(),
        content: z.string()
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.relationships).toBeUndefined();
    });

    it('should infer one-to-one relationship from ID field', () => {
      const schema = z.object({
        title: z.string(),
        blogId: z.string()
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.relationships).toBeDefined();
      expect(result.relationships).toHaveLength(1);
      expect(result.relationships?.[0]).toMatchObject({
        field: 'blogId',
        targetCollection: 'blog',
        type: 'one-to-one',
        displayField: 'title'
      });
    });

    it('should infer one-to-many relationship from array field', () => {
      const schema = z.object({
        title: z.string(),
        projects: z.array(z.string())
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.relationships).toBeDefined();
      expect(result.relationships).toHaveLength(1);
      expect(result.relationships?.[0]).toMatchObject({
        field: 'projects',
        targetCollection: 'projects',
        type: 'one-to-many',
        displayField: 'title'
      });
    });

    it('should not infer relationships for tags array', () => {
      const schema = z.object({
        title: z.string(),
        tags: z.array(z.string())
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.relationships).toBeUndefined();
    });

    it('should not infer relationships for categories array', () => {
      const schema = z.object({
        title: z.string(),
        categories: z.array(z.string())
      });

      const result = SchemaParser.parseSchema(schema, 'test');

      expect(result.relationships).toBeUndefined();
    });
  });

  describe('loadContentCollections', () => {
    it('should load all predefined content collections', async () => {
      const schemas = await SchemaParser.loadContentCollections();

      expect(schemas).toBeDefined();
      expect(Object.keys(schemas)).toContain('blog');
      expect(Object.keys(schemas)).toContain('projects');
      expect(Object.keys(schemas)).toContain('docs');
      expect(Object.keys(schemas)).toContain('resumePersonal');
      expect(Object.keys(schemas)).toContain('resumeExperience');
      expect(Object.keys(schemas)).toContain('resumeEducation');
    });

    it('should have correct blog schema structure', async () => {
      const schemas = await SchemaParser.loadContentCollections();
      const blogSchema = schemas.blog;

      expect(blogSchema.collection).toBe('blog');
      expect(blogSchema.type).toBe('content');
      expect(blogSchema.fields).toBeDefined();

      const titleField = blogSchema.fields.find(f => f.name === 'title');
      expect(titleField).toMatchObject({
        name: 'title',
        type: 'string',
        required: true
      });

      const tagsField = blogSchema.fields.find(f => f.name === 'tags');
      expect(tagsField).toMatchObject({
        name: 'tags',
        type: 'array',
        arrayType: 'string',
        required: true
      });

      const featuredField = blogSchema.fields.find(f => f.name === 'featured');
      expect(featuredField).toMatchObject({
        name: 'featured',
        type: 'boolean',
        defaultValue: false,
        optional: true
      });
    });

    it('should have correct projects schema structure', async () => {
      const schemas = await SchemaParser.loadContentCollections();
      const projectsSchema = schemas.projects;

      expect(projectsSchema.collection).toBe('projects');

      const projectNameField = projectsSchema.fields.find(f => f.name === 'projectName');
      expect(projectNameField).toMatchObject({
        name: 'projectName',
        type: 'string',
        required: true
      });

      const technologiesField = projectsSchema.fields.find(f => f.name === 'technologies');
      expect(technologiesField).toMatchObject({
        name: 'technologies',
        type: 'array',
        arrayType: 'string',
        required: true
      });

      const githubLinkField = projectsSchema.fields.find(f => f.name === 'githubLink');
      expect(githubLinkField).toMatchObject({
        name: 'githubLink',
        type: 'string',
        optional: true
      });
    });

    it('should have correct docs schema structure', async () => {
      const schemas = await SchemaParser.loadContentCollections();
      const docsSchema = schemas.docs;

      expect(docsSchema.collection).toBe('docs');

      const groupField = docsSchema.fields.find(f => f.name === 'group');
      expect(groupField).toMatchObject({
        name: 'group',
        type: 'string',
        required: true
      });

      const orderField = docsSchema.fields.find(f => f.name === 'order');
      expect(orderField).toMatchObject({
        name: 'order',
        type: 'number',
        required: true
      });
    });

    it('should have correct resume schemas', async () => {
      const schemas = await SchemaParser.loadContentCollections();

      // Check resume personal schema
      expect(schemas.resumePersonal).toBeDefined();
      expect(schemas.resumePersonal.fields.find(f => f.name === 'name')).toBeDefined();

      // Check resume experience schema
      expect(schemas.resumeExperience).toBeDefined();
      expect(schemas.resumeExperience.fields.find(f => f.name === 'company')).toBeDefined();

      // Check resume education schema
      expect(schemas.resumeEducation).toBeDefined();
      expect(schemas.resumeEducation.fields.find(f => f.name === 'school')).toBeDefined();

      // Check resume skills schema
      expect(schemas.resumeSkills).toBeDefined();
      expect(schemas.resumeSkills.fields.find(f => f.name === 'skills')).toMatchObject({
        name: 'skills',
        type: 'array',
        arrayType: 'string'
      });
    });
  });
});
