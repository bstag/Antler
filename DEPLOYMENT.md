# Deployment Guide

This guide covers deploying your Antler site to GitHub Pages and Cloudflare Pages with serverless contact form functionality.

## Overview

The site is built as a static site generator (SSG) using Astro, with a contact form that works with serverless functions on Cloudflare Pages or form services on GitHub Pages.

## Cloudflare Pages Deployment (Recommended)

Cloudflare Pages provides serverless functions that work perfectly with our contact form.

### 1. Prepare Your Repository

1. Push your code to a GitHub repository
2. Make sure the `functions/contact.js` file is included

### 2. Set Up Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** > **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

### 3. Configure Environment Variables

In your Cloudflare Pages project settings, add these environment variables:

#### For Resend (Recommended)
```
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=your-email@example.com
FROM_EMAIL=noreply@yourdomain.com
```

#### For SendGrid (Alternative)
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
CONTACT_EMAIL=your-email@example.com
FROM_EMAIL=noreply@yourdomain.com
```

### 4. Deploy

1. Click **Save and Deploy**
2. Your site will be built and deployed automatically
3. The contact form will work with the serverless function at `/functions/contact`

### 5. Set Up Email Service

#### Option A: Resend (Recommended)
1. Sign up at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Add your domain and verify it
4. Update the environment variables in Cloudflare Pages

#### Option B: SendGrid
1. Sign up at [SendGrid](https://sendgrid.com)
2. Get your API key
3. Verify your sender email
4. Update the environment variables in Cloudflare Pages

## GitHub Pages Deployment

GitHub Pages doesn't support serverless functions, so we'll use a form service.

### 1. Prepare for Static Deployment

The contact form is already configured to fall back to static mode when serverless functions aren't available.

### 2. Set Up Form Service (Choose One)

#### Option A: Formspree
1. Sign up at [Formspree](https://formspree.io)
2. Create a new form and get your form ID
3. Update `ContactForm.tsx` to uncomment and configure the Formspree section:

```typescript
// Replace YOUR_FORM_ID with your actual Formspree form ID
response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  body: formData2,
  headers: {
    'Accept': 'application/json'
  }
});
```

#### Option B: EmailJS
1. Sign up at [EmailJS](https://www.emailjs.com)
2. Set up your email service and template
3. Install EmailJS: `npm install @emailjs/browser`
4. Update the contact form to use EmailJS instead

### 3. Configure GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages**
3. Set source to **GitHub Actions**
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

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
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Testing Your Deployment

### Local Testing
1. Run `npm run build` to test the build process
2. Run `npm run preview` to test the built site locally
3. Test the contact form functionality

### Production Testing
1. Fill out the contact form on your deployed site
2. Check browser developer tools for network requests
3. Verify emails are received (for Cloudflare Pages)
4. Check form service dashboard (for GitHub Pages)

## Troubleshooting

### Contact Form Not Working
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Test email service API keys separately
4. Check CORS settings if using external form services

### Build Failures
1. Ensure all dependencies are installed
2. Check for TypeScript errors
3. Verify Astro configuration is correct
4. Check build logs for specific error messages

### Email Not Sending
1. Verify API keys are correct and active
2. Check email service quotas and limits
3. Ensure sender email is verified
4. Check spam folders for test emails

## Environment Variables Reference

### Cloudflare Pages
- `RESEND_API_KEY` - Your Resend API key
- `SENDGRID_API_KEY` - Your SendGrid API key (alternative)
- `CONTACT_EMAIL` - Email address to receive contact form submissions
- `FROM_EMAIL` - Email address to send from (must be verified with your email service)

### Local Development
Create a `.env` file (copy from `.env.example`) with your configuration for local testing.

## Security Notes

1. Never commit API keys to your repository
2. Use environment variables for all sensitive configuration
3. Verify sender domains with your email service
4. Consider rate limiting for production deployments
5. Validate and sanitize form inputs server-side

## Support

If you encounter issues:
1. Check the deployment logs
2. Test locally first
3. Verify all environment variables
4. Check email service documentation
5. Review browser console for client-side errors