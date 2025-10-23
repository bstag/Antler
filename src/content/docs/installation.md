---
title: "Installation Guide"
description: "Step-by-step instructions for setting up MdCms"
group: "Getting Started"
order: 1
---

# Installation Guide

Get up and running with MdCms in just a few minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **pnpm** package manager
- **Git** for version control

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flat-file-ssg.git
   cd flat-file-ssg
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321` to see your site.

## Project Structure

After installation, your project will have the following structure:

```
my-mdcms-site/
├── src/
│   ├── content/
│   │   ├── blog/
│   │   │   └── *.md
│   │   ├── projects/
│   │   │   └── *.md
│   │   ├── docs/
│   │   │   └── *.md
│   │   └── config.ts
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── public/
├── astro.config.mjs
└── package.json
```

## Configuration

The system uses Astro's content collections feature. Content is organized in the `src/content/` directory with the following structure:

- `src/content/blog/` - Blog posts
- `src/content/projects/` - Project showcases  
- `src/content/docs/` - Documentation files

Each content type has its own schema defined in `src/content/config.ts` for type safety and validation.

## Next Steps

- [Content Creation Guide](./content-creation)
- [Customization Options](./customization)
- [Deployment Instructions](./deployment)