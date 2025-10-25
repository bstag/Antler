/**
 * Configuration validation utilities
 */

export interface SiteConfig {
  contentTypes: {
    [key: string]: {
      enabled: boolean;
      label: string;
      description: string;
    };
  };
  navigation: {
    items: Array<{
      id: string;
      label: string;
      path: string;
      enabled: boolean;
      order: number;
    }>;
  };
  siteMode: string;
  metadata: {
    lastModified: string;
    version: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates site configuration structure and data
 */
export function validateSiteConfig(config: any): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check if config exists
  if (!config) {
    result.isValid = false;
    result.errors.push('Configuration is null or undefined');
    return result;
  }

  // Validate contentTypes
  if (!config.contentTypes || typeof config.contentTypes !== 'object') {
    result.isValid = false;
    result.errors.push('contentTypes is required and must be an object');
  } else {
    // Validate each content type
    for (const [key, contentType] of Object.entries(config.contentTypes)) {
      if (!contentType || typeof contentType !== 'object') {
        result.isValid = false;
        result.errors.push(`contentTypes.${key} must be an object`);
        continue;
      }

      const ct = contentType as any;
      
      if (typeof ct.enabled !== 'boolean') {
        result.isValid = false;
        result.errors.push(`contentTypes.${key}.enabled must be a boolean`);
      }

      if (!ct.label || typeof ct.label !== 'string') {
        result.isValid = false;
        result.errors.push(`contentTypes.${key}.label is required and must be a string`);
      }

      if (!ct.description || typeof ct.description !== 'string') {
        result.isValid = false;
        result.errors.push(`contentTypes.${key}.description is required and must be a string`);
      }
    }
  }

  // Validate navigation
  if (!config.navigation || typeof config.navigation !== 'object') {
    result.isValid = false;
    result.errors.push('navigation is required and must be an object');
  } else {
    if (!Array.isArray(config.navigation.items)) {
      result.isValid = false;
      result.errors.push('navigation.items must be an array');
    } else {
      // Validate each navigation item
      config.navigation.items.forEach((item: any, index: number) => {
        if (!item || typeof item !== 'object') {
          result.isValid = false;
          result.errors.push(`navigation.items[${index}] must be an object`);
          return;
        }

        if (!item.id || typeof item.id !== 'string') {
          result.isValid = false;
          result.errors.push(`navigation.items[${index}].id is required and must be a string`);
        }

        if (!item.label || typeof item.label !== 'string') {
          result.isValid = false;
          result.errors.push(`navigation.items[${index}].label is required and must be a string`);
        }

        if (!item.path || typeof item.path !== 'string') {
          result.isValid = false;
          result.errors.push(`navigation.items[${index}].path is required and must be a string`);
        }

        if (typeof item.enabled !== 'boolean') {
          result.isValid = false;
          result.errors.push(`navigation.items[${index}].enabled must be a boolean`);
        }

        if (typeof item.order !== 'number') {
          result.isValid = false;
          result.errors.push(`navigation.items[${index}].order must be a number`);
        }
      });

      // Check for duplicate IDs
      const ids = config.navigation.items.map((item: any) => item.id);
      const duplicateIds = ids.filter((id: string, index: number) => ids.indexOf(id) !== index);
      if (duplicateIds.length > 0) {
        result.isValid = false;
        result.errors.push(`Duplicate navigation item IDs found: ${duplicateIds.join(', ')}`);
      }

      // Check for duplicate paths
      const paths = config.navigation.items.map((item: any) => item.path);
      const duplicatePaths = paths.filter((path: string, index: number) => paths.indexOf(path) !== index);
      if (duplicatePaths.length > 0) {
        result.warnings.push(`Duplicate navigation paths found: ${duplicatePaths.join(', ')}`);
      }
    }
  }

  // Validate siteMode
  if (!config.siteMode || typeof config.siteMode !== 'string') {
    result.isValid = false;
    result.errors.push('siteMode is required and must be a string');
  }

  // Validate metadata
  if (!config.metadata || typeof config.metadata !== 'object') {
    result.isValid = false;
    result.errors.push('metadata is required and must be an object');
  } else {
    if (!config.metadata.lastModified || typeof config.metadata.lastModified !== 'string') {
      result.isValid = false;
      result.errors.push('metadata.lastModified is required and must be a string');
    }

    if (!config.metadata.version || typeof config.metadata.version !== 'string') {
      result.isValid = false;
      result.errors.push('metadata.version is required and must be a string');
    }
  }

  return result;
}

/**
 * Validates that enabled navigation items have corresponding enabled content types
 */
export function validateNavigationContentTypeConsistency(config: SiteConfig): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!config.navigation?.items || !config.contentTypes) {
    return result;
  }

  config.navigation.items.forEach(item => {
    if (!item.enabled) return;

    // Skip home page and custom links
    if (item.id === 'home' || !item.path.startsWith('/')) return;

    // Extract content type from path (e.g., /blog -> blog)
    const pathSegments = item.path.split('/').filter(Boolean);
    if (pathSegments.length === 0) return;

    const contentTypeId = pathSegments[0];
    const contentType = config.contentTypes[contentTypeId];

    if (!contentType) {
      result.warnings.push(`Navigation item "${item.label}" (${item.path}) doesn't have a corresponding content type`);
    } else if (!contentType.enabled) {
      result.warnings.push(`Navigation item "${item.label}" is enabled but content type "${contentTypeId}" is disabled`);
    }
  });

  return result;
}

/**
 * Sanitizes and normalizes configuration data
 */
export function sanitizeConfig(config: any): SiteConfig {
  const sanitized: SiteConfig = {
    contentTypes: {},
    navigation: { items: [] },
    siteMode: 'full-site',
    metadata: {
      lastModified: new Date().toISOString(),
      version: '1.0.0'
    }
  };

  // Sanitize contentTypes
  if (config.contentTypes && typeof config.contentTypes === 'object') {
    for (const [key, value] of Object.entries(config.contentTypes)) {
      if (value && typeof value === 'object') {
        const ct = value as any;
        sanitized.contentTypes[key] = {
          enabled: Boolean(ct.enabled),
          label: String(ct.label || key),
          description: String(ct.description || '')
        };
      }
    }
  }

  // Sanitize navigation
  if (config.navigation?.items && Array.isArray(config.navigation.items)) {
    sanitized.navigation.items = config.navigation.items
      .filter((item: any) => item && typeof item === 'object')
      .map((item: any, index: number) => ({
        id: String(item.id || `item-${index}`),
        label: String(item.label || 'Untitled'),
        path: String(item.path || '/'),
        enabled: Boolean(item.enabled),
        order: Number(item.order) || index
      }))
      .sort((a, b) => a.order - b.order);
  }

  // Sanitize siteMode
  if (config.siteMode && typeof config.siteMode === 'string') {
    sanitized.siteMode = config.siteMode;
  }

  // Sanitize metadata
  if (config.metadata && typeof config.metadata === 'object') {
    sanitized.metadata = {
      lastModified: String(config.metadata.lastModified || new Date().toISOString()),
      version: String(config.metadata.version || '1.0.0')
    };
  }

  return sanitized;
}