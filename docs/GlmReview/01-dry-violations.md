# DRY Violations - Don't Repeat Yourself

This document catalogs all instances of code duplication found in the Antler CMS codebase.

## Summary

- **Total Violations Found:** 4 major, 8 minor
- **Estimated Remediation:** 8-12 hours
- **Impact:** Medium-High (maintenance burden)

---

## Major Violations

### 1. Duplicate `generateSlug` Function

**Severity:** Medium
**Complexity:** Low
**Effort:** 15 minutes

**Locations:**
- `src/lib/admin/content-service.ts:270-276`
- `src/pages/admin/api/content/[collection].ts:212-217`

**Current Code:**
```typescript
// In content-service.ts (line 270)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

// In [collection].ts (line 212) - slightly different
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // Missing substring!
};
```

**What is bad:**
- Same logic duplicated in two places
- Slight differences in implementation (one has length limit, one doesn't)
- If slug generation logic changes, must update both places
- Risk of inconsistency

**Should we fix it?** ✅ Yes

**Recommended Solution:**
```typescript
// Create: src/lib/utils/slug.ts
/**
 * Generates a URL-safe slug from text
 * @param text The text to convert to a slug
 * @param maxLength Maximum length of the slug (default: 50)
 * @returns URL-safe slug
 */
export function generateSlug(text: string, maxLength: number = 50): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, maxLength);
}

// Add unit tests
import { describe, it, expect } from 'vitest';
import { generateSlug } from './slug';

describe('generateSlug', () => {
  it('converts text to lowercase', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(generateSlug('My Blog Post')).toBe('my-blog-post');
  });

  it('removes special characters', () => {
    expect(generateSlug('Hello! @#$ World?')).toBe('hello-world');
  });

  it('limits length', () => {
    const long = 'a'.repeat(100);
    expect(generateSlug(long, 20)).toHaveLength(20);
  });

  it('removes leading/trailing hyphens', () => {
    expect(generateSlug('---hello---')).toBe('hello');
  });
});

// Usage in content-service.ts:
import { generateSlug } from '@/lib/utils/slug';

// Usage in [collection].ts:
import { generateSlug } from '../../lib/utils/slug';
```

**Migration Steps:**
1. Create `src/lib/utils/slug.ts`
2. Add function with tests
3. Update import in `content-service.ts`
4. Update import in `[collection].ts`
5. Run tests to verify

---

### 2. Hardcoded Schema Definitions

**Severity:** High
**Complexity:** Medium
**Effort:** 4-6 hours

**Location:** `src/lib/admin/schema-parser.ts:149-308`

**What is bad:**
- 160 lines of hardcoded schema definitions
- Duplicates schema information from `src/content/config.ts`
- Comment on line 151: "In a real implementation, we would dynamically import"
- High maintenance burden - must update schemas in two places

**Current Code:**
```typescript
// Lines 149-308 in schema-parser.ts
static getDefaultSchemas(): Record<string, SchemaDefinition> {
  return {
    blog: {
      name: 'blog',
      label: 'Blog Posts',
      fields: {
        title: { type: 'string', label: 'Title', required: true },
        // ... 40+ more lines
      }
    },
    projects: {
      name: 'projects',
      label: 'Projects',
      fields: {
        // ... 40+ more lines
      }
    },
    // ... 5 more collections, 80+ more lines
  };
}
```

**Why this exists:**
- Provides fallback when dynamic import fails
- Ensures admin panel always has some schema definition
- Quick solution for initial implementation

**Should we fix it?** ✅ Yes

**Good aspects:**
- Provides fallback behavior
- Ensures admin panel doesn't break

**Recommended Solution:**

**Option 1: Dynamic Import (Preferred)**
```typescript
// src/lib/admin/schema-parser.ts
import type { CollectionEntry } from 'astro:content';

static async loadContentCollections(): Promise<Record<string, SchemaDefinition>> {
  try {
    // Import the actual config
    const { collections } = await import('../../content/config');
    const schemas: Record<string, SchemaDefinition> = {};

    // Parse each collection schema
    for (const [name, collectionConfig] of Object.entries(collections)) {
      schemas[name] = this.zodSchemaToFieldDefinitions(
        collectionConfig.schema,
        name
      );
    }

    return schemas;
  } catch (error) {
    console.error('Failed to load content collections:', error);
    // Return empty instead of hardcoded
    return {};
  }
}

/**
 * Convert Zod schema to FieldDefinitions
 */
private static zodSchemaToFieldDefinitions(
  zodSchema: any,
  collectionName: string
): SchemaDefinition {
  const shape = zodSchema._def.shape();
  const fields: Record<string, FieldDefinition> = {};

  for (const [fieldName, fieldSchema] of Object.entries(shape)) {
    fields[fieldName] = this.zodTypeToFieldDefinition(fieldSchema);
  }

  return {
    name: collectionName,
    label: this.formatLabel(collectionName),
    fields
  };
}

private static zodTypeToFieldDefinition(zodType: any): FieldDefinition {
  const typeName = zodType._def.typeName;

  switch (typeName) {
    case 'ZodString':
      return { type: 'string', label: '', required: !zodType.isOptional() };
    case 'ZodNumber':
      return { type: 'number', label: '', required: !zodType.isOptional() };
    case 'ZodBoolean':
      return { type: 'boolean', label: '', required: !zodType.isOptional() };
    case 'ZodDate':
      return { type: 'date', label: '', required: !zodType.isOptional() };
    case 'ZodArray':
      return {
        type: 'array',
        label: '',
        required: !zodType.isOptional(),
        items: this.zodTypeToFieldDefinition(zodType._def.type)
      };
    // ... more types
    default:
      return { type: 'string', label: '', required: false };
  }
}

private static formatLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
```

**Option 2: Generate Schema File at Build Time**
```typescript
// scripts/generate-admin-schemas.ts
import { collections } from '../src/content/config';
import fs from 'fs/promises';

async function generateSchemas() {
  const schemas = {};

  for (const [name, config] of Object.entries(collections)) {
    schemas[name] = parseZodSchema(config.schema, name);
  }

  const code = `
// Auto-generated file - do not edit manually
// Generated from src/content/config.ts

export const ADMIN_SCHEMAS = ${JSON.stringify(schemas, null, 2)};
`;

  await fs.writeFile(
    'src/lib/admin/generated-schemas.ts',
    code
  );
}

generateSchemas();
```

**Migration Steps:**
1. Implement dynamic schema loading
2. Add error handling for schema parsing
3. Test with all existing collections
4. Remove hardcoded schemas
5. Update build process if using Option 2

**Benefits:**
- Single source of truth
- Automatic synchronization
- Reduced code size (160 lines removed)
- Easier to maintain

---

### 3. Duplicate API Response Patterns

**Severity:** Medium
**Complexity:** Low
**Effort:** 1-2 hours

**Files Affected:** 15+ API endpoints

**Examples:**
```typescript
// src/pages/api/config/site.ts:10-30
export const GET: APIRoute = async () => {
  try {
    const config = await configManager.getConfig();
    return new Response(JSON.stringify(config), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch site configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// src/pages/api/theme/current.ts:10-44 - Nearly identical pattern
export const GET: APIRoute = async () => {
  try {
    const theme = await getTheme();
    return new Response(JSON.stringify({ theme }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch current theme'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

**What is bad:**
- Every endpoint manually constructs Response objects
- Duplicate headers configuration (15+ places)
- Inconsistent error response format
- Harder to add features like rate limiting, logging, etc.

**Should we fix it?** ✅ Yes

**Recommended Solution:**
```typescript
// src/lib/api/responses.ts
export interface ApiSuccessResponse<T> {
  data: T;
  timestamp?: string;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

export function apiSuccess<T>(
  data: T,
  options: {
    status?: number;
    cache?: boolean;
  } = {}
): Response {
  const {
    status = 200,
    cache = false
  } = options;

  const body: ApiSuccessResponse<T> = {
    data,
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cache ? 'public, max-age=300' : 'no-cache, no-store'
    }
  });
}

export function apiError(
  message: string,
  options: {
    status?: number;
    code?: string;
    details?: any;
  } = {}
): Response {
  const {
    status = 500,
    code,
    details
  } = options;

  const body: ApiErrorResponse = {
    error: message,
    ...(code && { code }),
    ...(details && { details }),
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Convenience helpers
export const badRequest = (message: string, details?: any) =>
  apiError(message, { status: 400, code: 'BAD_REQUEST', details });

export const unauthorized = (message: string = 'Unauthorized') =>
  apiError(message, { status: 401, code: 'UNAUTHORIZED' });

export const notFound = (message: string = 'Not found') =>
  apiError(message, { status: 404, code: 'NOT_FOUND' });

export const serverError = (message: string, details?: any) =>
  apiError(message, { status: 500, code: 'SERVER_ERROR', details });
```

**Usage Example:**
```typescript
// Refactored src/pages/api/config/site.ts
import { apiSuccess, apiError } from '@/lib/api/responses';

export const GET: APIRoute = async () => {
  try {
    const config = await configManager.getConfig();
    return apiSuccess(config);
  } catch (error) {
    return apiError(
      'Failed to fetch site configuration',
      { details: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
};

// Refactored with validation
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validation
    const result = SiteConfigSchema.safeParse(body);
    if (!result.success) {
      return badRequest('Invalid configuration', result.error.errors);
    }

    const updated = await configManager.updateConfig(result.data);
    return apiSuccess(updated);
  } catch (error) {
    return serverError('Failed to update configuration', error);
  }
};
```

**Benefits:**
- Consistent API responses across all endpoints
- Easier to add features (logging, monitoring)
- Reduced code duplication (300+ lines → reusable utility)
- Better type safety
- Easier testing

---

### 4. Repeated Field Configuration Logic

**Severity:** Medium
**Complexity:** Medium
**Effort:** 2-3 hours

**Location:** `src/components/admin/DynamicForm.tsx:233-296`

**What is bad:**
- Two similar functions with hardcoded field configurations
- 60+ lines of switch statements
- Adding new field type requires updating multiple places

**Current Code:**
```typescript
const getDefaultObjectForField = (fieldName: string): any => {
  switch (fieldName) {
    case 'experience':
      return {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: []
      };
    case 'education':
      return {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: ''
      };
    // ... 5 more cases
    default:
      return { name: '', value: '' };
  }
};

const getFieldsForObject = (fieldName: string): Array<{...}> => {
  switch (fieldName) {
    case 'experience':
      return [
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'position', label: 'Position', type: 'text' },
        // ... more fields
      ];
    case 'education':
      return [
        { key: 'institution', label: 'Institution', type: 'text' },
        // ... more fields
      ];
    // ... 5 more cases
  }
};
```

**Should we fix it?** Maybe (depends on future extensibility)

**Recommended Solution:**
```typescript
// src/lib/admin/field-configs.ts
export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'array';
  required?: boolean;
  placeholder?: string;
}

export interface ObjectFieldConfig {
  defaultValue: Record<string, any>;
  fields: FieldConfig[];
}

export const OBJECT_FIELD_CONFIGS: Record<string, ObjectFieldConfig> = {
  experience: {
    defaultValue: {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: []
    },
    fields: [
      { key: 'company', label: 'Company', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'text', required: true },
      { key: 'startDate', label: 'Start Date', type: 'date', required: true },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'achievements', label: 'Achievements', type: 'array' }
    ]
  },
  education: {
    defaultValue: {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    },
    fields: [
      { key: 'institution', label: 'Institution', type: 'text', required: true },
      { key: 'degree', label: 'Degree', type: 'text', required: true },
      { key: 'field', label: 'Field of Study', type: 'text' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  // ... other configurations
} as const;

// Default fallback config
const DEFAULT_FIELD_CONFIG: ObjectFieldConfig = {
  defaultValue: { name: '', value: '' },
  fields: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'value', label: 'Value', type: 'text' }
  ]
};

export function getFieldConfig(fieldName: string): ObjectFieldConfig {
  return OBJECT_FIELD_CONFIGS[fieldName] || DEFAULT_FIELD_CONFIG;
}
```

**Usage in DynamicForm.tsx:**
```typescript
import { getFieldConfig } from '@/lib/admin/field-configs';

const getDefaultObjectForField = (fieldName: string): any => {
  return getFieldConfig(fieldName).defaultValue;
};

const getFieldsForObject = (fieldName: string) => {
  return getFieldConfig(fieldName).fields;
};
```

**Benefits:**
- Single source of configuration
- Easy to add new field types
- Can be extended with validation rules
- Better type safety
- Easier to test

---

## Minor Violations

### 5. Duplicate Theme Loading Logic

**Files:**
- `src/pages/admin/index.astro:27-48`
- `src/pages/admin/[...slug].astro:21-42`

**Effort:** 15 minutes

**Solution:** Extract to shared component or utility

---

### 6. Repeated Error Logging Pattern

**Multiple files:** Content service, API endpoints

**Pattern:**
```typescript
catch (error) {
  console.error('Failed to ...:', error);
  // handle error
}
```

**Solution:** Create centralized logger (see 03-code-smells.md)

---

### 7. Duplicate Collection Name Arrays

**Files:**
- `src/components/admin/AdminApp.tsx:93`
- `src/lib/admin/content-service.ts` (implicit)

**Solution:** Create constants file with collection definitions

---

### 8. Repeated Validation Patterns

**Files:** Multiple API endpoints

**Solution:** Create validation middleware or utility functions

---

## Summary Statistics

| Violation Type | Count | Total Lines | Effort |
|---------------|-------|-------------|---------|
| Duplicate Functions | 2 | ~30 | 1 hour |
| Hardcoded Schemas | 1 | 160 | 6 hours |
| API Response Patterns | 15+ | ~300 | 2 hours |
| Field Configurations | 2 | 60 | 3 hours |
| Minor Duplications | 8 | ~100 | 2 hours |
| **Total** | **28+** | **~650** | **14 hours** |

## Recommended Priority

1. **High:** API Response Patterns (affects consistency)
2. **High:** Hardcoded Schemas (high maintenance burden)
3. **Medium:** Field Configurations (if extensibility needed)
4. **Low:** Duplicate Functions (small impact)
5. **Low:** Minor Violations (can be fixed as encountered)
