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

export interface LogoConfig {
  type: 'svg' | 'image' | 'text';
  svgContent?: string;
  imagePath?: string;
  imageAlt?: string;
  width?: string;
  height?: string;
}

export interface AuthorInfo {
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  custom?: Array<{
    name: string;
    url: string;
    icon?: string;
  }>;
}

export interface SEOSettings {
  defaultImage?: string;
  twitterHandle?: string;
  facebookAppId?: string;
  googleSiteVerification?: string;
  keywords?: string[];
}

export interface PageSEOConfig {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterConfig {
  copyrightText: string;
  showBuiltWith: boolean;
  showSocialLinks: boolean;
  legalLinks?: FooterLink[];
  customSections?: FooterSection[];
}

export interface SiteURLs {
  baseUrl: string;
  basePath: string;
  primaryDomain?: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  googleAnalyticsId?: string;
  plausibleDomain?: string;
}

export interface FeaturesConfig {
  analytics?: AnalyticsConfig;
  rss?: {
    enabled: boolean;
    feedPath?: string;
  };
  sitemap?: {
    enabled: boolean;
  };
}

export interface ThemeConfig {
  default: string;
  allowUserOverride: boolean;
  availableThemes: string[];
}

export interface HeroAction {
  text: string;
  link: string;
  icon?: string | null;
}

export interface HeroFeature {
  title: string;
  description: string;
  icon: string;
}

export interface HeroConfig {
  title: {
    text: string;
    highlightedText: string;
  };
  subtitle: string;
  badge: {
    text: string;
    icon: string;
  };
  actions: {
    primary: HeroAction;
    secondary: HeroAction;
  };
  features: HeroFeature[];
}

export interface SiteCustomization {
  siteName: string;
  description: string;
  tagline?: string;
  logo?: LogoConfig;
  author: AuthorInfo;
  hero?: HeroConfig;
  social: SocialLinks;
  seo: SEOSettings;
  pages?: Record<string, PageSEOConfig>;
  footer: FooterConfig;
  urls: SiteURLs;
  theme: ThemeConfig;
  features: FeaturesConfig;
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