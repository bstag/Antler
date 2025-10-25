---
title: Installation Guide
description: Step-by-step instructions for setting up Antler
group: Getting Started
order: 0
---

# Installation Guide

Welcome to Antler! This guide will walk you through setting up your development environment and getting your static site generator running with its powerful admin interface.

## System Requirements

Before installing Antler, ensure your system meets these requirements:

### Required Software
- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository and version control

### Supported Operating Systems
- **Windows**: 10 or later
- **macOS**: 10.15 (Catalina) or later
- **Linux**: Ubuntu 18.04+, CentOS 7+, or equivalent

### Hardware Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB free space for dependencies
- **Network**: Internet connection for dependency installation

## Installation Methods

### Method 1: Clone from Repository (Recommended)

This is the recommended method for developers who want the latest features and plan to contribute.

```bash
# Clone the repository
git clone https://github.com/your-username/antler.git

# Navigate to the project directory
cd antler

# Install dependencies
npm install
```

### Method 2: Download ZIP Archive

If you prefer not to use Git or want a specific release:

1. Visit the [GitHub repository](https://github.com/your-username/antler)
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the archive to your desired location
5. Open a terminal in the extracted folder
6. Run `npm install`

### Method 3: Use as Template

Create a new repository based on Antler:

1. Visit the [GitHub repository](https://github.com/your-username/antler)
2. Click "Use this template"
3. Create your new repository
4. Clone your new repository locally
5. Run `npm install`

## Dependency Installation

After obtaining the project files, install all required dependencies:

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### Key Dependencies Installed
- **Astro**: Static site generator framework
- **React**: For interactive components
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server

## Environment Setup

### 1. Environment Variables (Optional)

Create a `.env` file in the project root for optional configurations:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your preferred settings:

```env
# Contact form configuration (optional)
CONTACT_EMAIL=your-email@example.com
FROM_EMAIL=noreply@yourdomain.com

# Email service configuration (choose one)
RESEND_API_KEY=your-resend-api-key
SENDGRID_API_KEY=your-sendgrid-api-key

# Site configuration
SITE_URL=http://localhost:4321
```

### 2. Content Directory Setup

Antler comes with example content. You can start with these or replace them:

```bash
# Content is already organized in src/content/
src/content/
├── blog/           # Blog posts
├── docs/           # Documentation
├── projects/       # Portfolio projects
└── config.ts       # Content schemas
```

## Development Server Startup

Antler provides a dual-interface development experience:

### Start the Development Server

```bash
# Start the development server
npm run dev
```

You should see output similar to:

```
🚀 astro v4.16.18 started in 45ms

  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose

  ┃ Admin    http://localhost:4321/admin
```

### Accessing Your Site

Antler provides two interfaces during development:

#### 1. Public Site Interface
- **URL**: http://localhost:4321/
- **Purpose**: Your actual website as visitors will see it
- **Features**: Blog, projects, documentation, contact form

#### 2. Admin Interface (Development Only)
- **URL**: http://localhost:4321/admin
- **Purpose**: Content management and file uploads
- **Features**: 
  - Visual content editor with live preview
  - File manager for images and documents
  - Schema-aware forms with validation
  - Resume builder and management

**Important**: The admin interface is only available during development and is automatically excluded from production builds.

## Initial Configuration

### 1. Site Information

Update your site's basic information in `src/layouts/BaseLayout.astro`:

```astro
---
// Update these values
const siteTitle = "Your Site Name";
const siteDescription = "Your site description";
const siteUrl = "https://yourdomain.com";
---
```

### 2. Navigation Menu

Customize the navigation in `src/components/Header.astro`:

```astro
<!-- Update navigation links -->
<nav>
  <a href="/">Home</a>
  <a href="/blog">Blog</a>
  <a href="/projects">Projects</a>
  <a href="/docs">Docs</a>
  <a href="/contact">Contact</a>
</nav>
```

### 3. Content Schemas

Review and customize content schemas in `src/content/config.ts`:

```typescript
// Customize your content types
export const collections = {
  blog: defineCollection({
    type: 'content',
    schema: blogSchema,
  }),
  projects: defineCollection({
    type: 'content',
    schema: projectSchema,
  }),
  // Add your own collections
};
```

### 4. Styling and Theming

Customize your site's appearance:

- **Colors**: Edit `tailwind.config.mjs` for color schemes
- **Fonts**: Update font imports in `src/layouts/BaseLayout.astro`
- **Animations**: Modify `src/styles/animations.css`

## Verification Steps

After installation, verify everything is working:

### 1. Check Development Server
- Visit http://localhost:4321/ - should show your site
- Visit http://localhost:4321/admin - should show admin interface

### 2. Test Admin Interface
- Create a new blog post via the admin
- Upload an image through the file manager
- Verify content appears on the public site

### 3. Build Test
```bash
# Test production build
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Common Installation Issues

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# If version is too old, update Node.js
# Visit https://nodejs.org/ for the latest LTS version
```

#### Permission Errors (macOS/Linux)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

#### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

#### Dependency Installation Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Admin Interface Issues

#### Admin Interface Not Loading
1. Ensure development server is running (`npm run dev`)
2. Check browser console for JavaScript errors
3. Verify you're accessing http://localhost:4321/admin (not production URL)
4. Try refreshing the page or clearing browser cache

#### Content Not Saving
1. Check file permissions in the `src/content/` directory
2. Verify schema validation is passing
3. Look for error messages in browser console
4. Ensure content directory structure is correct

### Build Issues

#### Build Failures
```bash
# Check for TypeScript errors
npm run astro check

# Verbose build output
npm run build -- --verbose
```

#### Missing Dependencies
```bash
# Install missing peer dependencies
npm install --save-dev @types/node
```

## Next Steps

Now that Antler is installed and running, here's what to do next:

### 1. Explore the Admin Interface
- Visit http://localhost:4321/admin
- Create your first blog post
- Upload some images
- Explore the different content types

### 2. Customize Your Site
- Update site information and branding
- Modify the color scheme and styling
- Add your own content collections
- Configure contact forms and integrations

### 3. Learn the Workflow
- Read the [Content Management Guide](./admin-content-management)
- Explore [File Management](./admin-file-management) features
- Understand the [Admin Interface](./admin-interface) layout

### 4. Prepare for Deployment
- Review the [Deployment Guide](./deployment)
- Understand the development vs production differences
- Set up your hosting platform

### 5. Advanced Configuration
- Set up custom domains
- Configure email services for contact forms
- Implement analytics and monitoring
- Explore the [API Reference](./admin-api-reference) for custom integrations

## Getting Help

If you encounter issues during installation:

1. **Check the Documentation**: Browse the complete documentation in the admin interface
2. **Review Error Messages**: Look for specific error messages in the terminal or browser console
3. **Verify Requirements**: Ensure all system requirements are met
4. **Community Support**: Check the GitHub repository for issues and discussions
5. **Start Fresh**: If all else fails, try a clean installation in a new directory

## Development Tips

### Recommended VS Code Extensions
- **Astro**: Official Astro language support
- **Tailwind CSS IntelliSense**: CSS class autocomplete
- **TypeScript Importer**: Auto-import TypeScript modules
- **Prettier**: Code formatting
- **GitLens**: Enhanced Git integration

### Useful Commands
```bash
# Development
npm run dev              # Start development server
npm run dev -- --host    # Expose to network

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run astro check      # Type checking
```

### File Watching
The development server automatically watches for changes in:
- Content files (`src/content/`)
- Component files (`src/components/`)
- Page files (`src/pages/`)
- Style files (`src/styles/`)

Changes are reflected immediately in both the public site and admin interface.

---

**Congratulations!** 🎉 You now have Antler installed and running. The powerful combination of static site generation and an intuitive admin interface gives you the best of both worlds: developer-friendly workflows and content creator-friendly tools.

Ready to start creating? Head over to http://localhost:4321/admin and build something amazing!

