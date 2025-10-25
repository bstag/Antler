---
title: "Deployment Guide"
description: "How to deploy your Antler site to various hosting platforms"
group: "Advanced"
order: 3
---

# Deployment Guide

Antler is a dual-architecture static site generator that operates differently in development and production environments. This guide covers the build process, deployment strategies, and platform-specific configurations.

## Development vs Production Architecture

### Development Mode
In development, Antler provides a **full-featured admin interface** alongside your static site:

- **Admin Interface**: Available at `http://localhost:4321/admin`
- **Content Management**: Visual editors, forms, and file management
- **API Endpoints**: RESTful API for content and file operations
- **Real-time Updates**: Hot reloading and live preview
- **Schema Validation**: Dynamic form generation and validation

### Production Mode
In production, Antler generates a **pure static site** with no admin functionality:

- **Static Files Only**: Pre-rendered HTML, CSS, and JavaScript
- **No Admin Interface**: Admin routes are excluded from the build
- **No API Endpoints**: Server-side functionality is removed
- **Optimized Performance**: Minimal JavaScript and fast loading
- **Security**: No dynamic functionality or admin access

This dual architecture ensures you get the best of both worlds: powerful content management during development and optimal performance in production.

## Build Process

Before deploying, you need to build your site for production:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the build locally (optional)
npm run preview
```

### What Happens During Build

The production build process:

1. **Content Processing**: All Markdown files are processed and converted to HTML
2. **Static Generation**: Pages are pre-rendered as static HTML files
3. **Asset Optimization**: Images, CSS, and JavaScript are optimized and minified
4. **Admin Exclusion**: All admin-related code and routes are excluded from the build
5. **File Output**: Clean, optimized static files are generated in the `dist/` directory

### Build Output Structure

```
dist/
├── index.html              # Homepage
├── blog/                   # Blog posts
│   ├── index.html         # Blog listing
│   └── [slug]/            # Individual posts
├── projects/              # Project pages
├── docs/                  # Documentation
├── assets/                # Optimized CSS/JS
├── images/                # Optimized images
└── _astro/                # Astro runtime files
```

**Important**: The `dist/` directory contains **only static files** - no admin interface, no API endpoints, and no server-side functionality.

## Deployment Platforms

### Vercel (Recommended)

Vercel offers excellent integration with Astro and automatic deployments from Git.

#### Automatic Deployment

1. **Push to GitHub/GitLab/Bitbucket**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel automatically detects Astro and configures build settings

3. **Build Configuration** (automatic):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Custom Domain

1. Add domain in Vercel dashboard
2. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

### Netlify

Netlify provides continuous deployment and excellent performance features.

#### Automatic Deployment

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables** (if needed):
   ```
   NODE_VERSION=18
   ```

#### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Netlify Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404

[build.environment]
  NODE_VERSION = "18"

# Headers for security and performance
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### GitHub Pages

Deploy directly from your GitHub repository.

#### Setup GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build site
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

#### Configure Astro for GitHub Pages

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/your-repo-name', // Only if not using custom domain
  // ... other config
});
```

### Cloudflare Pages

Fast global deployment with Cloudflare's edge network.

#### Automatic Deployment

1. **Connect Repository**:
   - Go to Cloudflare Pages dashboard
   - Click "Create a project"
   - Connect your Git repository

2. **Build Configuration**:
   ```
   Framework preset: Astro
   Build command: npm run build
   Build output directory: dist
   ```

#### Manual Deployment

```bash
# Install Wrangler CLI
npm install -g wrangler

# Build and deploy
npm run build
wrangler pages publish dist
```

### AWS S3 + CloudFront

For enterprise deployments with AWS infrastructure.

#### S3 Setup

```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-site-bucket

# Enable static website hosting
aws s3 website s3://your-site-bucket --index-document index.html --error-document 404.html

# Upload files
npm run build
aws s3 sync dist/ s3://your-site-bucket --delete
```

#### CloudFront Distribution

```json
{
  "Origins": [{
    "DomainName": "your-site-bucket.s3-website-region.amazonaws.com",
    "Id": "S3-your-site-bucket",
    "CustomOriginConfig": {
      "HTTPPort": 80,
      "OriginProtocolPolicy": "http-only"
    }
  }],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-site-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true
  }
}
```

## Environment Variables

### Development vs Production

Create environment-specific configurations:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  site: isDev ? 'http://localhost:4321' : 'https://yourdomain.com',
  // ... other config
});
```

### Secure Environment Variables

For sensitive data like API keys:

```bash
# .env (never commit this file)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
CONTACT_EMAIL=your-email@domain.com
```

Add to your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **GitHub**: Repository Settings → Secrets and Variables

## Performance Optimization

### Build Optimization

```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
    split: true,
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  },
});
```

### Image Optimization

Ensure images are optimized for production:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Hero"
  width={1200}
  height={600}
  format="webp"
  quality={80}
  loading="eager"
/>
```

### CDN Configuration

Configure caching headers for static assets:

```
# .htaccess (for Apache)
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>
```

## SEO and Analytics

### Meta Tags and Structured Data

Ensure proper SEO configuration:

```astro
---
// BaseLayout.astro
const { title, description, image } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:url" content={canonicalURL} />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</head>
```

### Analytics Integration

Add analytics to your site:

```astro
---
// BaseLayout.astro
const GA_TRACKING_ID = import.meta.env.PUBLIC_GA_TRACKING_ID;
---

{GA_TRACKING_ID && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
    <script is:inline define:vars={{ GA_TRACKING_ID }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA_TRACKING_ID);
    </script>
  </>
)}
```

## Security Considerations

### Content Security Policy

Add security headers:

```html
<!-- In BaseLayout.astro -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.supabase.co;
">
```

### HTTPS Configuration

Ensure HTTPS is enforced:

```javascript
// For custom servers
if (process.env.NODE_ENV === 'production' && !request.secure) {
  return redirect(`https://${request.headers.host}${request.url}`);
}
```

## Monitoring and Maintenance

### Health Checks

Create a health check endpoint:

```astro
---
// src/pages/health.json.ts
export async function GET() {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
---
```

### Error Tracking

Integrate error tracking:

```javascript
// In your components
try {
  // Your code
} catch (error) {
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error);
  }
  console.error('Error:', error);
}
```

## Troubleshooting Deployment Issues

### Common Build Errors

1. **Node Version Mismatch**:
   ```bash
   # Specify Node version
   echo "18" > .nvmrc
   ```

2. **Missing Environment Variables**:
   ```bash
   # Check required variables
   echo "Required: SUPABASE_URL, SUPABASE_ANON_KEY"
   ```

3. **Import Path Issues**:
   ```javascript
   // Use relative imports
   import Component from '../components/Component.astro';
   ```

### Performance Issues

1. **Large Bundle Size**:
   ```bash
   # Analyze bundle
   npm run build -- --analyze
   ```

2. **Slow Build Times**:
   ```javascript
   // Optimize Vite config
   export default defineConfig({
     vite: {
       build: {
         target: 'es2020'
       }
     }
   });
   ```

### Debugging Deployment

1. **Check Build Logs**: Review platform-specific build logs
2. **Test Locally**: Always test with `npm run build && npm run preview`
3. **Validate URLs**: Ensure all internal links work correctly
4. **Check Assets**: Verify all images and fonts load properly

## Admin Interface Considerations

### Development Workflow
When working with the admin interface during development:

1. **Content Creation**: Use the admin interface at `http://localhost:4321/admin` to create and edit content
2. **File Management**: Upload and organize media files through the admin file manager
3. **Schema Validation**: Leverage real-time validation and form generation
4. **Preview Changes**: Use the integrated preview functionality

### Pre-Deployment Steps
Before deploying to production:

1. **Content Review**: Ensure all content is finalized using the admin interface
2. **Media Optimization**: Verify all uploaded images are optimized
3. **Schema Compliance**: Check that all content follows the defined schemas
4. **Link Validation**: Test all internal and external links

### Production Deployment
Remember that in production:

- **No Admin Access**: The admin interface is completely excluded from the build
- **Static Content Only**: All content becomes static HTML files
- **File System Changes**: Content updates require rebuilding and redeploying
- **Version Control**: All content changes should be committed to version control

## Deployment Checklist

### Pre-Build Checklist
- [ ] All content created and reviewed via admin interface
- [ ] Media files uploaded and optimized
- [ ] Schema validation passes for all content
- [ ] Internal links tested and working

### Build and Deploy Checklist
- [ ] Build passes locally (`npm run build`)
- [ ] Admin interface excluded from build (verify no `/admin` routes in `dist/`)
- [ ] All environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled and enforced
- [ ] Analytics and monitoring set up
- [ ] Error tracking configured
- [ ] Performance optimizations applied
- [ ] SEO meta tags configured
- [ ] Security headers implemented
- [ ] Backup and recovery plan in place

### Post-Deploy Verification
- [ ] Site loads correctly at production URL
- [ ] All pages render properly
- [ ] Images and assets load correctly
- [ ] No admin routes accessible (should return 404)
- [ ] Contact forms work (if applicable)
- [ ] Performance metrics meet targets

## Continuous Integration

### GitHub Actions Example

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```