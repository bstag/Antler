---
title: "Content Types & Schemas"
description: "Detailed explanation of each content type (blog, projects, docs) and their schemas"
group: "Content Management"
order: 2
---

# Content Types & Schemas

MdCms uses Astro's Content Collections feature to provide type-safe content management. Each content type has a defined schema that validates your content and provides TypeScript support.

## Content Collections Overview

All content types are defined in `src/content/config.ts` using Zod schemas. This ensures:

- **Type Safety**: TypeScript knows the exact structure of your content
- **Validation**: Content is validated at build time
- **IntelliSense**: Full autocomplete support in your IDE
- **Error Prevention**: Catch content errors before deployment

## Blog Collection

The blog collection is designed for articles, tutorials, and news posts.

### Schema Definition

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

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | The main title of the blog post |
| `description` | string | ✅ | Brief summary for SEO and previews |
| `publicationDate` | date | ✅ | When the post was published (YYYY-MM-DD) |
| `featuredImage` | string | ❌ | Path to hero image (e.g., "/images/blog/post.jpg") |
| `tags` | string[] | ✅ | Array of tags for categorization |
| `author` | string | ❌ | Author name |
| `readingTime` | number | ❌ | Estimated reading time in minutes |
| `featured` | boolean | ❌ | Whether to show on homepage |

### Example Blog Post

```markdown
---
title: "Getting Started with Astro"
description: "Learn how to build fast, modern websites with Astro's island architecture"
publicationDate: 2024-01-15
featuredImage: "/images/blog/astro-guide.jpg"
tags: ["astro", "web-development", "tutorial"]
author: "Jane Doe"
readingTime: 8
featured: true
---

# Getting Started with Astro

Your content here...
```

## Projects Collection

The projects collection showcases your work, portfolio items, or case studies.

### Schema Definition

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

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projectName` | string | ✅ | Name of the project |
| `projectImage` | string | ✅ | Path to project screenshot/image |
| `description` | string | ✅ | Brief project description |
| `technologies` | string[] | ✅ | Technologies used (e.g., ["React", "TypeScript"]) |
| `githubLink` | string | ❌ | GitHub repository URL |
| `liveUrl` | string | ❌ | Live demo/production URL |
| `featured` | boolean | ❌ | Whether to show on homepage |
| `createdAt` | date | ❌ | Project creation date |

### Example Project

```markdown
---
projectName: "E-commerce Dashboard"
projectImage: "/images/projects/dashboard.jpg"
description: "A modern admin dashboard for managing online stores with real-time analytics"
technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase"]
githubLink: "https://github.com/username/ecommerce-dashboard"
liveUrl: "https://dashboard-demo.com"
featured: true
createdAt: 2024-01-10
---

# E-commerce Dashboard

Detailed project description and case study...
```

## Documentation Collection

The docs collection is for creating organized documentation, guides, and reference materials.

### Schema Definition

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

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Document title |
| `description` | string | ❌ | Brief description for SEO |
| `group` | string | ✅ | Category/section (e.g., "Getting Started") |
| `order` | number | ✅ | Sort order within the group |

### Example Documentation

```markdown
---
title: "API Reference"
description: "Complete API documentation for developers"
group: "Developer Guide"
order: 3
---

# API Reference

Your documentation content...
```

## Content Organization

### File Naming

- **Blog**: Use descriptive slugs (e.g., `getting-started-with-astro.md`)
- **Projects**: Use project names (e.g., `ecommerce-dashboard.md`)
- **Docs**: Use topic names (e.g., `api-reference.md`)

### Directory Structure

```
src/content/
├── blog/
│   ├── getting-started-with-astro.md
│   ├── building-with-react.md
│   └── deployment-guide.md
├── projects/
│   ├── ecommerce-dashboard.md
│   ├── portfolio-website.md
│   └── mobile-app.md
├── docs/
│   ├── installation.md
│   ├── getting-started.md
│   └── api-reference.md
└── config.ts
```

## Working with Content

### Accessing Content in Components

```typescript
// Get all blog posts
import { getCollection } from 'astro:content';
const blogPosts = await getCollection('blog');

// Get featured posts only
const featuredPosts = await getCollection('blog', ({ data }) => {
  return data.featured === true;
});

// Sort by date
const sortedPosts = blogPosts.sort((a, b) => 
  b.data.publicationDate.valueOf() - a.data.publicationDate.valueOf()
);
```

### Type Safety

When you access content, TypeScript knows the exact structure:

```typescript
// TypeScript knows these properties exist and their types
const post = blogPosts[0];
console.log(post.data.title); // string
console.log(post.data.publicationDate); // Date
console.log(post.data.tags); // string[]
```

## Best Practices

### Content Guidelines

1. **Consistent Naming**: Use kebab-case for file names
2. **Required Fields**: Always include required schema fields
3. **Image Paths**: Use absolute paths starting with `/`
4. **Date Format**: Use YYYY-MM-DD format for dates
5. **Tags**: Use lowercase, hyphenated tags for consistency

### SEO Optimization

1. **Descriptions**: Write compelling descriptions for better search results
2. **Images**: Always include alt text and optimize image sizes
3. **Titles**: Keep titles under 60 characters for search engines
4. **Tags**: Use relevant, searchable keywords

### Performance Tips

1. **Image Optimization**: Use WebP format when possible
2. **Content Length**: Break long content into multiple pages
3. **Featured Content**: Limit featured items to improve homepage performance
4. **Lazy Loading**: Images are automatically lazy-loaded by Astro