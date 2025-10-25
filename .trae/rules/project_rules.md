# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Antler is a modern static site generator (SSG) built with Astro, designed to transform Markdown files with YAML frontmatter into complete, pre-rendered websites. The project uses a flat-file architecture with no database dependencies, making it fast, secure, and maintainable.

## Development Commands

### Core Commands
- `npm run dev` - Start local development server at `localhost:4321`
- `npm run build` - Build production site to `./dist/`
- `npm run preview` - Preview production build locally
- `npm run astro ...` - Run Astro CLI commands (add, check, etc.)

### Setup Commands
- `npm install` - Install dependencies after clone

## Architecture

### Content Collections System
The project uses Astro's Content Collections for organized, type-safe content management:

- **Blog** (`src/content/blog/`): Articles with metadata including publication date, tags, featured images, and reading time
- **Projects** (`src/content/projects/`): Portfolio items with technologies, GitHub links, and live URLs
- **Documentation** (`src/content/docs/`): Technical docs with grouping and ordering

Content schemas are defined in `src/content/config.ts` using Zod validation for type safety.

### Component Architecture
- **Astro Components** (`.astro`): Server-side rendered components for layouts and static content
- **React Components** (`.tsx`): Client-side interactive components (ContactForm, ThemeToggle)
- **Layout System**: BaseLayout provides global structure, MainLayout for content pages

### Styling & Theming
- **Tailwind CSS** with custom animations and transitions
- **Dark Mode**: Built-in theme switching with localStorage persistence and system preference detection
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Animations**: Custom CSS classes defined in `src/styles/animations.css` for scroll-triggered animations

### Form Handling
The contact form supports multiple deployment strategies:
- **Cloudflare Pages**: Serverless function at `functions/contact.js` with Resend/SendGrid integration
- **Static Hosting**: Fallback mode for GitHub Pages with form service integration (Formspree, EmailJS)

### Routing Structure
- **File-based routing**: Automatic route generation from `src/pages/`
- **Dynamic routes**: `[slug].astro` files for individual content items
- **Collection pages**: Index pages for each content type with automatic filtering and sorting

## Key Files

### Configuration
- `astro.config.mjs` - Astro configuration with integrations for Tailwind and React
- `src/content/config.ts` - Content collection schemas and validation rules
- `tailwind.config.mjs` - Tailwind CSS configuration and custom theme

### Core Components
- `src/layouts/BaseLayout.astro` - Global layout with SEO meta tags and theme script
- `src/components/Header.astro` - Navigation with mobile menu and theme toggle
- `src/components/ContactForm.tsx` - Interactive contact form with validation
- `functions/contact.js` - Serverless function for form submissions

### Styling
- `src/styles/global.css` - Global styles and Tailwind imports
- `src/styles/animations.css` - Custom animation classes for scroll effects

## Content Management

### Adding New Content
1. Create `.md` file in appropriate collection directory (`blog/`, `projects/`, `docs/`)
2. Include required frontmatter fields as defined in `src/content/config.ts`
3. Use Markdown syntax for content body
4. Images should be placed in `public/images/` or referenced externally

### Frontmatter Requirements
- **Blog**: title, description, publicationDate, tags (required); featuredImage, author, readingTime, featured (optional)
- **Projects**: projectName, projectImage, description, technologies (required); githubLink, liveUrl, featured, createdAt (optional)
- **Documentation**: title, group, order (required); description (optional)

## Deployment

### Cloudflare Pages (Recommended)
- Supports serverless functions for contact form
- Set environment variables: `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL`
- Build command: `npm run build`
- Build output: `dist/`

### GitHub Pages
- Static deployment only (contact form requires external service)
- Use GitHub Actions for automated deployment
- Configure form service (Formspree, EmailJS) for contact functionality

### Environment Variables
- `RESEND_API_KEY` - Email service API key (Resend)
- `SENDGRID_API_KEY` - Alternative email service (SendGrid)
- `CONTACT_EMAIL` - Destination email for form submissions
- `FROM_EMAIL` - Verified sender email

## Development Notes

### Content Validation
All content is validated against Zod schemas during build. Type errors will appear if required frontmatter fields are missing or incorrectly typed.

### Performance Considerations
- Images are optimized through Astro's built-in image processing
- Content collections enable efficient static generation
- Minimal JavaScript for core functionality
- CSS is purged in production builds

### Theme System
The theme system prevents flash of unstyled content (FOUC) by:
1. Detecting saved theme or system preference
2. Applying theme class to `<html>` element before page render
3. Persisting theme changes to localStorage

### Animation System
Scroll-triggered animations use Intersection Observer API:
- Elements with `fade-in-on-scroll` class animate when visible
- Staggered animations with `animate-stagger` container
- Custom animation classes defined in `animations.css`