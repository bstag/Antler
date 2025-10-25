# Building and Deployment Guide

This comprehensive guide covers the build process and deployment strategies for Antler, explaining the differences between development and production environments, and providing step-by-step instructions for deploying to various hosting platforms.

## Understanding Antler's Dual Architecture

Antler operates differently in development and production environments:

### Development Mode

In development mode, Antler provides:
- **Full static site** with all public pages and content
- **Admin interface** at `/admin` for content management
- **Hot module reloading** for instant updates
- **File management system** for image uploads
- **Development server** with debugging tools

```bash
# Start development server
npm run dev

# Access development site
# Public site: http://localhost:4321
# Admin interface: http://localhost:4321/admin
```

### Production Mode

In production mode, Antler generates:
- **Pure static site** with pre-rendered HTML
- **No admin interface** (excluded from build)
- **Optimized assets** for performance
- **Minimal JavaScript** for interactivity
- **SEO-optimized output** ready for deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Build Process

### Standard Build

The standard build process creates a production-ready static site:

```bash
# Build for production
npm run build
```

This command:
1. Compiles all Astro components and pages
2. Processes all content collections
3. Optimizes images and assets
4. Generates static HTML files
5. Creates a production bundle in the `dist/` directory
6. **Excludes the admin interface** from the build

### Build Output

After running `npm run build`, the `dist/` directory contains:

```
dist/
├── _astro/           # Compiled assets (JS, CSS)
├── images/           # Optimized images
├── blog/             # Blog post pages
├── projects/         # Project pages
├── docs/             # Documentation pages
├── api/              # API endpoints (if using serverless)
├── favicon.svg       # Site favicon
└── index.html        # Homepage
```

### Environment-Specific Builds

You can create environment-specific builds using environment variables:

```bash
# Development build
NODE_ENV=development npm run build

# Production build
NODE_ENV=production npm run build

# Staging build
NODE_ENV=staging npm run build
```

## Deployment Strategies

### GitHub Pages

GitHub Pages is ideal for simple static sites without serverless functions:

1. **Create GitHub repository** for your Antler site
2. **Configure GitHub Actions** by creating `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

3. **Configure repository settings**:
   - Go to Settings > Pages
   - Set source to "GitHub Actions"

4. **Push to main branch** to trigger deployment

### Cloudflare Pages

Cloudflare Pages supports both static sites and serverless functions:

1. **Create Cloudflare account** if you don't have one
2. **Connect your GitHub repository**:
   - Go to Cloudflare Dashboard > Pages
   - Click "Create a project"
   - Select your repository

3. **Configure build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables (if needed)

4. **Deploy** and wait for build to complete

5. **Configure custom domain** (optional):
   - Go to project settings > Custom domains
   - Add your domain and follow DNS instructions

### Netlify

Netlify offers seamless deployment with serverless functions:

1. **Create Netlify account** if you don't have one
2. **Connect your GitHub repository**:
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Select your repository

3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables (if needed)

4. **Deploy** and wait for build to complete

5. **Configure custom domain** (optional):
   - Go to site settings > Domain management
   - Add your domain and follow DNS instructions

### Vercel

Vercel provides excellent performance and serverless capabilities:

1. **Create Vercel account** if you don't have one
2. **Import your GitHub repository**:
   - Go to Vercel Dashboard
   - Click "Import Project"
   - Select your repository

3. **Configure project settings**:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables (if needed)

4. **Deploy** and wait for build to complete

5. **Configure custom domain** (optional):
   - Go to project settings > Domains
   - Add your domain and follow DNS instructions

### AWS S3 + CloudFront

For enterprise deployments with maximum control:

1. **Create S3 bucket** for static hosting:
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Configure bucket for static website hosting**:
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document 404.html
   ```

3. **Set bucket policy** for public access:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

4. **Upload build files**:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

5. **Create CloudFront distribution** for CDN:
   - Origin: Your S3 bucket website endpoint
   - Default root object: index.html
   - Cache behaviors: Optimize for static assets
   - SSL certificate: Use ACM for custom domain

6. **Configure custom domain** with Route 53 (optional)

## Environment Variables

### Required Variables

None required for basic functionality, but these enhance features:

```env
# Contact form (for serverless functions)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your@email.com
FROM_EMAIL=noreply@yourdomain.com

# Analytics (optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Setting Environment Variables

#### Local Development

Create `.env` file in project root:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your@email.com
```

#### GitHub Pages

Add secrets in repository settings:

1. Go to Settings > Secrets and variables > Actions
2. Add repository secrets for each environment variable

#### Cloudflare/Netlify/Vercel

Add environment variables in project settings:

1. Go to project settings > Environment variables
2. Add key-value pairs for each variable

## Performance Optimization

### Build Optimization

Antler includes several build optimizations:

1. **Asset minification**:
   - JavaScript and CSS are automatically minified
   - Unused CSS is purged with Tailwind's JIT mode

2. **Image optimization**:
   - Images are processed with Astro's built-in optimizer
   - WebP format is generated for modern browsers
   - Responsive sizes are created for different viewports

3. **Font optimization**:
   - Fonts are preloaded and display swap is enabled
   - Local font files are used when possible

### Image Optimization

For optimal image performance:

1. **Use the built-in image component**:
   ```astro
   ---
   import { Image } from 'astro:assets';
   import myImage from '../assets/my-image.jpg';
   ---
   
   <Image src={myImage} alt="Description" />
   ```

2. **Specify responsive widths**:
   ```astro
   <Image 
     src={myImage} 
     alt="Description" 
     widths={[400, 800, 1200]} 
     sizes="(max-width: 767px) 100vw, 50vw" 
   />
   ```

3. **Use appropriate formats**:
   - WebP for general images
   - SVG for icons and simple graphics
   - AVIF for maximum compression (where supported)

### CDN Integration

For maximum performance, use a CDN:

1. **Cloudflare Pages**: Built-in CDN with automatic caching
2. **Netlify**: Global CDN included with all deployments
3. **Vercel**: Edge Network for optimal delivery
4. **CloudFront**: Custom configuration for AWS deployments

## SEO and Analytics

### SEO Configuration

Antler includes built-in SEO features:

1. **Meta tags** in `BaseLayout.astro`:
   ```astro
   <meta name="description" content={description} />
   <meta property="og:title" content={title} />
   <meta property="og:description" content={description} />
   ```

2. **Structured data** for content types:
   ```astro
   <script type="application/ld+json" set:html={JSON.stringify({
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": post.data.title,
     "datePublished": post.data.publishDate,
     // ...more properties
   })} />
   ```

3. **Sitemap generation** with `astro-sitemap`:
   ```js
   // astro.config.mjs
   import sitemap from '@astrojs/sitemap';
   
   export default defineConfig({
     site: 'https://yourdomain.com',
     integrations: [
       sitemap(),
     ],
   });
   ```

### Analytics Integration

Add analytics by modifying `BaseLayout.astro`:

```astro
---
// Add to the component script
const googleAnalyticsId = import.meta.env.GOOGLE_ANALYTICS_ID;
---

<!-- Add before closing </head> tag -->
{googleAnalyticsId && (
  <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}></script>
  <script define:vars={{ googleAnalyticsId }}>
    window.dataLayer = window.dataLayer || [];
    function gtag() {dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', googleAnalyticsId);
  </script>
)}
```

## Continuous Integration/Deployment

### GitHub Actions

Create `.github/workflows/ci.yml` for testing:

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run check
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
```

### Automated Deployments

Most hosting platforms (Netlify, Vercel, Cloudflare Pages) offer:

1. **Preview deployments** for pull requests
2. **Production deployments** for main branch
3. **Branch deployments** for feature testing
4. **Deploy hooks** for triggering builds via webhook

## Troubleshooting Deployments

### Common Issues

1. **Build failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Look for syntax errors in components

2. **Missing content**:
   - Ensure content files are committed to repository
   - Check content collection schemas for validation errors
   - Verify file paths are correct (case-sensitive)

3. **Styling issues**:
   - Check Tailwind configuration
   - Verify CSS imports in global styles
   - Test responsive layouts in different viewports

4. **404 errors**:
   - Configure proper 404 page handling
   - Check routing in `astro.config.mjs`
   - Verify file-based routing structure

### Debugging Builds

For detailed build information:

```bash
# Verbose build output
npm run build -- --verbose

# Debug mode
DEBUG=astro:* npm run build
```

## Conclusion

Antler's build and deployment process is designed to be flexible and powerful, allowing you to choose the hosting platform that best suits your needs. Remember that the admin interface is only available during development, and the production build generates a pure static site for optimal performance and security.

By following this guide, you should be able to successfully build and deploy your Antler site to your preferred hosting platform, with optimized performance and SEO features enabled.