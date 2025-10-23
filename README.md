# MdCms - Markdown Content Management System

A modern, high-performance static site generator built with Astro that transforms Markdown files with YAML frontmatter into complete, pre-rendered websites. Perfect for developers who want fast, secure, and maintainable websites without database complexity.

## ✨ Features

- 📝 **Content Collections**: Organized blog posts, documentation, and projects
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🚀 **Fast Performance**: Static site generation with Astro
- 📱 **Mobile-First**: Responsive design that works on all devices
- 🌙 **Dark Mode**: Built-in theme switching
- 📧 **Contact Forms**: Serverless form handling with Supabase
- 🔍 **SEO Optimized**: Meta tags, structured data, and performance optimized

## 🚀 Project Structure

Inside of your MdCms project, you'll see the following folders and files:

```text
/
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ContactForm.tsx
│   │   ├── FeaturedPosts.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ...
│   ├── content/            # Content collections (Astro best practice)
│   │   ├── blog/           # Blog post markdown files
│   │   ├── docs/           # Documentation markdown files
│   │   ├── projects/       # Project showcase markdown files
│   │   └── config.ts       # Content collection schemas
│   ├── layouts/            # Page layout templates
│   │   ├── BaseLayout.astro
│   │   └── MainLayout.astro
│   ├── pages/              # File-based routing
│   │   ├── blog/
│   │   ├── docs/
│   │   ├── projects/
│   │   ├── index.astro
│   │   └── ...
│   ├── styles/             # Global styles and animations
│   └── utils/              # Utility functions
├── supabase/               # Database migrations and config
└── package.json
```

## 📝 Content Collections

This project uses Astro's Content Collections feature for organized content management:

- **Blog Posts** (`src/content/blog/`): Articles and blog posts with frontmatter for metadata
- **Documentation** (`src/content/docs/`): Technical documentation and guides  
- **Projects** (`src/content/projects/`): Portfolio projects and case studies

Each collection is defined in `src/content/config.ts` with TypeScript schemas for type safety and validation.

### Adding Content

1. Create a new `.md` file in the appropriate collection folder
2. Add YAML frontmatter with required fields:

```yaml
---
title: "Your Post Title"
description: "Brief description"
publishDate: 2024-01-15
tags: ["astro", "markdown"]
---
```

3. Write your content in Markdown below the frontmatter

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd MdCms
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

3. **Add Your Content**
   - Create markdown files in `src/content/blog/`, `src/content/docs/`, or `src/content/projects/`
   - Follow the frontmatter schema defined in `src/content/config.ts`

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🏗️ Built With

- **[Astro](https://astro.build)** - Static site generator with content collections
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Supabase](https://supabase.com)** - Backend as a service for forms and data

## 📁 Content Collections Structure

The `src/content/` directory follows Astro's recommended best practices:

```text
src/content/
├── config.ts           # Collection schemas and validation
├── blog/              # Blog posts collection
│   ├── post-1.md
│   └── post-2.md
├── docs/              # Documentation collection  
│   ├── getting-started.md
│   └── configuration.md
└── projects/          # Projects collection
    ├── project-1.md
    └── project-2.md
```

This structure ensures:
- Type safety with TypeScript schemas
- Automatic content validation
- Optimized build performance
- Easy content management

## 👀 Want to learn more?

- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
