---
title: "Configuration Guide"
description: "How the content configuration works, schemas, and customization options"
group: "Content Management"
order: 3
---

# Configuration Guide

Antler uses Astro's Content Collections API for content management. This guide explains how to configure and customize your content types, schemas, and validation rules.

## Content Configuration File

All content configuration is centralized in `src/content/config.ts`. This file defines:

- Content collection schemas
- Validation rules
- Type definitions
- Field requirements

### Basic Structure

```typescript
import { defineCollection, z } from 'astro:content';

// Define individual collections
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Schema definition
  }),
});

// Export all collections
export const collections = {
  blog,
  projects,
  docs,
};
```

## Schema Definition with Zod

Antler uses [Zod](https://zod.dev/) for schema validation, providing powerful type checking and validation.

### Basic Field Types

```typescript
import { z } from 'astro:content';

const schema = z.object({
  // String fields
  title: z.string(),
  description: z.string().min(10).max(160), // With validation
  
  // Number fields
  readingTime: z.number().positive(),
  order: z.number().int(),
  
  // Boolean fields
  featured: z.boolean(),
  published: z.boolean().default(true),
  
  // Date fields
  publicationDate: z.coerce.date(), // Converts string to Date
  updatedAt: z.date().optional(),
  
  // Array fields
  tags: z.array(z.string()),
  categories: z.array(z.string()).min(1), // At least one item
  
  // Optional fields
  author: z.string().optional(),
  featuredImage: z.string().optional(),
});
```

### Advanced Field Validation

```typescript
const blogSchema = z.object({
  // Email validation
  authorEmail: z.string().email().optional(),
  
  // URL validation
  externalLink: z.string().url().optional(),
  
  // Enum values
  status: z.enum(['draft', 'published', 'archived']),
  
  // Custom validation
  slug: z.string().regex(/^[a-z0-9-]+$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens"
  }),
  
  // Conditional fields
  publishedAt: z.date().optional(),
  scheduledFor: z.date().optional(),
}).refine(data => {
  // Custom validation logic
  if (data.status === 'published' && !data.publishedAt) {
    return false;
  }
  return true;
}, {
  message: "Published posts must have a publication date",
  path: ["publishedAt"]
});
```

## Current Collection Configurations

### Blog Collection

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publicationDate: z.coerce.date(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()),
    author: z.string().optional(),
    readingTime: z.number().optional(),
    featured: z.boolean().optional(),
  }),
});
```

**Customization Options:**

```typescript
// Add validation rules
title: z.string().min(5).max(100),
description: z.string().min(20).max(160),

// Add default values
featured: z.boolean().default(false),
author: z.string().default("Anonymous"),

// Add new fields
excerpt: z.string().optional(),
seoTitle: z.string().optional(),
canonicalUrl: z.string().url().optional(),
```

### Projects Collection

```typescript
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    projectName: z.string(),
    projectImage: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    githubLink: z.string().optional(),
    liveUrl: z.string().optional(),
    featured: z.boolean().optional(),
    createdAt: z.coerce.date().optional(),
  }),
});
```

**Customization Options:**

```typescript
// Add validation for URLs
githubLink: z.string().url().optional(),
liveUrl: z.string().url().optional(),

// Add status tracking
status: z.enum(['planning', 'development', 'completed', 'archived']),

// Add team information
team: z.array(z.object({
  name: z.string(),
  role: z.string(),
  url: z.string().url().optional(),
})).optional(),
```

### Documentation Collection

```typescript
const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    group: z.string(),
    order: z.number(),
  }),
});
```

**Customization Options:**

```typescript
// Add navigation control
sidebar: z.boolean().default(true),
toc: z.boolean().default(true),

// Add versioning
version: z.string().optional(),
deprecated: z.boolean().default(false),

// Add difficulty level
difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
```

## Environment-Specific Configuration

### Development vs Production

```typescript
// config.ts
const isDev = import.meta.env.DEV;

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Only require description in production
    description: isDev ? z.string().optional() : z.string(),
    // Allow draft posts in development
    draft: z.boolean().default(false),
  }).refine(data => {
    // In production, don't allow draft posts
    if (!isDev && data.draft) {
      return false;
    }
    return true;
  }),
});
```

## Custom Validation Functions

### Creating Reusable Validators

```typescript
// utils/validators.ts
import { z } from 'astro:content';

export const slugValidator = z.string().regex(/^[a-z0-9-]+$/, {
  message: "Must be lowercase with hyphens only"
});

export const imagePathValidator = z.string().refine(
  (path) => path.startsWith('/images/'),
  { message: "Image path must start with /images/" }
);

export const tagValidator = z.array(z.string()).refine(
  (tags) => tags.every(tag => tag.length >= 2),
  { message: "All tags must be at least 2 characters long" }
);
```

### Using Custom Validators

```typescript
import { slugValidator, imagePathValidator, tagValidator } from '../utils/validators';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    slug: slugValidator,
    featuredImage: imagePathValidator.optional(),
    tags: tagValidator,
  }),
});
```

## Configuration Best Practices

### 1. Schema Design

```typescript
// ✅ Good: Clear, specific field names
const schema = z.object({
  title: z.string(),
  metaDescription: z.string(),
  featuredImage: z.string().optional(),
});

// ❌ Avoid: Vague or confusing names
const schema = z.object({
  name: z.string(),
  desc: z.string(),
  img: z.string().optional(),
});
```

### 2. Validation Rules

```typescript
// ✅ Good: Meaningful validation with helpful messages
title: z.string()
  .min(5, "Title must be at least 5 characters")
  .max(100, "Title must be less than 100 characters"),

// ✅ Good: Sensible defaults
featured: z.boolean().default(false),
publishedAt: z.coerce.date().default(() => new Date()),
```

### 3. Optional vs Required Fields

```typescript
// ✅ Good: Clear distinction between required and optional
const schema = z.object({
  // Always required
  title: z.string(),
  content: z.string(),
  
  // Optional but recommended
  description: z.string().optional(),
  author: z.string().optional(),
  
  // Optional metadata
  seoTitle: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
});
```

## Troubleshooting Configuration Issues

### Common Errors

1. **Schema Validation Errors**
   ```
   Error: Invalid frontmatter in blog/my-post.md
   ```
   - Check that all required fields are present
   - Verify field types match the schema
   - Ensure date formats are correct (YYYY-MM-DD)

2. **Type Errors**
   ```
   Property 'newField' does not exist on type...
   ```
   - Run `npx astro sync` after schema changes
   - Restart your TypeScript server
   - Check that the field is defined in the schema

3. **Build Failures**
   ```
   Content collection validation failed
   ```
   - Review all content files for schema compliance
   - Check for missing required fields
   - Validate date and URL formats

### Debugging Tips

1. **Enable Verbose Logging**
   ```typescript
   // astro.config.mjs
   export default defineConfig({
     // Enable detailed error messages
     vite: {
       logLevel: 'info'
     }
   });
   ```

2. **Test Schema Changes**
   ```bash
   # Validate content after schema changes
   npx astro sync
   npx astro check
   ```

3. **Use TypeScript Strict Mode**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true
     }
   }
   ```

## Migration Guide

### Updating Existing Content

When changing schemas, you may need to update existing content:

1. **Adding Required Fields**
   ```bash
   # Find files missing the new field
   grep -L "newField:" src/content/blog/*.md
   ```

2. **Changing Field Types**
   ```typescript
   // Before: string
   publishedAt: z.string(),
   
   // After: date (with migration)
   publishedAt: z.coerce.date(),
   ```

3. **Renaming Fields**
   ```bash
   # Use sed to rename fields across files
   sed -i 's/oldFieldName:/newFieldName:/g' src/content/blog/*.md
   ```

### Schema Versioning

For major changes, consider versioning your schemas:

```typescript
const blogV1 = z.object({
  title: z.string(),
  date: z.string(),
});

const blogV2 = z.object({
  title: z.string(),
  publicationDate: z.coerce.date(),
  version: z.literal(2).default(2),
});

// Use union for backward compatibility
const blog = defineCollection({
  type: 'content',
  schema: z.union([blogV1, blogV2]),
});
```