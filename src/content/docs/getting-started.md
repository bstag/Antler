---
title: Getting Started
description: >-
  Introduction to Antler - A modern flat-file content management system built
  with Astro, featuring both static site generation and an admin interface
group: Getting Started
order: 1
---
Antler is a modern, dual-purpose content management system that combines the best of both worlds:

1. **Static Site Generator**: Creates fast, secure, deployable static websites
2. **Admin Interface**: Provides a user-friendly content management interface during development

## What Makes Antler Unique

### Dual Architecture
- **Development Mode**: Full-featured admin interface at `/admin` for content management
- **Production Mode**: Pure static site generation for deployment to any hosting platform
- **Content-First**: All content stored as Markdown files with YAML frontmatter
- **Schema-Aware**: Built-in validation and type safety for all content types

### Key Features
- 📝 **Rich Content Editor**: Markdown editor with live preview
- 🎨 **Schema-Aware Forms**: Dynamic forms based on content type schemas
- 📁 **File Management**: Upload and manage images and assets
- 🚀 **Static Generation**: Deploy anywhere as a static site
- 🔧 **Type Safety**: Full TypeScript support with Zod validation
- 📱 **Responsive Design**: Mobile-first admin interface

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Basic knowledge of Markdown and web development

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access your site**:
   - **Public Site**: http://localhost:4321
   - **Admin Interface**: http://localhost:4321/admin

### First Steps

#### Using the Admin Interface
1. Navigate to http://localhost:4321/admin
2. Explore the dashboard to see your content overview
3. Click on any content type (Blog, Projects, Docs) to manage content
4. Use the "New" button to create content with guided forms
5. Upload images through the File Manager

#### Manual Content Creation
You can also create content manually by adding Markdown files to:
- `src/content/blog/` - Blog posts
- `src/content/projects/` - Project showcases  
- `src/content/docs/` - Documentation
- `src/content/resume*/` - Resume sections

## Development vs Production

### Development Mode
- Admin interface available at `/admin`
- Hot reloading for content changes
- File upload capabilities
- Dynamic API endpoints for content management

### Production Build
- Admin interface excluded from build
- Pure static files generated
- Optimized for deployment
- No server-side dependencies

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Content Types

Antler comes with several pre-configured content types:

- **Blog Posts**: Articles with tags, featured images, and publication dates
- **Projects**: Portfolio items with technologies, links, and descriptions
- **Documentation**: Organized docs with groups and ordering
- **Resume Sections**: Personal, experience, education, skills, and more

Each content type has its own schema defined in `src/content/config.ts`, ensuring type safety and validation.

## Next Steps

- Learn about [Content Creation](./content-creation) methods
- Explore the [Admin Interface](./admin-interface) features
- Understand [Content Types](./content-types) and schemas
- Configure your [Deployment](./deployment) strategy

## Getting Help

- Check the documentation for detailed guides
- Review example content in each content directory
- Use the admin interface for guided content creation
- Refer to the API reference for advanced customization

