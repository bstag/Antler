---
title: "Admin Interface Overview"
description: "Complete guide to the Antler admin interface - navigation, features, and workflow"
group: "Admin Interface"
order: 1
---
The Antler admin interface is a powerful, user-friendly content management system that runs alongside your static site during development. It provides a complete solution for creating, editing, and managing all your content without needing to work directly with Markdown files.

## Accessing the Admin Interface

### Development Mode Only
The admin interface is **only available during development** and is automatically excluded from production builds. This ensures your deployed site remains fast and secure as a pure static site.

**Access URL**: http://localhost:4321/admin

### Prerequisites
- Development server must be running (`npm run dev`)
- Node.js environment with all dependencies installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Interface Layout

### Main Navigation Structure

The admin interface uses a clean, modern layout with the following main areas:

#### 1. Sidebar Navigation
- **Collapsible sidebar** with toggle button
- **Logo and branding** (Antler Admin Panel)
- **Theme toggle** for dark/light mode switching
- **Navigation sections**:
  - Dashboard (home)
  - Content collections (Blog, Projects, Docs)
  - File Manager
  - Resume Manager (separate section)

#### 2. Header Bar
- **Page title** and context information
- **"Development Only" badge** reminder
- **View Site button** - opens public site in new tab
- **Breadcrumb navigation** for current location

#### 3. Main Content Area
- **Responsive layout** adapting to screen size
- **Scrollable content** with custom scrollbars
- **Context-sensitive content** based on current page

## Core Features

### Dashboard Overview
The dashboard provides a comprehensive overview of your content:

- **Welcome section** with quick action buttons
- **Content statistics** for each collection
- **Recent activity** and content counts
- **Featured content** indicators
- **System information** panel

### Content Collections
Each content type (Blog, Projects, Docs) has its own dedicated section:

- **List view** with search and filtering
- **Grid/table toggle** for different viewing modes
- **Bulk actions** for managing multiple items
- **Quick preview** and editing options
- **Status indicators** (published, draft, featured)

### Specialized Areas

#### Resume Manager
- **Separate interface** for resume-related content
- **Organized sections** (Personal, Experience, Education, Skills, etc.)
- **Integrated workflow** for building complete resumes
- **Cross-referencing** between resume sections

#### File Manager
- **Visual file browser** with thumbnail previews
- **Drag-and-drop upload** functionality
- **File organization** with folders and categories
- **Image optimization** and processing
- **Direct integration** with content editors

## Navigation Patterns

### Primary Navigation
1. **Dashboard** (`/admin/`) - Main overview and statistics
2. **Content Collections** (`/admin/content/{collection}`) - List and manage content
3. **Content Editor** (`/admin/content/{collection}/new` or `/{id}`) - Create/edit content
4. **File Manager** (`/admin/files`) - Manage media and assets
5. **Resume Manager** (`/admin/resume/`) - Specialized resume content

### Secondary Navigation
- **Breadcrumbs** in header for current location
- **Back buttons** in editors and detail views
- **Quick actions** in list views
- **Context menus** for item-specific actions

## User Interface Elements

### Design System
- **Modern, clean aesthetic** with consistent spacing
- **Dark/light theme support** with system preference detection
- **Responsive design** working on desktop, tablet, and mobile
- **Accessibility features** with proper ARIA labels and keyboard navigation

### Interactive Elements
- **Hover states** for all clickable elements
- **Loading indicators** for async operations
- **Success/error notifications** for user feedback
- **Confirmation dialogs** for destructive actions

### Visual Indicators
- **Status badges** (Development Only, Featured, etc.)
- **Collection icons** for easy identification
- **Progress indicators** for multi-step processes
- **Validation states** in forms and editors

## Workflow Integration

### Content Creation Workflow
1. **Navigate to collection** (Blog, Projects, Docs)
2. **Click "New" button** to create content
3. **Fill schema-aware form** with validation
4. **Write content** in markdown editor with live preview
5. **Upload media** through integrated file manager
6. **Save and publish** with immediate feedback

### Content Management Workflow
1. **Browse content lists** with search and filtering
2. **Preview content** without leaving the list view
3. **Edit existing content** with full context preservation
4. **Manage media assets** with visual file browser
5. **Organize content** with tags, categories, and metadata

## Performance Features

### Optimized Loading
- **Lazy loading** for content lists and images
- **Efficient caching** of schema definitions and content
- **Progressive enhancement** for better perceived performance
- **Minimal JavaScript** footprint for fast initial load

### Real-time Updates
- **Live preview** in markdown editor
- **Instant validation** feedback in forms
- **Auto-save functionality** to prevent data loss
- **Hot reloading** integration with development server

## Security Considerations

### Development-Only Access
- **No production exposure** - admin interface excluded from builds
- **Local development only** - no remote access by default
- **Session-based** - no persistent authentication needed
- **File system access** - direct integration with local content files

### Data Protection
- **Local file storage** - all content remains on your machine
- **No external dependencies** for core functionality
- **Version control friendly** - all changes are file-based
- **Backup integration** - works with your existing backup strategy

## Browser Compatibility

### Supported Browsers
- **Chrome/Chromium** 90+ (recommended)
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Required Features
- **ES2020 support** for modern JavaScript features
- **CSS Grid and Flexbox** for layout
- **Fetch API** for network requests
- **Local Storage** for preferences and state

## Troubleshooting

### Common Issues

#### Admin Interface Not Loading
- Verify development server is running
- Check console for JavaScript errors
- Ensure all dependencies are installed
- Try refreshing the page or clearing browser cache

#### Content Not Saving
- Check file permissions in content directories
- Verify schema validation is passing
- Look for network errors in browser dev tools
- Ensure content directory structure is correct

#### File Upload Issues
- Check available disk space
- Verify file permissions in public/images directory
- Ensure file types are supported
- Check for file size limitations

### Getting Help
- Check browser console for error messages
- Review network tab for failed requests
- Verify file system permissions
- Consult the API reference for endpoint details

## Next Steps

- Learn about [Content Management](./admin-content-management) features
- Explore [File Management](./admin-file-management) capabilities
- Review [API Reference](./admin-api-reference) for advanced usage
- Understand [Deployment](./deployment) differences between development and production