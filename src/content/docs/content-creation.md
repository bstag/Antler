---
title: "Content Creation Guide"
description: "Learn how to create blog posts, projects, and documentation in MdCms"
group: "Content Management"
order: 1
---

# Content Creation Guide

This guide will walk you through creating different types of content in MdCms. You can create content in two ways:

1. **Admin Interface** (Recommended): Use the web-based editor at `/admin` for guided content creation
2. **Manual Creation**: Create Markdown files directly in the `src/content/` directory

## Content Creation Methods

### Using the Admin Interface

The admin interface provides a user-friendly way to create and manage content:

1. **Navigate to Admin**: Visit http://localhost:4321/admin during development
2. **Select Content Type**: Choose from Blog, Projects, Docs, or Resume sections
3. **Create New Content**: Click the "New" button to open the content editor
4. **Fill the Form**: Use the schema-aware form with validation and help text
5. **Preview Content**: See live preview of your Markdown as you type
6. **Save**: Content is automatically saved as Markdown files

**Benefits of Admin Interface:**
- ✅ Schema validation prevents errors
- ✅ Rich markdown editor with preview
- ✅ File upload integration
- ✅ Form-based editing for metadata
- ✅ No need to remember field names or formats

### Manual File Creation

You can also create content manually by adding Markdown files directly to the content directories. This method is useful for:
- Bulk content import
- Version control workflows
- Advanced users who prefer file-based editing
- Automated content generation

## Directory Structure

```
src/content/
├── blog/           # Blog posts
├── projects/       # Project showcases
├── docs/           # Documentation
└── config.ts       # Content type definitions
```

## Creating Blog Posts

Blog posts are stored in `src/content/blog/` and use the `.md` extension.

### Blog Post Structure

Create a new file like `src/content/blog/my-first-post.md`:

```markdown
---
title: "My First Blog Post"
description: "A brief description of what this post is about"
publicationDate: 2024-01-15
featuredImage: "/images/blog/my-first-post.jpg"
tags: ["astro", "web-development", "tutorial"]
author: "Your Name"
readingTime: 5
featured: true
---

# My First Blog Post

Your blog content goes here. You can use all standard Markdown features:

## Headings

### Subheadings

**Bold text** and *italic text*

- Bullet points
- More items

1. Numbered lists
2. Are also supported

```javascript
// Code blocks with syntax highlighting
function hello() {
  console.log("Hello, world!");
}
```

> Blockquotes for important information

[Links to other pages](https://example.com)
```

### Blog Post Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | The post title |
| `description` | string | ✅ | Brief description for SEO and previews |
| `publicationDate` | date | ✅ | When the post was published |
| `featuredImage` | string | ❌ | Path to featured image |
| `tags` | array | ✅ | Array of tag strings |
| `author` | string | ❌ | Author name |
| `readingTime` | number | ❌ | Estimated reading time in minutes |
| `featured` | boolean | ❌ | Whether to feature on homepage |

### Blog Post Tips

- **File naming**: Use kebab-case for filenames (e.g., `my-awesome-post.md`)
- **Images**: Store images in `public/images/blog/` and reference them with `/images/blog/filename.jpg`
- **Tags**: Use consistent tag names for better organization
- **Featured posts**: Set `featured: true` to display on the homepage

## Creating Projects

Projects are stored in `src/content/projects/` and showcase your work.

### Project Structure

Create a new file like `src/content/projects/my-awesome-app.md`:

```markdown
---
projectName: "My Awesome App"
projectImage: "/images/projects/my-awesome-app.jpg"
description: "A full-stack web application built with modern technologies"
technologies: ["React", "Node.js", "PostgreSQL", "TypeScript"]
githubLink: "https://github.com/username/my-awesome-app"
liveUrl: "https://my-awesome-app.com"
featured: true
createdAt: 2024-01-10
---

# My Awesome App

## Overview

Detailed description of your project goes here. Explain what it does, why you built it, and what problems it solves.

## Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Technical Details

### Architecture

Explain the technical architecture, design decisions, and implementation details.

### Challenges

Discuss any interesting challenges you faced and how you solved them.

## Screenshots

![App Screenshot](/images/projects/my-awesome-app-screenshot.jpg)

## What I Learned

Share insights and learnings from building this project.
```

### Project Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projectName` | string | ✅ | The project name |
| `projectImage` | string | ✅ | Path to project image |
| `description` | string | ✅ | Brief project description |
| `technologies` | array | ✅ | Array of technology strings |
| `githubLink` | string | ❌ | GitHub repository URL |
| `liveUrl` | string | ❌ | Live demo URL |
| `featured` | boolean | ❌ | Whether to feature on homepage |
| `createdAt` | date | ❌ | Project creation date |

## Creating Documentation

Documentation files are stored in `src/content/docs/` and are organized by groups.

### Documentation Structure

Create a new file like `src/content/docs/api-reference.md`:

```markdown
---
title: "API Reference"
description: "Complete API documentation for developers"
group: "API"
order: 1
---

# API Reference

## Authentication

All API requests require authentication...

## Endpoints

### GET /api/users

Returns a list of users.

**Parameters:**
- `limit` (optional): Number of users to return
- `offset` (optional): Number of users to skip

**Response:**
```json
{
  "users": [...],
  "total": 100
}
```

### POST /api/users

Creates a new user...
```

### Documentation Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | The document title |
| `description` | string | ❌ | Brief description |
| `group` | string | ✅ | Documentation group/category |
| `order` | number | ✅ | Order within the group |

### Documentation Organization

- **Groups**: Use the `group` field to organize related documentation
- **Order**: Use the `order` field to control the sequence within each group
- **Navigation**: The docs are automatically organized by group and order

## Markdown Features

All content types support these Markdown features:

### Basic Formatting
- **Bold**: `**text**` or `__text__`
- *Italic*: `*text*` or `_text_`
- `Code`: `` `code` ``
- ~~Strikethrough~~: `~~text~~`

### Code Blocks
```javascript
// Syntax highlighting supported
function example() {
  return "Hello, world!";
}
```

### Lists
- Unordered lists
- With multiple items

1. Ordered lists
2. Are numbered

### Links and Images
- [Internal links](./other-page)
- [External links](https://example.com)
- ![Images](/images/example.jpg)

### Tables
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |

### Blockquotes
> Important information or quotes

## Best Practices

### Content Organization
- Use descriptive filenames
- Keep content focused and scannable
- Use headings to structure content
- Include relevant images and examples

### SEO Optimization
- Write compelling titles and descriptions
- Use relevant tags for blog posts
- Include alt text for images
- Keep URLs clean and descriptive

### Image Management
- Store images in `public/images/`
- Use appropriate image formats (WebP when possible)
- Optimize image sizes for web
- Include descriptive alt text

### Consistency
- Use consistent naming conventions
- Follow the same structure for similar content types
- Maintain consistent tone and style
- Use the same date format throughout

## Next Steps

- Learn about [Content Types](./content-types) and their schemas
- Explore [Configuration](./configuration) options
- Discover how to [Add New Content Types](./adding-content-types)