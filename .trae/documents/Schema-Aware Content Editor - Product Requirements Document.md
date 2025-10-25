# Schema-Aware Content Editor - Product Requirements Document

## 1. Product Overview

A development-only visual content management interface that automatically generates form-based editors from existing Astro content schemas, eliminating YAML frontmatter errors and providing a "headless CMS" experience without production complexity.

The Schema-Aware Content Editor solves the biggest pain point of flat-file static site generators: remembering exact YAML frontmatter keys and formats. It provides content creators with a safe, intuitive interface while maintaining the full power and flexibility of the file-based system.

This feature positions Antler as the most developer-friendly static site generator with enterprise-level content management capabilities, bridging the gap between technical flexibility and user experience.

## 2. Core Features

### 2.1 User Roles

| Role | Access Method | Core Permissions |
|------|---------------|------------------|
| Developer | Local development server access | Full access to all content types, schema management, and file operations |
| Content Creator | Local development server access | Create, edit, and manage content within defined schemas |

### 2.2 Feature Module

Our Schema-Aware Content Editor consists of the following main pages:

1. **Admin Dashboard**: Content overview, quick actions, recent edits, and schema status indicators.
2. **Content List Pages**: Filterable lists for each content type (blog posts, projects, docs) with search and sorting capabilities.
3. **Content Editor Pages**: Dynamic form-based editors that adapt to each content type's schema with real-time validation.
4. **Schema Inspector**: Visual representation of content schemas with field types, validation rules, and relationships.
5. **File Manager**: Image upload, organization, and selection interface integrated with content editing.

### 2.3 Page Details

| Page Name | Module Name | Feature description |
|-----------|-------------|---------------------|
| Admin Dashboard | Overview Panel | Display content statistics, recent edits, schema validation status, and quick access buttons |
| Admin Dashboard | Quick Actions | Create new content buttons for each type, bulk operations, and schema refresh |
| Content List | Blog Posts List | Paginated list with title, date, tags, status filters, search functionality, and bulk actions |
| Content List | Projects List | Grid/list view toggle, technology filters, featured status, and project status indicators |
| Content List | Docs List | Hierarchical view by groups, order management, and completion status tracking |
| Content Editor | Dynamic Form Generator | Auto-generate form fields based on Zod schema definitions with appropriate input types |
| Content Editor | Field Validation | Real-time validation using existing Zod schemas with error highlighting and suggestions |
| Content Editor | Rich Text Editor | Markdown editor with preview, syntax highlighting, and content assistance |
| Content Editor | Relationship Manager | Multi-select dropdowns for content relationships with search and preview capabilities |
| Content Editor | Image Upload | Drag-and-drop file upload with automatic optimization and path management |
| Content Editor | Section Manager | Visual drag-and-drop interface for reordering page sections and components |
| Schema Inspector | Schema Visualization | Interactive display of content schemas with field types and validation rules |
| Schema Inspector | Relationship Mapping | Visual representation of content relationships and dependencies |
| File Manager | Image Gallery | Organized view of uploaded images with metadata and usage tracking |
| File Manager | File Operations | Upload, delete, rename, and organize media files with automatic path updates |

## 3. Core Process

### Developer Flow
1. Start local development server (`npm run dev`)
2. Navigate to `http://localhost:4321/__admin` to access the content editor
3. View dashboard with content overview and schema status
4. Select content type to manage (blog, projects, docs)
5. Create new content or edit existing content using dynamic forms
6. Save changes directly to markdown files with proper YAML frontmatter
7. Continue development with updated content files

### Content Creator Flow
1. Access admin interface through local development server
2. Browse existing content through organized list views
3. Create new content using schema-driven forms with validation
4. Upload and manage images through integrated file manager
5. Use rich markdown editor for content creation
6. Preview content changes in real-time
7. Save content with automatic file generation and proper formatting

```mermaid
graph TD
  A[Local Dev Server] --> B[/__admin Dashboard]
  B --> C[Content Type Selection]
  C --> D[Blog Posts List]
  C --> E[Projects List]
  C --> F[Docs List]
  D --> G[Blog Editor]
  E --> H[Project Editor]
  F --> I[Doc Editor]
  G --> J[Save to .md File]
  H --> J
  I --> J
  J --> K[File System Update]
  K --> L[Astro Hot Reload]
  
  B --> M[Schema Inspector]
  B --> N[File Manager]
  N --> O[Image Upload]
  O --> P[Auto Path Update]
```

## 4. User Interface Design

### 4.1 Design Style

- **Primary Colors**: Deep blue (#1e40af) for primary actions, light blue (#3b82f6) for secondary elements
- **Secondary Colors**: Gray scale (#f8fafc to #1e293b) for backgrounds and text, green (#10b981) for success states, red (#ef4444) for errors
- **Button Style**: Rounded corners (8px), subtle shadows, hover animations with color transitions
- **Font**: Inter for UI elements (14px base), JetBrains Mono for code/schema display (13px)
- **Layout Style**: Clean dashboard layout with sidebar navigation, card-based content organization, and modal overlays for editing
- **Icons**: Lucide React icons for consistency, custom icons for content types and schema elements

### 4.2 Page Design Overview

| Page Name | Module Name | UI Elements |
|-----------|-------------|-------------|
| Admin Dashboard | Overview Panel | Card-based layout with content statistics, recent activity feed, and status indicators using blue/gray color scheme |
| Admin Dashboard | Quick Actions | Prominent action buttons with icons, floating action button for quick content creation, breadcrumb navigation |
| Content List | List Views | Data table with sortable columns, filter sidebar, search bar with autocomplete, pagination controls |
| Content List | Grid Views | Card-based grid layout for projects, hover effects with preview information, responsive breakpoints |
| Content Editor | Form Interface | Two-column layout with form fields on left, live preview on right, sticky save/cancel buttons |
| Content Editor | Field Components | Custom input components for each schema type: date pickers, tag inputs, file uploaders, rich text editors |
| Content Editor | Validation UI | Inline error messages, field highlighting, validation summary panel, success confirmations |
| Schema Inspector | Schema Display | Tree view of schema structure, expandable field details, type indicators with color coding |
| File Manager | Gallery View | Grid layout with image thumbnails, metadata overlay on hover, drag-and-drop upload zones |

### 4.3 Responsiveness

The admin interface is desktop-first with tablet adaptation for content editing workflows. Mobile responsiveness is limited as this is a development tool primarily used on desktop environments. Touch interactions are optimized for tablet use during content review and light editing tasks.

Key responsive breakpoints:
- Desktop: 1024px+ (primary experience)
- Tablet: 768px-1023px (adapted layout with collapsible sidebar)
- Mobile: <768px (basic functionality only, primarily for content preview)