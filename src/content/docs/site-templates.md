---
title: Site Templates
description: Pre-configured site templates for different use cases and content strategies
group: Configuration
order: 8
---

# Site Templates

Antler CMS provides pre-configured site templates that allow you to quickly set up your site with different content types, navigation structures, and optimized configurations for specific use cases.

## Template System Overview

Site templates are pre-defined configurations that include:
- **Content type settings** - Which collections are enabled/disabled
- **Navigation structure** - Optimized menu layouts
- **Theme preferences** - Recommended color schemes
- **SEO settings** - Tailored meta configurations
- **Feature toggles** - Relevant functionality for each use case

## Available Templates

### Blog-Only Template

**Use Case**: Content creators focused on blogging and articles

**Features**:
- Optimized for content creation and reading experience
- Minimal navigation for focused user experience
- Enhanced blog features and SEO
- Comment system integration ready

**Configuration**:
```json
{
  "template": "blog-only",
  "siteMode": "blog",
  "contentTypes": {
    "blog": { 
      "enabled": true,
      "settings": {
        "postsPerPage": 10,
        "showExcerpts": true,
        "enableComments": true,
        "showReadingTime": true
      }
    },
    "projects": { "enabled": false },
    "docs": { "enabled": false },
    "resume": { "enabled": false }
  },
  "navigation": {
    "main": [
      { "name": "Home", "href": "/" },
      { "name": "Blog", "href": "/blog" },
      { "name": "Categories", "href": "/blog/categories" },
      { "name": "About", "href": "/about" },
      { "name": "Contact", "href": "/contact" }
    ]
  },
  "theme": {
    "defaultTheme": "blue",
    "allowUserThemeSelection": true
  }
}
```

### Portfolio Template

**Use Case**: Designers, developers, and creatives showcasing their work

**Features**:
- Project showcase with rich media support
- Professional presentation layouts
- Client testimonials and case studies
- Contact form integration

**Configuration**:
```json
{
  "template": "portfolio",
  "siteMode": "portfolio",
  "contentTypes": {
    "projects": { 
      "enabled": true,
      "settings": {
        "projectsPerPage": 12,
        "showTechnologies": true,
        "enableFiltering": true
      }
    },
    "blog": { 
      "enabled": true,
      "settings": {
        "postsPerPage": 6,
        "showExcerpts": true
      }
    },
    "docs": { "enabled": false },
    "resume": { "enabled": false }
  },
  "navigation": {
    "main": [
      { "name": "Home", "href": "/" },
      { "name": "Projects", "href": "/projects" },
      { "name": "Blog", "href": "/blog" },
      { "name": "About", "href": "/about" },
      { "name": "Contact", "href": "/contact" }
    ]
  },
  "theme": {
    "defaultTheme": "indigo",
    "allowUserThemeSelection": true
  }
}
```

### Documentation Template

**Use Case**: Technical documentation, API references, and knowledge bases

**Features**:
- Hierarchical documentation structure
- Search functionality
- Code syntax highlighting
- Version control integration

**Configuration**:
```json
{
  "template": "documentation",
  "siteMode": "docs",
  "contentTypes": {
    "docs": { 
      "enabled": true,
      "settings": {
        "enableSearch": true,
        "showTableOfContents": true,
        "enableVersioning": false
      }
    },
    "blog": { "enabled": false },
    "projects": { "enabled": false },
    "resume": { "enabled": false }
  },
  "navigation": {
    "main": [
      { "name": "Home", "href": "/" },
      { "name": "Documentation", "href": "/docs" },
      { "name": "API Reference", "href": "/docs/api" },
      { "name": "Examples", "href": "/docs/examples" }
    ]
  },
  "theme": {
    "defaultTheme": "slate",
    "allowUserThemeSelection": false
  }
}
```

### Full-Featured Template

**Use Case**: Comprehensive sites with multiple content types and features

**Features**:
- All content types enabled
- Complete navigation structure
- Advanced customization options
- Full admin interface access

**Configuration**:
```json
{
  "template": "full-featured",
  "siteMode": "full",
  "contentTypes": {
    "blog": { 
      "enabled": true,
      "settings": {
        "postsPerPage": 10,
        "showExcerpts": true,
        "enableComments": false
      }
    },
    "projects": { 
      "enabled": true,
      "settings": {
        "projectsPerPage": 12,
        "showTechnologies": true
      }
    },
    "docs": { 
      "enabled": true,
      "settings": {
        "enableSearch": true,
        "showTableOfContents": true
      }
    },
    "resume": { 
      "enabled": true,
      "settings": {
        "enablePDFExport": true,
        "showContactInfo": true
      }
    }
  },
  "navigation": {
    "main": [
      { "name": "Home", "href": "/" },
      { "name": "Blog", "href": "/blog" },
      { "name": "Projects", "href": "/projects" },
      { "name": "Documentation", "href": "/docs" },
      { "name": "Resume", "href": "/resume" },
      { "name": "About", "href": "/about" }
    ]
  }
}
```

## Template Application

### Using the Admin Interface

1. **Access Template Manager**
   - Navigate to `/admin/config/`
   - Click on the "Site Templates" tab
   - Browse available templates

2. **Preview Templates**
   - View template descriptions and features
   - See enabled content types for each template
   - Compare navigation structures

3. **Apply Template**
   - Select desired template
   - Choose application options:
     - **Full application** - Replace entire configuration
     - **Selective application** - Choose specific sections
     - **Merge with existing** - Combine with current settings
   - Confirm application with automatic backup

### Using the API

Apply templates programmatically using the configuration API:

```javascript
// Apply a template
const response = await fetch('/api/config/templates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    templateId: 'portfolio',
    backup: true,
    selective: false
  })
});

const result = await response.json();
```

### Command Line Application

For development workflows, templates can be applied via configuration files:

```bash
# Copy template configuration
cp templates/portfolio.json site.config.json

# Restart development server to apply changes
npm run dev
```

## Template Customization

### Modifying Existing Templates

Templates can be customized after application:

1. **Content Type Adjustments**
   - Enable/disable additional content types
   - Modify content type settings
   - Adjust pagination and display options

2. **Navigation Customization**
   - Add/remove navigation items
   - Reorganize menu structure
   - Add external links

3. **Theme Modifications**
   - Change default theme
   - Adjust theme selection options
   - Customize color preferences

### Creating Custom Templates

Define your own templates by creating configuration objects:

```typescript
// custom-template.ts
export const CUSTOM_TEMPLATE: SiteTemplate = {
  id: 'custom-business',
  name: 'Business Site',
  description: 'Professional business website template',
  siteMode: 'business',
  contentTypes: [
    {
      id: 'services',
      name: 'Services',
      enabled: true,
      route: '/services',
      settings: {
        servicesPerPage: 6,
        showPricing: true
      }
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      enabled: true,
      route: '/testimonials'
    }
  ],
  navigation: {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' }
    ]
  },
  theme: {
    defaultTheme: 'blue',
    allowUserThemeSelection: false
  }
};
```

## Template Migration

### Upgrading Between Templates

When switching templates, the system provides migration assistance:

1. **Backup Creation**
   - Automatic backup before template application
   - Named backups for easy identification
   - Configuration history tracking

2. **Content Preservation**
   - Existing content remains intact
   - Content types are enabled/disabled as needed
   - No data loss during template changes

3. **Validation and Testing**
   - Configuration validation after application
   - Link checking for navigation changes
   - Theme compatibility verification

### Rollback Options

If template application doesn't meet expectations:

1. **Automatic Rollback**
   - Restore from automatic backup
   - One-click restoration process
   - Preserve any manual changes made after application

2. **Selective Restoration**
   - Restore specific configuration sections
   - Keep desired changes from new template
   - Merge configurations intelligently

## Best Practices

### Template Selection

1. **Assess Your Needs**
   - Identify primary content types
   - Consider user experience goals
   - Evaluate maintenance requirements

2. **Start Simple**
   - Begin with focused templates
   - Add complexity as needed
   - Avoid feature overload

3. **Consider Your Audience**
   - Match template to user expectations
   - Optimize for primary use cases
   - Ensure accessibility and performance

### Template Management

1. **Regular Backups**
   - Create backups before major changes
   - Document configuration decisions
   - Test changes in development first

2. **Version Control**
   - Track configuration changes
   - Use meaningful commit messages
   - Maintain configuration documentation

3. **Performance Monitoring**
   - Monitor site performance after template changes
   - Optimize based on actual usage patterns
   - Regular performance audits

## Troubleshooting

### Common Issues

#### Template Not Applying
- Verify template exists in available templates
- Check for configuration validation errors
- Ensure proper permissions for file modifications

#### Missing Content After Template Change
- Content is preserved but may be hidden
- Check content type enabled status
- Verify navigation includes relevant sections

#### Theme Conflicts
- Some templates have theme restrictions
- Clear browser cache after theme changes
- Verify theme compatibility with template

### Recovery Methods

1. **Configuration Restoration**
   - Use automatic backups for quick recovery
   - Access backup history in admin interface
   - Manual configuration file restoration

2. **Partial Recovery**
   - Restore specific configuration sections
   - Merge backup with current configuration
   - Selective content type restoration

## Next Steps

- Learn about [Site Configuration](./configuration.md) for detailed customization
- Explore the [Admin Interface](./admin-interface.md) for visual template management
- Check [Advanced Features](./advanced-features.md) for custom template creation
- Review the [API Reference](./api-reference.md) for programmatic template management

Site templates provide a powerful foundation for quickly establishing your site's structure and functionality while maintaining the flexibility to customize and evolve your configuration over time.