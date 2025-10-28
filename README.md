# Antler - Markdown Content Management System

A modern, high-performance static site generator built with Astro that transforms Markdown files with YAML frontmatter into complete, pre-rendered websites. Antler combines the simplicity of flat-file content management with a powerful admin interface, making it easy to create and manage fast, secure websites without database complexity.

## Features

### Content Management
- **Admin Interface**: Full-featured React-based admin panel for managing all content types
- **Schema-Driven Forms**: Automatically generated forms based on content collection schemas
- **Content Collections**: Support for blog posts, documentation, projects, and resume sections
- **File Manager**: Built-in file upload and management system
- **Real-Time Validation**: Content validated against Zod schemas before saving
- **Markdown Editor**: Integrated editor with preview for content authoring

### Site Customization
- **Dynamic Configuration**: Modify site name, logos, author information, and footer content through the admin interface
- **Multiple Themes**: Pre-built color themes (blue, green, purple, orange, red) with dark mode support
- **Theme Manager**: Switch and preview themes directly in the admin panel
- **Logo Management**: Support for SVG, image, or text-based logos with live preview
- **Social Links**: Configure social media links for display across the site
- **SEO Settings**: Manage meta tags, keywords, and site verification

### Technical Features
- **Static Site Generation**: Pre-rendered HTML for maximum performance and security
- **Modern UI**: Responsive design built with Tailwind CSS
- **Mobile-First**: Works seamlessly on all devices
- **Dark Mode**: Built-in theme switching with localStorage persistence
- **Contact Forms**: Serverless form handling with Resend/SendGrid integration
- **SEO Optimized**: Meta tags, structured data, and performance optimized
- **Type Safety**: Full TypeScript support throughout the codebase
- **Base URL Support**: Deploy to subdirectories or root paths

## Project Structure

```text
/
├── public/
│   ├── favicon.svg
│   ├── images/              # User-uploaded images
│   └── styles/
│       └── themes/          # Theme CSS files
├── src/
│   ├── components/
│   │   ├── admin/           # Admin interface components
│   │   │   ├── AdminApp.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── ContentList.tsx
│   │   │   ├── ContentEditor.tsx
│   │   │   ├── FileManager.tsx
│   │   │   ├── SiteConfiguration.tsx
│   │   │   ├── ThemeManager.tsx
│   │   │   └── DynamicForm.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ...
│   ├── content/             # Content collections
│   │   ├── blog/            # Blog post markdown files
│   │   ├── docs/            # Documentation markdown files
│   │   ├── projects/        # Project showcase markdown files
│   │   ├── resume*/         # Resume section collections
│   │   └── config.ts        # Content collection schemas
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── MainLayout.astro
│   ├── lib/
│   │   ├── admin/           # Admin utilities and types
│   │   │   ├── api-client.ts
│   │   │   ├── content.ts
│   │   │   └── types.ts
│   │   └── config/          # Configuration management
│   │       ├── client.ts
│   │       ├── defaults.ts
│   │       ├── manager.ts
│   │       ├── static.ts
│   │       └── validation.ts
│   ├── pages/
│   │   ├── admin/           # Admin interface routes
│   │   │   ├── api/         # Admin API endpoints
│   │   │   └── [...slug].astro
│   │   ├── api/             # Public API endpoints
│   │   │   └── config/
│   │   ├── blog/
│   │   ├── docs/
│   │   ├── projects/
│   │   └── index.astro
│   ├── styles/
│   │   ├── global.css
│   │   └── animations.css
│   ├── types/
│   │   └── config.ts        # Configuration TypeScript types
│   └── utils/
├── site.config.json         # Site configuration file
└── package.json
```

## Getting Started

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd Antler
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The site will be available at [http://localhost:4321](http://localhost:4321)

   Access the admin interface at [http://localhost:4321/admin](http://localhost:4321/admin)

3. **Build for Production**
   ```bash
   npm run build
   ```
   The static site will be generated in `./dist/`

## Admin Interface

The admin interface provides a complete content management system accessible at `/admin`:

### Dashboard
- Overview of all content collections
- Quick access to recent content
- Statistics for each collection

### Content Management
- **Create**: Add new blog posts, docs, projects, or resume sections
- **Edit**: Modify existing content with live preview
- **Delete**: Remove content items
- **Search & Filter**: Find content quickly
- **Sorting**: Organize by date, title, or other fields

### Site Configuration
Configure your site through intuitive tabs:
- **General**: Site name, description, tagline, and author information
- **Logo**: Upload or customize your site logo with live preview
- **Social**: Configure social media links (GitHub, Twitter, LinkedIn, etc.)
- **SEO**: Set default images, keywords, and verification codes
- **Footer**: Customize copyright text and footer links

### Theme Management
- Preview and switch between color themes
- Toggle dark mode support
- Customize theme settings

### File Manager
- Upload images and assets
- Browse uploaded files
- Delete unused files
- Organize files by directory

## Content Collections

Antler supports multiple content types through Astro's Content Collections:

### Blog Posts (`src/content/blog/`)
- Title, description, publication date
- Tags for categorization
- Featured images
- Author information
- Reading time estimation

### Documentation (`src/content/docs/`)
- Organized by groups
- Ordered navigation
- Version tracking
- Code examples

### Projects (`src/content/projects/`)
- Project name and description
- Technologies used
- GitHub links and live URLs
- Featured project highlighting

### Resume Sections
- Personal information
- Work experience
- Education
- Skills
- Certifications
- Languages
- Projects

Each collection is defined with Zod schemas in `src/content/config.ts` for type safety and validation.

## Configuration

### Site Configuration (`site.config.json`)

The main configuration file controls site-wide settings:

```json
{
  "customization": {
    "siteName": "Your Site Name",
    "description": "Site description",
    "author": {
      "name": "Your Name",
      "email": "your.email@example.com"
    },
    "social": {
      "github": "https://github.com/username",
      "twitter": "https://twitter.com/username"
    },
    "footer": {
      "copyrightText": "© 2024 Your Name",
      "showBuiltWith": true
    }
  }
}
```

All settings can be modified through the admin interface at `/admin/site-config`.

### Base URL Configuration (`astro.config.mjs`)

For subdirectory deployments (e.g., GitHub Pages):

```javascript
export default defineConfig({
  base: '/subdirectory',
  // ... other config
});
```

### Environment Variables

For contact form functionality:

```env
RESEND_API_KEY=your_resend_api_key
SENDGRID_API_KEY=your_sendgrid_api_key  # Alternative
CONTACT_EMAIL=recipient@example.com
FROM_EMAIL=sender@example.com
```

## Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm test`                | Run test suite with Vitest                       |
| `npm run test:ui`         | Run tests with visual UI interface               |
| `npm run astro check`     | Type checking and diagnostics                    |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## Deployment

### Cloudflare Pages (Recommended)

Cloudflare Pages supports serverless functions for contact forms:

1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist/`
4. Add environment variables for contact form
5. Deploy

### GitHub Pages

For static deployment without serverless functions:

1. Set `base` in `astro.config.mjs` to your repository name
2. Use GitHub Actions for deployment
3. Contact form requires external service integration

### Other Platforms

Antler can be deployed to any static hosting platform:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Azure Static Web Apps

## Architecture

### Static Site Generation

The production site is entirely static:
- All pages pre-rendered at build time
- No runtime server required
- Configuration baked into HTML during build
- Maximum performance and security

### Admin Interface

The admin interface runs separately:
- React-based SPA with dynamic routing
- RESTful API endpoints for content management
- Schema-driven form generation
- Client-side validation with server-side persistence

### Content Workflow

1. Edit content in admin interface
2. Content saved to markdown files
3. Run build to regenerate static site
4. Deploy updated static files

## Technology Stack

- **Astro** - Static site generator with content collections
- **React** - Admin interface and interactive components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **React Router** - Admin routing
- **Vitest** - Testing framework

## Development

### Adding New Content Types

1. Define schema in `src/content/config.ts`
2. Create collection directory in `src/content/`
3. Admin interface auto-generates forms from schema
4. Create display pages in `src/pages/`

### Customizing Themes

Themes are located in `public/styles/themes/`:
- Modify existing theme CSS files
- Add new theme files following the naming pattern
- Themes automatically available in admin interface

### Extending the Admin Interface

The admin system is modular:
- Components in `src/components/admin/`
- API routes in `src/pages/admin/api/`
- Utilities in `src/lib/admin/`

## Testing

Run the test suite:

```bash
npm test              # Run all tests
npm run test:ui       # Run with UI
npm run test:coverage # Generate coverage report
```

Tests cover:
- Content collection schemas
- Form validation
- React components
- API endpoints

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

## License

MIT License - see LICENSE file for details
