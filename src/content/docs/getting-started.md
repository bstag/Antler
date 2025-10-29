---
title: Getting Started
description: >-
  Introduction to Antler - A modern flat-file content management system built
  with Astro, featuring both static site generation and an admin interface
group: Getting Started
order: 1
---
Antler is a sophisticated, dual-purpose content management system that combines the power of static site generation with a comprehensive admin interface for content management.

## What Makes Antler Unique

### Dual Architecture
- **Development Mode**: Full-featured React-based admin interface at `/admin` with complete content management capabilities
- **Production Mode**: Pure static site generation for deployment to any hosting platform
- **Content-First**: All content stored as Markdown files with YAML frontmatter for maximum portability
- **Schema-Aware**: Built-in validation and type safety with Zod schemas for all content types

### Advanced Features

#### Content Management
- 📝 **Rich Content Editor**: Advanced Markdown editor with live preview and syntax highlighting
- 🎨 **Schema-Aware Forms**: Dynamic forms that adapt to content type schemas with real-time validation
- 📁 **File Management**: Complete file upload, organization, and asset management system
- 🔄 **Bulk Operations**: Mass content operations for efficient management
- 🔍 **Content Search**: Advanced search and filtering across all content types

#### Theme System
- 🎨 **16+ Color Themes**: Professional color schemes including Blue, Purple, Green, Orange families
- 🌓 **Real-time Switching**: Instant theme changes without page reload
- 💾 **User Preferences**: Persistent theme selection with localStorage
- 🎯 **Site-wide Configuration**: Set default themes and control user overrides

#### Resume Management
- 👤 **Complete Resume System**: 7 specialized content collections for professional profiles
- 📊 **Personal Information**: Contact details, bio, and professional summary
- 💼 **Experience Management**: Work history with detailed role descriptions
- 🎓 **Education Tracking**: Academic background and certifications
- 🛠️ **Skills Organization**: Technical and soft skills with proficiency levels
- 🏆 **Achievements**: Awards, certifications, and notable accomplishments
- 📋 **Projects Portfolio**: Professional and personal project showcases

#### Site Configuration
- ⚙️ **Template System**: Pre-built site templates for different use cases
- 🔧 **Configuration Management**: Comprehensive site settings through admin interface
- 📈 **Analytics Integration**: Built-in support for Google Analytics and other tracking
- 🔍 **SEO Optimization**: Meta tags, structured data, and search engine optimization
- 🌐 **Multi-mode Support**: Blog-only, portfolio, documentation, and hybrid modes

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

## Content Collections

Antler provides comprehensive content collections for different use cases:

### Core Collections
- **Blog Posts**: Articles with tags, featured images, publication dates, and reading time
- **Projects**: Portfolio items with technologies, GitHub links, live URLs, and detailed descriptions
- **Documentation**: Organized docs with groups, ordering, and cross-references
- **Team Members**: Staff profiles with roles, bio, and social links
- **Products**: Product showcases with pricing, features, and specifications

### Resume Collections
- **Personal Information**: Contact details, professional summary, and bio
- **Experience**: Work history with detailed role descriptions and achievements
- **Education**: Academic background, degrees, and certifications
- **Skills**: Technical and soft skills with proficiency levels
- **Achievements**: Awards, certifications, and notable accomplishments
- **Projects**: Professional and personal project portfolio
- **References**: Professional references and testimonials

Each content collection has its own Zod schema defined in `src/content/config.ts`, ensuring type safety, validation, and consistent data structure across your entire site.

## Next Steps

### Essential Guides
- Explore the [Admin Interface](./admin-interface) for comprehensive content management
- Learn about the [Theme System](./theme-system) and customization options
- Understand [Resume Management](./resume-management) for professional profiles
- Review [Site Configuration](./configuration) for advanced settings

### Advanced Features
- Check out [API Reference](./api-reference) for programmatic access
- Explore [Site Templates](./site-templates) for different use cases
- Learn about [Advanced Features](./advanced-features) and customization

### Development Workflow
1. **Content Creation**: Use the admin interface for guided content creation with schema validation
2. **Theme Customization**: Select and configure themes through the admin panel
3. **Site Configuration**: Set up analytics, SEO, and site-wide settings
4. **File Management**: Upload and organize assets through the file manager
5. **Production Build**: Generate static files for deployment

## Getting Help

- **Admin Interface**: Use the built-in help tooltips and guided forms
- **Documentation**: Comprehensive guides for all features and capabilities
- **Example Content**: Review sample content in each collection directory
- **API Reference**: Complete documentation for all available endpoints
- **Schema Validation**: Real-time feedback and error messages for content validation

