export interface ContentTypeConfig {
  id: string;
  name: string;
  enabled: boolean;
  route: string;
  icon?: string;
  order: number;
  settings?: Record<string, any>;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order: number;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

export interface CustomLink {
  id: string;
  label: string;
  href: string;
  external: boolean;
  order: number;
  icon?: string;
}

export interface SiteCustomization {
  siteName: string;
  description: string;
  logo?: string;
}

export interface SiteConfig {
  siteMode: 'full' | 'resume' | 'blog' | 'portfolio' | 'docs' | 'custom';
  contentTypes: ContentTypeConfig[];
  navigation: NavigationItem[];
  customLinks: CustomLink[];
  customization: SiteCustomization;
  lastModified: string;
}

export interface SiteTemplate {
  name: string;
  description: string;
  siteMode: SiteConfig['siteMode'];
  contentTypes: ContentTypeConfig[];
  navigation: NavigationItem[];
  customLinks?: CustomLink[];
}

export interface ConfigValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: ConfigValidationError[];
}