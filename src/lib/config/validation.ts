import { z } from 'zod';
import type { SiteConfig, ConfigValidationResult, ConfigValidationError } from '../../types/config';

const ContentTypeConfigSchema = z.object({
  id: z.string().min(1, 'Content type ID is required'),
  name: z.string().min(1, 'Content type name is required'),
  enabled: z.boolean(),
  route: z.string().regex(/^\//, 'Route must start with /'),
  icon: z.string().optional(),
  order: z.number().min(0, 'Order must be non-negative'),
  settings: z.record(z.any()).optional()
});

const NavigationItemSchema: z.ZodType<any> = z.object({
  id: z.string().min(1, 'Navigation item ID is required'),
  label: z.string().min(1, 'Navigation item label is required'),
  href: z.string().min(1, 'Navigation item href is required'),
  enabled: z.boolean(),
  order: z.number().min(0, 'Order must be non-negative'),
  icon: z.string().optional(),
  external: z.boolean().optional(),
  children: z.array(z.lazy(() => NavigationItemSchema)).optional()
});

const CustomLinkSchema = z.object({
  id: z.string().min(1, 'Custom link ID is required'),
  label: z.string().min(1, 'Custom link label is required'),
  href: z.string().url('Custom link href must be a valid URL'),
  external: z.boolean(),
  order: z.number().min(0, 'Order must be non-negative'),
  icon: z.string().optional()
});

const SiteCustomizationSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  description: z.string().min(1, 'Site description is required'),
  logo: z.string().optional()
});

const SiteConfigSchema = z.object({
  siteMode: z.enum(['full', 'resume', 'blog', 'portfolio', 'docs', 'custom']),
  contentTypes: z.array(ContentTypeConfigSchema).min(1, 'At least one content type is required'),
  navigation: z.array(NavigationItemSchema).min(1, 'At least one navigation item is required'),
  customLinks: z.array(CustomLinkSchema),
  customization: SiteCustomizationSchema,
  lastModified: z.string().datetime('Invalid date format for lastModified')
});

export function validateSiteConfig(config: unknown): ConfigValidationResult {
  try {
    SiteConfigSchema.parse(config);
    
    // Additional business logic validation
    const siteConfig = config as SiteConfig;
    const errors: ConfigValidationError[] = [];
    
    // Check for duplicate content type IDs
    const contentTypeIds = siteConfig.contentTypes.map(ct => ct.id);
    const duplicateContentTypes = contentTypeIds.filter((id, index) => contentTypeIds.indexOf(id) !== index);
    if (duplicateContentTypes.length > 0) {
      errors.push({
        field: 'contentTypes',
        message: `Duplicate content type IDs found: ${duplicateContentTypes.join(', ')}`,
        code: 'DUPLICATE_CONTENT_TYPE_IDS'
      });
    }
    
    // Check for duplicate navigation item IDs
    const navigationIds = siteConfig.navigation.map(nav => nav.id);
    const duplicateNavigation = navigationIds.filter((id, index) => navigationIds.indexOf(id) !== index);
    if (duplicateNavigation.length > 0) {
      errors.push({
        field: 'navigation',
        message: `Duplicate navigation item IDs found: ${duplicateNavigation.join(', ')}`,
        code: 'DUPLICATE_NAVIGATION_IDS'
      });
    }
    
    // Check for duplicate routes
    const routes = siteConfig.contentTypes.map(ct => ct.route);
    const duplicateRoutes = routes.filter((route, index) => routes.indexOf(route) !== index);
    if (duplicateRoutes.length > 0) {
      errors.push({
        field: 'contentTypes',
        message: `Duplicate routes found: ${duplicateRoutes.join(', ')}`,
        code: 'DUPLICATE_ROUTES'
      });
    }
    
    // Ensure at least one content type is enabled
    const enabledContentTypes = siteConfig.contentTypes.filter(ct => ct.enabled);
    if (enabledContentTypes.length === 0) {
      errors.push({
        field: 'contentTypes',
        message: 'At least one content type must be enabled',
        code: 'NO_ENABLED_CONTENT_TYPES'
      });
    }
    
    // Ensure at least one navigation item is enabled
    const enabledNavigation = siteConfig.navigation.filter(nav => nav.enabled);
    if (enabledNavigation.length === 0) {
      errors.push({
        field: 'navigation',
        message: 'At least one navigation item must be enabled',
        code: 'NO_ENABLED_NAVIGATION'
      });
    }
    
    // Check that navigation items reference valid content types or are valid paths
    const validPaths = ['/', ...siteConfig.contentTypes.map(ct => ct.route)];
    const invalidNavigation = siteConfig.navigation.filter(nav => 
      nav.enabled && 
      !nav.external && 
      !validPaths.includes(nav.href) &&
      !nav.href.startsWith('http')
    );
    
    if (invalidNavigation.length > 0) {
      errors.push({
        field: 'navigation',
        message: `Navigation items reference invalid paths: ${invalidNavigation.map(nav => nav.href).join(', ')}`,
        code: 'INVALID_NAVIGATION_PATHS'
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ConfigValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      return {
        valid: false,
        errors
      };
    }
    
    return {
      valid: false,
      errors: [{
        field: 'root',
        message: 'Unknown validation error occurred',
        code: 'UNKNOWN_ERROR'
      }]
    };
  }
}

export function validatePartialConfig(partialConfig: Partial<SiteConfig>): ConfigValidationResult {
  // For partial validation, we only validate the fields that are present
  const errors: ConfigValidationError[] = [];
  
  if (partialConfig.siteMode !== undefined) {
    try {
      z.enum(['full', 'resume', 'blog', 'portfolio', 'docs', 'custom']).parse(partialConfig.siteMode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(err => ({
          field: 'siteMode',
          message: err.message,
          code: err.code
        })));
      }
    }
  }
  
  if (partialConfig.contentTypes) {
    try {
      z.array(ContentTypeConfigSchema).parse(partialConfig.contentTypes);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(err => ({
          field: `contentTypes.${err.path.join('.')}`,
          message: err.message,
          code: err.code
        })));
      }
    }
  }
  
  if (partialConfig.navigation) {
    try {
      z.array(NavigationItemSchema).parse(partialConfig.navigation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(err => ({
          field: `navigation.${err.path.join('.')}`,
          message: err.message,
          code: err.code
        })));
      }
    }
  }
  
  if (partialConfig.customLinks) {
    try {
      z.array(CustomLinkSchema).parse(partialConfig.customLinks);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(err => ({
          field: `customLinks.${err.path.join('.')}`,
          message: err.message,
          code: err.code
        })));
      }
    }
  }
  
  if (partialConfig.customization) {
    try {
      SiteCustomizationSchema.parse(partialConfig.customization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(err => ({
          field: `customization.${err.path.join('.')}`,
          message: err.message,
          code: err.code
        })));
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}