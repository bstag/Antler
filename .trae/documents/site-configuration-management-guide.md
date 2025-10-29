# Antler CMS Site Configuration Management - Complete Guide

## Overview

Antler CMS provides a comprehensive site configuration system that allows you to customize your site's behavior, appearance, and content structure through both the admin interface and configuration files. The system supports multiple configuration levels and templates for different site types.

## Configuration Architecture

### Configuration Levels

1. **Default Configuration** - Base settings defined in code
2. **Site Templates** - Pre-configured setups for different site types
3. **Site Configuration** - Custom settings in `site.config.json`
4. **Runtime Configuration** - Dynamic settings managed through admin interface

### Configuration Files

#### Primary Configuration (`site.config.json`)
Located in the project root, this file contains your site's main configuration:

```json
{
  "site": {
    "title": "Your Site Title",
    "description": "Site description",
    "url": "https://yoursite.com",
    "author": "Your Name"
  },
  "theme": {
    "defaultTheme": "blue",
    "allowUserThemeSelection": true
  },
  "navigation": {
    "main": [
      { "name": "Home", "href": "/" },
      { "name": "Blog", "href": "/blog" },
      { "name": "Projects", "href": "/projects" }
    ]
  },
  "contentTypes": {
    "blog": { "enabled": true },
    "projects": { "enabled": true },
    "docs": { "enabled": true }
  }
}
```

#### Default Configuration (`src/lib/config/defaults.ts`)
Provides fallback values and defines available options:

```typescript
export const DEFAULT_SITE_CONFIG = {
  site: {
    title: 'Antler CMS',
    description: 'A modern static site generator',
    url: 'http://localhost:4321',
    author: 'Antler CMS'
  },
  theme: {
    defaultTheme: 'blue',
    allowUserThemeSelection: true
  },
  contentTypes: {
    blog: { enabled: true },
    projects: { enabled: true },
    docs: { enabled: true },
    resume: { enabled: false }
  }
}
```

## Site Configuration Options

### Basic Site Settings

#### Site Information
- `site.title` - Site title displayed in header and meta tags
- `site.description` - Site description for SEO and meta tags
- `site.url` - Canonical site URL for absolute links
- `site.author` - Default author for content and meta tags
- `site.logo` - Site logo URL or path
- `site.favicon` - Favicon URL or path

#### SEO and Meta Settings
- `seo.defaultImage` - Default social sharing image
- `seo.twitterHandle` - Twitter handle for Twitter Cards
- `seo.googleAnalytics` - Google Analytics tracking ID
- `seo.googleSiteVerification` - Google Search Console verification
- `seo.robots` - Default robots meta tag content

### Theme Configuration

#### Theme Settings
- `theme.defaultTheme` - Default color theme for new visitors
- `theme.allowUserThemeSelection` - Enable user theme switching
- `theme.darkModeDefault` - Default to dark mode
- `theme.systemThemeDetection` - Respect system theme preference

#### Available Themes
The system includes 16+ built-in themes:
- **Blue Family**: `blue`, `indigo`, `sky`, `cyan`
- **Green Family**: `green`, `emerald`, `teal`
- **Warm Family**: `red`, `orange`, `amber`, `yellow`
- **Purple Family**: `purple`, `violet`, `fuchsia`, `pink`
- **Neutral**: `gray`, `slate`, `stone`

### Navigation Configuration

#### Main Navigation
```json
{
  "navigation": {
    "main": [
      {
        "name": "Home",
        "href": "/",
        "external": false
      },
      {
        "name": "Blog",
        "href": "/blog",
        "external": false,
        "children": [
          { "name": "All Posts", "href": "/blog" },
          { "name": "Categories", "href": "/blog/categories" }
        ]
      }
    ]
  }
}
```

#### Footer Navigation
```json
{
  "navigation": {
    "footer": [
      {
        "title": "Content",
        "links": [
          { "name": "Blog", "href": "/blog" },
          { "name": "Projects", "href": "/projects" }
        ]
      },
      {
        "title": "Company",
        "links": [
          { "name": "About", "href": "/about" },
          { "name": "Contact", "href": "/contact" }
        ]
      }
    ]
  }
}
```

### Content Type Configuration

#### Enabling/Disabling Content Types
```json
{
  "contentTypes": {
    "blog": {
      "enabled": true,
      "slug": "blog",
      "title": "Blog",
      "description": "Latest articles and insights"
    },
    "projects": {
      "enabled": true,
      "slug": "projects",
      "title": "Projects",
      "description": "Portfolio of work"
    },
    "docs": {
      "enabled": true,
      "slug": "docs",
      "title": "Documentation",
      "description": "Technical documentation"
    },
    "resume": {
      "enabled": false,
      "slug": "resume",
      "title": "Resume",
      "description": "Professional resume"
    }
  }
}
```

#### Content Type Options
- `enabled` - Whether the content type is active
- `slug` - URL slug for the content type
- `title` - Display title for navigation and pages
- `description` - Description for SEO and page headers
- `perPage` - Number of items per page in listings
- `sortBy` - Default sorting field
- `sortOrder` - Sort direction (asc/desc)

## Site Templates

### Available Templates

#### Blog-Only Template
Optimized for blogging with minimal additional features:
```json
{
  "template": "blog-only",
  "contentTypes": {
    "blog": { "enabled": true },
    "projects": { "enabled": false },
    "docs": { "enabled": false }
  },
  "navigation": {
    "main": [
      { "name": "Home", "href": "/" },
      { "name": "Blog", "href": "/blog" },
      { "name": "About", "href": "/about" },
      { "name": "Contact", "href": "/contact" }
    ]
  }
}
```

#### Portfolio Template
Focused on showcasing projects and work:
```json
{
  "template": "portfolio",
  "contentTypes": {
    "projects": { "enabled": true },
    "blog": { "enabled": true },
    "docs": { "enabled": false }
  },
  "navigation": {
    "main": [
      { "name": "Home", "href": "/" },
      { "name": "Projects", "href": "/projects" },
      { "name": "Blog", "href": "/blog" },
      { "name": "About", "href": "/about" }
    ]
  }
}
```

#### Documentation Template
Optimized for technical documentation:
```json
{
  "template": "documentation",
  "contentTypes": {
    "docs": { "enabled": true },
    "blog": { "enabled": false },
    "projects": { "enabled": false }
  },
  "navigation": {
    "main": [
      { "name": "Home", "href": "/" },
      { "name": "Docs", "href": "/docs" },
      { "name": "API", "href": "/docs/api" }
    ]
  }
}
```

#### Full-Featured Template
Includes all content types and features:
```json
{
  "template": "full-featured",
  "contentTypes": {
    "blog": { "enabled": true },
    "projects": { "enabled": true },
    "docs": { "enabled": true },
    "resume": { "enabled": true }
  }
}
```

## Admin Interface Configuration

### Site Configuration Panel
Located at `/admin/config/`, provides:

- **Visual configuration editor** for all site settings
- **Real-time preview** of configuration changes
- **Template selection** and application
- **Validation** of configuration values
- **Export/import** of configuration files

### Configuration Management Features

#### Template Application
- **One-click template application** with confirmation
- **Backup creation** before applying templates
- **Selective template application** (choose which parts to apply)
- **Template comparison** to see differences

#### Validation and Testing
- **Real-time validation** of configuration syntax
- **URL validation** for links and references
- **Theme compatibility** checking
- **Navigation structure** validation

#### Backup and Recovery
- **Automatic backups** before major changes
- **Manual backup creation** with custom names
- **Configuration history** tracking
- **Easy restoration** from backups

## API Integration

### Configuration API Endpoints

#### Get Current Configuration
```
GET /admin/api/config
```
Returns the complete site configuration.

#### Update Configuration
```
POST /admin/api/config
Content-Type: application/json

{
  "site": {
    "title": "Updated Site Title"
  }
}
```

#### Apply Template
```
POST /admin/api/config/template
Content-Type: application/json

{
  "template": "blog-only",
  "backup": true
}
```

#### Get Available Templates
```
GET /admin/api/config/templates
```
Returns list of available site templates.

### Configuration Validation
All configuration changes are validated against schemas:
- **Required fields** validation
- **Data type** checking
- **URL format** validation
- **Theme existence** verification
- **Navigation structure** validation

## Development vs Production

### Development Mode
- **Full admin interface** access to configuration
- **Real-time configuration** changes
- **Hot reloading** of configuration updates
- **Development-specific** defaults and settings

### Production Mode
- **Static configuration** from build time
- **No runtime configuration** changes
- **Optimized configuration** loading
- **Production-specific** settings and optimizations

### Build Process Integration
- **Configuration validation** during build
- **Static generation** with current configuration
- **Asset optimization** based on configuration
- **SEO optimization** using configuration values

## Advanced Configuration

### Custom Configuration Fields
Add custom fields to your site configuration:

```json
{
  "custom": {
    "socialMedia": {
      "twitter": "@yourhandle",
      "linkedin": "yourprofile",
      "github": "yourusername"
    },
    "features": {
      "newsletter": true,
      "comments": false,
      "search": true
    }
  }
}
```

### Environment-Specific Configuration
Use environment variables for sensitive or environment-specific values:

```json
{
  "analytics": {
    "googleAnalytics": "${GOOGLE_ANALYTICS_ID}",
    "plausible": "${PLAUSIBLE_DOMAIN}"
  },
  "integrations": {
    "emailService": "${EMAIL_SERVICE_API_KEY}"
  }
}
```

### Configuration Inheritance
Configuration values follow an inheritance hierarchy:
1. **Default values** from code
2. **Template values** if template applied
3. **Site configuration** from `site.config.json`
4. **Runtime overrides** from admin interface

## Best Practices

### Configuration Management
- **Use templates** as starting points for common site types
- **Keep configuration** in version control
- **Test configuration** changes in development first
- **Create backups** before major configuration changes

### Performance Considerations
- **Minimize configuration** complexity for faster builds
- **Use static values** where possible for better performance
- **Optimize navigation** structure for user experience
- **Enable only needed** content types and features

### Security Considerations
- **Validate all inputs** in configuration
- **Use environment variables** for sensitive data
- **Restrict admin access** to configuration in production
- **Regular backups** of configuration and content

## Troubleshooting

### Common Configuration Issues

#### Configuration Not Loading
- Check `site.config.json` syntax and formatting
- Verify file permissions and accessibility
- Check for validation errors in admin interface
- Ensure required fields are present

#### Template Application Failures
- Verify template exists and is valid
- Check for configuration conflicts
- Ensure backup space is available
- Review template compatibility with current content

#### Navigation Issues
- Validate navigation structure and links
- Check for circular references in navigation
- Verify all referenced pages exist
- Test navigation on different screen sizes

### Configuration Recovery
- **Restore from backup** using admin interface
- **Reset to defaults** if configuration is corrupted
- **Manual editing** of `site.config.json` if needed
- **Template reapplication** to restore known good state

This comprehensive site configuration system provides the flexibility to customize your Antler CMS site while maintaining simplicity and reliability.