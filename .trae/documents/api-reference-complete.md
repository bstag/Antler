# Antler CMS API Reference - Complete Documentation

## Overview

Antler CMS provides a comprehensive REST API for content management, configuration, and theme operations during development. All API endpoints are available only in development mode and are excluded from production builds.

## Base Configuration

- **Base URL**: `http://localhost:4321/api` (development only)
- **Content Type**: `application/json`
- **Authentication**: None required (development-only access)

## Site Configuration API

### Get Site Configuration
Retrieve the complete site configuration.

**Endpoint**: `GET /api/config/site`

**Response**:
```json
{
  "siteMode": "full",
  "contentTypes": [
    {
      "id": "blog",
      "name": "Blog",
      "enabled": true,
      "route": "/blog",
      "icon": "document-text",
      "order": 1,
      "settings": {
        "postsPerPage": 10,
        "showExcerpts": true,
        "enableComments": false
      }
    }
  ],
  "siteInfo": {
    "name": "Antler CMS",
    "description": "Modern static site generator",
    "author": "Your Name"
  },
  "customization": {
    "theme": {
      "default": "blue",
      "allowUserOverride": true,
      "availableThemes": ["blue", "indigo", "purple"]
    }
  }
}
```

### Update Site Configuration
Update site configuration with partial or complete data.

**Endpoint**: `POST /api/config/site`

**Request Body**:
```json
{
  "siteInfo": {
    "name": "My Updated Site",
    "description": "Updated description"
  },
  "customization": {
    "theme": {
      "default": "indigo"
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "config": {
    // Updated configuration object
  }
}
```

### Patch Site Configuration
Partially update specific configuration sections.

**Endpoint**: `PATCH /api/config/site`

**Request Body**:
```json
{
  "siteInfo.name": "New Site Name",
  "customization.theme.default": "purple"
}
```

## Site Templates API

### Get Available Templates
Retrieve all available site templates.

**Endpoint**: `GET /api/config/templates`

**Response**:
```json
{
  "templates": {
    "portfolio": {
      "name": "Portfolio Site",
      "description": "Showcase your work and skills",
      "siteMode": "full",
      "contentTypes": [
        {
          "id": "projects",
          "name": "Projects",
          "enabled": true,
          "route": "/projects"
        }
      ]
    },
    "blog-only": {
      "name": "Blog Site",
      "description": "Focus on content creation",
      "siteMode": "blog"
    }
  }
}
```

### Apply Site Template
Apply a predefined site template configuration.

**Endpoint**: `POST /api/config/templates`

**Request Body**:
```json
{
  "templateId": "portfolio"
}
```

**Response**:
```json
{
  "success": true,
  "template": "portfolio",
  "config": {
    // Applied configuration
  }
}
```

## Theme Management API

### Get Current Theme Configuration
Retrieve current theme settings and user preferences.

**Endpoint**: `GET /api/theme/current`

**Response**:
```json
{
  "siteDefault": "blue",
  "userPreference": null,
  "active": "blue",
  "allowUserOverride": true,
  "availableThemes": ["blue", "indigo", "purple", "green"]
}
```

### Update Site Default Theme
Change the site-wide default theme (admin only).

**Endpoint**: `POST /api/theme/set-default`

**Request Body**:
```json
{
  "theme": "indigo"
}
```

**Response**:
```json
{
  "success": true,
  "theme": "indigo",
  "message": "Site default theme updated to indigo"
}
```

**Error Response**:
```json
{
  "error": "Invalid theme: custom. Must be one of: blue, indigo, purple, ..."
}
```

### Get Theme Metadata
Retrieve metadata for all available themes.

**Endpoint**: `GET /api/theme/metadata`

**Response**:
```json
{
  "themes": [
    {
      "id": "blue",
      "name": "Professional Blue",
      "description": "Classic professional blue theme",
      "primaryColor": "#2563eb",
      "colorFamily": "blue",
      "tags": ["professional", "classic"]
    },
    {
      "id": "indigo",
      "name": "Deep Indigo",
      "description": "Sophisticated indigo theme",
      "primaryColor": "#4f46e5",
      "colorFamily": "purple",
      "tags": ["sophisticated", "modern"]
    }
  ],
  "count": 16
}
```

## Content Schema API

### Get Collection Schema
Retrieve the schema definition for a specific content collection.

**Endpoint**: `GET /admin/api/schema/{collection}`

**Parameters**:
- `collection`: Collection name (blog, projects, docs, resumePersonal, etc.)

**Response**:
```json
{
  "collection": "blog",
  "schema": {
    "title": {
      "type": "string",
      "required": true,
      "description": "Blog post title"
    },
    "description": {
      "type": "string",
      "required": true,
      "description": "Brief description"
    },
    "publicationDate": {
      "type": "date",
      "required": true,
      "description": "Publication date"
    },
    "tags": {
      "type": "array",
      "items": "string",
      "required": true,
      "description": "Post tags"
    },
    "featured": {
      "type": "boolean",
      "required": false,
      "default": false,
      "description": "Featured post"
    }
  }
}
```

### Get All Schemas
Retrieve schema definitions for all content collections.

**Endpoint**: `GET /admin/api/schema`

**Response**:
```json
{
  "schemas": {
    "blog": {
      // Blog schema definition
    },
    "projects": {
      // Projects schema definition
    },
    "docs": {
      // Documentation schema definition
    }
  }
}
```

## Content Management API

### List Content Items
Retrieve content items from a specific collection.

**Endpoint**: `GET /admin/api/content/{collection}`

**Query Parameters**:
- `limit`: Number of items to return (default: 50)
- `offset`: Number of items to skip (default: 0)
- `search`: Search term for filtering
- `featured`: Filter by featured status (true/false)

**Response**:
```json
{
  "collection": "blog",
  "items": [
    {
      "id": "my-first-post",
      "slug": "my-first-post",
      "data": {
        "title": "My First Post",
        "description": "This is my first blog post",
        "publicationDate": "2024-01-15T00:00:00.000Z",
        "tags": ["introduction", "blog"],
        "featured": true
      },
      "body": "# My First Post\n\nContent here...",
      "rendered": "<h1>My First Post</h1><p>Content here...</p>"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

### Get Single Content Item
Retrieve a specific content item by ID.

**Endpoint**: `GET /admin/api/content/{collection}/{id}`

**Response**:
```json
{
  "id": "my-first-post",
  "slug": "my-first-post",
  "collection": "blog",
  "data": {
    "title": "My First Post",
    "description": "This is my first blog post",
    "publicationDate": "2024-01-15T00:00:00.000Z",
    "tags": ["introduction", "blog"]
  },
  "body": "# My First Post\n\nContent here...",
  "lastModified": "2024-01-15T10:30:00.000Z"
}
```

### Create Content Item
Create a new content item in a collection.

**Endpoint**: `POST /admin/api/content/{collection}`

**Request Body**:
```json
{
  "id": "new-blog-post",
  "data": {
    "title": "New Blog Post",
    "description": "A new blog post",
    "publicationDate": "2024-01-20",
    "tags": ["new", "blog"]
  },
  "body": "# New Blog Post\n\nThis is the content..."
}
```

**Response**:
```json
{
  "success": true,
  "id": "new-blog-post",
  "message": "Content created successfully"
}
```

### Update Content Item
Update an existing content item.

**Endpoint**: `PUT /admin/api/content/{collection}/{id}`

**Request Body**:
```json
{
  "data": {
    "title": "Updated Title",
    "description": "Updated description"
  },
  "body": "# Updated Content\n\nNew content here..."
}
```

**Response**:
```json
{
  "success": true,
  "id": "my-first-post",
  "message": "Content updated successfully"
}
```

### Delete Content Item
Delete a content item from a collection.

**Endpoint**: `DELETE /admin/api/content/{collection}/{id}`

**Response**:
```json
{
  "success": true,
  "id": "my-first-post",
  "message": "Content deleted successfully"
}
```

## File Management API

### List Files
Retrieve files from the public directory.

**Endpoint**: `GET /admin/api/files`

**Query Parameters**:
- `path`: Directory path (default: "/")
- `type`: Filter by file type (image, document, etc.)

**Response**:
```json
{
  "path": "/images",
  "files": [
    {
      "name": "hero.jpg",
      "path": "/images/hero.jpg",
      "type": "image",
      "size": 245760,
      "lastModified": "2024-01-15T10:30:00.000Z",
      "url": "/images/hero.jpg"
    }
  ],
  "directories": [
    {
      "name": "blog",
      "path": "/images/blog"
    }
  ]
}
```

### Upload File
Upload a new file to the public directory.

**Endpoint**: `POST /admin/api/files/upload`

**Request**: Multipart form data
- `file`: File to upload
- `path`: Target directory path (optional)

**Response**:
```json
{
  "success": true,
  "file": {
    "name": "uploaded-image.jpg",
    "path": "/images/uploaded-image.jpg",
    "url": "/images/uploaded-image.jpg",
    "size": 123456
  },
  "message": "File uploaded successfully"
}
```

### Delete File
Delete a file from the public directory.

**Endpoint**: `DELETE /admin/api/files`

**Request Body**:
```json
{
  "path": "/images/old-image.jpg"
}
```

**Response**:
```json
{
  "success": true,
  "path": "/images/old-image.jpg",
  "message": "File deleted successfully"
}
```

## Error Handling

### Standard Error Response Format

All API endpoints return errors in a consistent format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Common HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

### Validation Errors

Schema validation errors return detailed information:

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "title",
      "message": "Title is required",
      "code": "REQUIRED"
    },
    {
      "field": "publicationDate",
      "message": "Invalid date format",
      "code": "INVALID_DATE"
    }
  ]
}
```

## Rate Limiting

Development API endpoints have generous rate limits:
- 1000 requests per minute per IP
- 100 file uploads per hour
- No authentication required

## Security Considerations

### Development-Only Access
- All API endpoints only available in development mode
- No production exposure
- Local file system access only
- No external network dependencies

### Data Validation
- All input validated against schemas
- File upload restrictions enforced
- Path traversal protection
- Content sanitization

This comprehensive API provides full programmatic access to all Antler CMS features during development, enabling custom integrations and advanced workflows while maintaining security and performance.