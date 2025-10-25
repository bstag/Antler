# Antler Project Structure Guide

This document provides a comprehensive guide to the Antler project structure, emphasizing the proper organization of content collections following Astro's best practices.

## Directory Structure

```text
Antler/
├── .gitignore
├── .trae/                      # Trae AI documentation
│   └── documents/
│       ├── Product Requirements Document.md
│       ├── Technical Architecture Document.md
│       └── Project Structure Guide.md
├── .vscode/                    # VS Code configuration
│   ├── extensions.json
│   └── launch.json
├── README.md                   # Project documentation
├── astro.config.mjs           # Astro configuration
├── package.json               # Dependencies and scripts
├── package-lock.json
├── tailwind.config.mjs        # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── public/                    # Static assets
│   ├── favicon.svg
│   └── images/
├── src/                       # Source code (Astro convention)
│   ├── components/            # Reusable UI components
│   │   ├── ContactForm.tsx
│   │   ├── FeaturedPosts.astro
│   │   ├── FeaturedProjects.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── ThemeToggle.tsx
│   │   ├── icons/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── content/               # Content collections (ASTRO BEST PRACTICE)
│   │   ├── blog/              # Blog posts collection
│   │   │   ├── building-with-astro.md
│   │   │   ├── getting-started-with-ssg.md
│   │   │   └── modern-web-development.md
│   │   ├── docs/              # Documentation collection
│   │   │   ├── adding-content-types.md
│   │   │   ├── configuration.md
│   │   │   ├── content-creation.md
│   │   │   ├── content-types.md
│   │   │   ├── customization.md
│   │   │   ├── deployment.md
│   │   │   ├── getting-started.md
│   │   │   └── installation.md
│   │   ├── projects/          # Projects collection
│   │   │   ├── antler.md
│   │   │   └── portfolio-website.md
│   │   └── config.ts          # Content collection schemas
│   ├── layouts/               # Page layout templates
│   │   ├── BaseLayout.astro
│   │   └── MainLayout.astro
│   ├── lib/                   # External service integrations
│   │   └── supabase.ts
│   ├── pages/                 # File-based routing
│   │   ├── api/               # API endpoints
│   │   ├── blog/              # Blog pages
│   │   ├── docs/              # Documentation pages
│   │   ├── projects/          # Project pages
│   │   ├── api-reference.astro
│   │   ├── contact.astro
│   │   ├── index.astro        # Homepage
│   │   └── resume.astro
│   ├── styles/                # Global styles
│   │   ├── animations.css
│   │   └── global.css
│   └── utils/                 # Utility functions
└── supabase/                  # Database configuration
    └── migrations/
        └── create_contact_submissions.sql
├── package.json               # Dependencies and scripts
├── package-lock.json
├── tailwind.config.mjs        # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── public/                    # Static assets
│   ├── favicon.svg
│   └── images/
├── src/                       # Source code (Astro convention)
│   ├── components/            # Reusable UI components
│   │   ├── ContactForm.tsx
│   │   ├── FeaturedPosts.astro
│   │   ├── FeaturedProjects.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── ThemeToggle.tsx
│   │   ├── icons/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── content/               # Content collections (ASTRO BEST PRACTICE)
│   │   ├── blog/              # Blog posts collection
│   │   │   ├── building-with-astro.md
│   │   │   ├── getting-started-with-ssg.md
│   │   │   └── modern-web-development.md
│   │   ├── docs/              # Documentation collection
│   │   │   ├── adding-content-types.md
│   │   │   ├── configuration.md
│   │   │   ├── content-creation.md
│   │   │   ├── content-types.md
│   │   │   ├── customization.md
│   │   │   ├── deployment.md
│   │   │   ├── getting-started.md
│   │   │   └── installation.md
│   │   ├── projects/          # Projects collection
│   │   │   ├── antler.md
│   │   │   └── portfolio-website.md
│   │   └── config.ts          # Content collection schemas
│   ├── layouts/               # Page layout templates
│   │   ├── BaseLayout.astro
│   │   └── MainLayout.astro
│   ├── lib/                   # External service integrations
│   │   └── supabase.ts
│   ├── pages/                 # File-based routing
│   │   ├── api/               # API endpoints
│   │   ├── blog/              # Blog pages
│   │   ├── docs/              # Documentation pages
│   │   ├── projects/          # Project pages
│   │   ├── api-reference.astro
│   │   ├── contact.astro
│   │   ├── index.astro        # Homepage
│   │   └── resume.astro
│   ├── styles/                # Global styles
│   │   ├── animations.css
│   │   └── global.css
│   └── utils/                 # Utility functions
└── supabase/                  # Database configuration
    └── migrations/
        └── create_contact_submissions.sql
```

## Key Principles

### 1. Content Collections Location
**CRITICAL**: Content collections MUST be located in `src/content/` following Astro's official best practices:

- ✅ **Correct**: `src/content/blog/`, `src/content/docs/`, `src/content/projects/`
- ❌ **Incorrect**: `content/blog/`, `content/docs/`, `content/projects/` (root level)

### 2. Content Collection Benefits
The `src/content/` structure provides:
- **Type Safety**: TypeScript schemas defined in `config.ts`
- **Automatic Validation**: Content validation at build time
- **Optimized Performance**: Astro's content layer optimizations
- **Developer Experience**: IntelliSense and error checking
- **Build Integration**: Seamless integration with Astro's build process

### 3. Schema Configuration
All content collections are defined in `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()),
  }),
});

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

export const collections = { blog, docs, projects };
```

## Content Management Workflow

### Adding New Content
1. Navigate to the appropriate collection directory in `src/content/`
2. Create a new `.md` file with descriptive filename
3. Add YAML frontmatter following the schema
4. Write content in Markdown format

### Example Blog Post
```markdown
---
title: "Getting Started with Astro"
description: "Learn how to build fast websites with Astro"
publishDate: 2024-01-15
tags: ["astro", "web-development", "static-site"]
---

# Getting Started with Astro

Your content here...
```

## Migration Notes

If content collections were previously located in a root-level `content/` directory, they have been moved to `src/content/` to follow Astro's best practices. This ensures:

1. Proper integration with Astro's content layer
2. Type safety and validation
3. Optimized build performance
4. Consistent project structure

## Best Practices

1. **Always use `src/content/`** for content collections
2. **Define schemas** in `src/content/config.ts` for type safety
3. **Use descriptive filenames** for content files
4. **Follow consistent frontmatter** structure across collections
5. **Organize components** logically in `src/components/`
6. **Keep layouts** in `src/layouts/` for reusability
7. **Use file-based routing** in `src/pages/` for automatic route generation

This structure ensures maintainability, performance, and follows Astro's recommended conventions for professional web development.