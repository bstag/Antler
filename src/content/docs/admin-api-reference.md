---
title: "Admin API Reference"
description: "Complete API documentation for MdCms admin interface endpoints"
group: "Admin Interface"
order: 4
---

# Admin API Reference

The MdCms admin interface provides a comprehensive REST API for managing content, files, and schemas. All API endpoints are available only during development and are automatically excluded from production builds.

## Base Configuration

### API Base URL
```
http://localhost:4321/admin/api
```

### Authentication
No authentication required - admin API is only available in development mode on localhost.

### Response Format
All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": any,           // Present on success
  "error": string,       // Present on error
  "errors": string[]     // Present on validation errors
}
```

## Content API

### Content Collections

#### List Content Items
Get paginated list of content items from a collection.

**Endpoint**: `GET /admin/api/content/{collection}`

**Parameters**:
- `collection` (path): Collection name (`blog`, `projects`, `docs`, `resume*`)
- `page` (query): Page number (default: 1)
- `limit` (query): Items per page (default: 20)
- `search` (query): Search term for title/description

**Example Request**:
```
GET /admin/api/content/blog?page=1&limit=10&search=astro
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "building-with-astro",
        "collection": "blog",
        "title": "Building with Astro",
        "filePath": "src/content/blog/building-with-astro.md",
        "frontmatter": {
          "title": "Building with Astro",
          "description": "Learn how to build modern websites with Astro",
          "publicationDate": "2024-01-15T00:00:00.000Z",
          "tags": ["astro", "web-development"],
          "featured": true
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "hasMore": false
  }
}
```

#### Get Single Content Item
Retrieve a specific content item with full content.

**Endpoint**: `GET /admin/api/content/{collection}/{id}`

**Parameters**:
- `collection` (path): Collection name
- `id` (path): Content item ID (slug)

**Example Request**:
```
GET /admin/api/content/blog/building-with-astro
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "id": "building-with-astro",
    "collection": "blog",
    "title": "Building with Astro",
    "filePath": "src/content/blog/building-with-astro.md",
    "frontmatter": {
      "title": "Building with Astro",
      "description": "Learn how to build modern websites with Astro",
      "publicationDate": "2024-01-15T00:00:00.000Z",
      "tags": ["astro", "web-development"],
      "featured": true
    },
    "content": "# Building with Astro\n\nAstro is a modern static site generator...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Create Content Item
Create a new content item in a collection.

**Endpoint**: `POST /admin/api/content/{collection}`

**Request Body**:
```json
{
  "frontmatter": {
    "title": "New Blog Post",
    "description": "Description of the new post",
    "publicationDate": "2024-01-20T00:00:00.000Z",
    "tags": ["new", "blog"]
  },
  "content": "# New Blog Post\n\nContent goes here..."
}
```

**Response**: Returns the created content item (same format as GET single item).

#### Update Content Item
Update an existing content item.

**Endpoint**: `PUT /admin/api/content/{collection}/{id}`

**Request Body**: Same as create request.

**Response**: Returns the updated content item.

#### Delete Content Item
Delete a content item from a collection.

**Endpoint**: `DELETE /admin/api/content/{collection}/{id}`

**Response**:
```json
{
  "success": true
}
```

### Content Collections Supported

#### Blog Collection (`blog`)
**Required Fields**:
- `title` (string): Post title
- `description` (string): Post description
- `publicationDate` (date): Publication date
- `tags` (array): Array of tag strings

**Optional Fields**:
- `featuredImage` (string): Image URL
- `author` (string): Author name
- `readingTime` (number): Reading time in minutes
- `featured` (boolean): Featured post flag

#### Projects Collection (`projects`)
**Required Fields**:
- `projectName` (string): Project name
- `projectImage` (string): Project image URL
- `description` (string): Project description
- `technologies` (array): Array of technology strings

**Optional Fields**:
- `githubLink` (string): GitHub repository URL
- `liveUrl` (string): Live project URL
- `featured` (boolean): Featured project flag
- `createdAt` (date): Project creation date

#### Documentation Collection (`docs`)
**Required Fields**:
- `title` (string): Document title
- `group` (string): Documentation group
- `order` (number): Display order within group

**Optional Fields**:
- `description` (string): Document description

#### Resume Collections (`resume*`)
Multiple resume-related collections with specific schemas:

- `resumePersonal`: Personal information
- `resumeExperience`: Work experience entries
- `resumeEducation`: Education entries
- `resumeCertifications`: Certification entries
- `resumeSkills`: Skills by category
- `resumeLanguages`: Language proficiencies
- `resumeProjects`: Resume-specific projects

## Schema API

### Get Collection Schema
Retrieve the schema definition for a content collection.

**Endpoint**: `GET /admin/api/schema/{collection}`

**Parameters**:
- `collection` (path): Collection name

**Example Request**:
```
GET /admin/api/schema/blog
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "collection": "blog",
    "type": "content",
    "fields": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "optional": false
      },
      {
        "name": "description",
        "type": "string",
        "required": true,
        "optional": false
      },
      {
        "name": "publicationDate",
        "type": "date",
        "required": true,
        "optional": false
      },
      {
        "name": "tags",
        "type": "array",
        "arrayType": "string",
        "required": true,
        "optional": false
      },
      {
        "name": "featured",
        "type": "boolean",
        "required": false,
        "optional": true,
        "defaultValue": false
      }
    ]
  }
}
```

## File Management API

### List Files
Get list of files in a directory.

**Endpoint**: `GET /admin/api/files/list`

**Parameters**:
- `directory` (query): Directory name (default: "images")

**Supported Directories**:
- `images`: Image files
- `documents`: Document files
- `assets`: General assets

**Example Request**:
```
GET /admin/api/files/list?directory=images
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "name": "hero-image-1642680000000.jpg",
        "path": "/images/hero-image-1642680000000.jpg",
        "url": "/images/hero-image-1642680000000.jpg",
        "size": 245760,
        "type": "image",
        "uploadedAt": "2024-01-20T10:00:00.000Z",
        "modifiedAt": "2024-01-20T10:00:00.000Z"
      }
    ],
    "directory": "images",
    "total": 1
  }
}
```

### Upload File
Upload a new file to a directory.

**Endpoint**: `POST /admin/api/files/upload`

**Request**: Multipart form data
- `file` (file): File to upload
- `directory` (string): Target directory (default: "images")

**Supported File Types**:
- **Images**: JPEG, PNG, GIF, WebP, SVG
- **Documents**: PDF, DOC, DOCX, TXT, RTF

**Example Response**:
```json
{
  "success": true,
  "data": {
    "filename": "my-image-1642680000000.jpg",
    "path": "/images/my-image-1642680000000.jpg",
    "url": "/images/my-image-1642680000000.jpg",
    "size": 245760,
    "type": "image/jpeg"
  }
}
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "error": "Collection parameter required"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Content not found"
}
```

#### 422 Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    "Title is required",
    "Publication date must be a valid date"
  ]
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

### Error Codes and Messages

| Code | Message | Description |
|------|---------|-------------|
| `COLLECTION_NOT_FOUND` | Collection not found | Invalid collection name |
| `CONTENT_NOT_FOUND` | Content not found | Content item doesn't exist |
| `VALIDATION_ERROR` | Validation failed | Schema validation failed |
| `FILE_TYPE_ERROR` | Invalid file type | Unsupported file format |
| `UPLOAD_ERROR` | File upload failed | File upload process failed |
| `PERMISSION_ERROR` | Permission denied | File system permission error |

## Rate Limiting

No rate limiting is applied to admin API endpoints since they're only available in development mode on localhost.

## Development Notes

### API Availability
- **Development only**: All admin API endpoints are excluded from production builds
- **Local access**: Only accessible from localhost during development
- **No authentication**: No authentication required in development mode

### File System Integration
- **Direct file access**: API directly reads/writes to file system
- **Real-time updates**: Changes are immediately reflected in the file system
- **Version control friendly**: All changes create standard file system changes

### Schema Validation
- **Zod integration**: Uses Zod schemas for validation
- **Type safety**: Full TypeScript support
- **Runtime validation**: Validates data at runtime

### Performance Considerations
- **File system caching**: Minimal caching for development responsiveness
- **Lazy loading**: Content loaded on demand
- **Efficient pagination**: Large collections handled efficiently

## Integration Examples

### JavaScript/TypeScript Client
```typescript
class AdminAPI {
  private baseUrl = 'http://localhost:4321/admin/api';

  async getContent(collection: string, page = 1, limit = 20) {
    const response = await fetch(
      `${this.baseUrl}/content/${collection}?page=${page}&limit=${limit}`
    );
    return response.json();
  }

  async createContent(collection: string, data: any) {
    const response = await fetch(`${this.baseUrl}/content/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async uploadFile(file: File, directory = 'images') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directory);

    const response = await fetch(`${this.baseUrl}/files/upload`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }
}
```

### React Hook Example
```typescript
import { useState, useEffect } from 'react';

function useContent(collection: string) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/admin/api/content/${collection}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContent(data.data.items);
        }
        setLoading(false);
      });
  }, [collection]);

  return { content, loading };
}
```

## Next Steps

- Explore [Admin Interface](./admin-interface) for UI documentation
- Learn about [Content Management](./admin-content-management) workflows
- Review [File Management](./admin-file-management) features
- Understand [Deployment](./deployment) considerations for production builds