---
title: "Contact Form Setup"
description: "Complete guide to setting up and configuring the serverless contact form functionality"
group: "Configuration"
order: 5
---
description: "Learn how to configure and deploy the serverless contact form functionality in Antler. The contact form supports both serverless deployments (Cloudflare Pages) and static deployments (GitHub Pages) with third-party form services."

## How It Works

The Antler contact form system is designed to work across different deployment platforms:

### Serverless Deployment (Cloudflare Pages - Recommended)
- Uses a Cloudflare Pages Function (`functions/contact.js`) to handle form submissions
- Supports multiple email services (Resend, SendGrid)
- Provides server-side validation and spam protection
- No external dependencies required

### Static Deployment (GitHub Pages)
- Falls back to third-party form services (Formspree, EmailJS)
- Client-side form handling with external API integration
- Requires additional service configuration

## Quick Setup

### 1. Environment Variables

Create a `.env` file in your project root based on `.env.example`:

```bash
# Copy the example file
cp .env.example .env
```

Configure your preferred email service:

**For Resend (Recommended):**
```env
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=contact@yourdomain.com
DEPLOYMENT_TARGET=cloudflare
```

**For SendGrid:**
```env
SENDGRID_API_KEY=SG.your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=contact@yourdomain.com
DEPLOYMENT_TARGET=cloudflare
```

### 2. Email Service Setup

#### Resend Setup (Recommended)

1. **Create Account**: Visit [Resend](https://resend.com) and create an account
2. **Get API Key**: 
   - Go to your [Resend Dashboard](https://resend.com/api-keys)
   - Click "Create API Key"
   - Copy the key to your `.env` file as `RESEND_API_KEY`
3. **Domain Verification**: 
   - Add your domain in [Resend Domains](https://resend.com/domains)
   - Follow DNS verification steps
   - Use a verified domain for `FROM_EMAIL`

#### SendGrid Setup

1. **Create Account**: Visit [SendGrid](https://sendgrid.com) and create an account
2. **Get API Key**:
   - Go to Settings > [API Keys](https://app.sendgrid.com/settings/api_keys)
   - Click "Create API Key"
   - Choose "Restricted Access" and enable "Mail Send" permissions
   - Copy the key to your `.env` file as `SENDGRID_API_KEY`
3. **Sender Authentication**:
   - Go to Settings > [Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
   - Verify your sender email or domain

## Deployment Instructions

### Cloudflare Pages (Recommended)

Cloudflare Pages provides the best experience with built-in serverless functions support.

#### Step 1: Prepare Repository
```bash
# Ensure your code is committed
git add .
git commit -m "Add contact form functionality"
git push origin main
```

#### Step 2: Create Cloudflare Pages Project
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** > **Create a project**
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)

#### Step 3: Configure Environment Variables
In your Cloudflare Pages project settings:
1. Go to **Settings** > **Environment variables**
2. Add your email service variables:
   ```
   RESEND_API_KEY = your_resend_api_key
   FROM_EMAIL = noreply@yourdomain.com
   TO_EMAIL = contact@yourdomain.com
   DEPLOYMENT_TARGET = cloudflare
   ```

#### Step 4: Deploy
- Cloudflare will automatically deploy your site
- The contact form will be available at `https://your-site.pages.dev/contact`

### GitHub Pages

For GitHub Pages deployment, the contact form uses third-party services since serverless functions aren't supported.

#### Step 1: Configure Form Service

**Option A: Formspree (Recommended for GitHub Pages)**
1. Visit [Formspree](https://formspree.io) and create an account
2. Create a new form and get your form endpoint
3. Update `ContactForm.tsx` to use your Formspree endpoint:
   ```typescript
   // Uncomment and update this line in ContactForm.tsx
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```

**Option B: EmailJS**
1. Visit [EmailJS](https://www.emailjs.com) and create an account
2. Set up an email service and template
3. Get your Service ID, Template ID, and Public Key
4. Add to your environment variables:
   ```env
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   EMAILJS_PUBLIC_KEY=your_public_key
   ```

#### Step 2: GitHub Pages Setup
1. Go to your repository **Settings** > **Pages**
2. Choose **GitHub Actions** as the source
3. The included workflow (`.github/workflows/deploy.yml`) will handle deployment

## Testing

### Local Testing
```bash
# Start development server
npm run dev

# Test the contact form at http://localhost:4321/contact
```

### Production Testing
1. **Cloudflare Pages**: Test at your deployed URL
2. **GitHub Pages**: Test at `https://yourusername.github.io/repository-name/contact`

## Troubleshooting

### Contact Form Not Working

**Check Console Errors:**
- Open browser developer tools
- Look for JavaScript errors in the console
- Check network tab for failed requests

**Verify Environment Variables:**
- Ensure all required variables are set
- Check variable names match exactly
- Verify API keys are valid and not expired

### Email Not Sending

**For Resend:**
- Verify domain is properly configured and verified
- Check API key has correct permissions
- Ensure `FROM_EMAIL` uses verified domain

**For SendGrid:**
- Verify sender authentication is complete
- Check API key has "Mail Send" permissions
- Ensure sender email is verified

**For Third-party Services:**
- Verify service configuration (Formspree/EmailJS)
- Check service quotas and limits
- Ensure correct endpoint URLs

### Build Failures

**Missing Dependencies:**
```bash
# Reinstall dependencies
npm install
```

**Environment Variables:**
- Ensure `.env.example` exists for reference
- Don't commit actual `.env` file to repository
- Set environment variables in deployment platform

## Advanced Configuration

### Custom Email Templates

The serverless function supports custom email templates. Modify `functions/contact.js`:

```javascript
// Customize email content
const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #f4f4f4; padding: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    </div>
</body>
</html>
`;
```

### Spam Protection

Add additional validation in `functions/contact.js`:

```javascript
// Add honeypot field check
if (formData.get('website')) {
    return new Response('Spam detected', { status: 400 });
}

// Add rate limiting (requires additional setup)
// Implement IP-based rate limiting logic
```

## External Documentation

### Email Services
- **Resend Documentation**: [https://resend.com/docs](https://resend.com/docs)
- **SendGrid Documentation**: [https://docs.sendgrid.com](https://docs.sendgrid.com)

### Form Services
- **Formspree Documentation**: [https://help.formspree.io](https://help.formspree.io)
- **EmailJS Documentation**: [https://www.emailjs.com/docs](https://www.emailjs.com/docs)

### Deployment Platforms
- **Cloudflare Pages**: [https://developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **GitHub Pages**: [https://docs.github.com/en/pages](https://docs.github.com/en/pages)

### Development
- **Astro Documentation**: [https://docs.astro.build](https://docs.astro.build)
- **React Documentation**: [https://react.dev](https://react.dev)

## Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting) above
2. Review the external documentation links
3. Ensure all environment variables are correctly configured
4. Test with a minimal configuration first
5. Check service status pages for any outages

The contact form system is designed to be flexible and work across different deployment scenarios. Choose the setup that best fits your hosting requirements and technical preferences.