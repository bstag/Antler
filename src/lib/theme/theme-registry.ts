/**
 * Theme Registry
 * Contains metadata for all available color themes
 */

export interface ThemeMetadata {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  colorFamily: string;
  tags: string[];
}

export const THEME_REGISTRY: Record<string, ThemeMetadata> = {
  blue: {
    id: 'blue',
    name: 'Ocean Blue',
    description: 'Classic professional blue theme',
    primaryColor: '#2563eb',
    colorFamily: 'blue',
    tags: ['professional', 'classic', 'default'],
  },
  indigo: {
    id: 'indigo',
    name: 'Deep Indigo',
    description: 'Rich blue-purple combination',
    primaryColor: '#4f46e5',
    colorFamily: 'blue-purple',
    tags: ['professional', 'sophisticated'],
  },
  purple: {
    id: 'purple',
    name: 'Royal Purple',
    description: 'Vibrant and creative purple',
    primaryColor: '#9333ea',
    colorFamily: 'purple',
    tags: ['creative', 'bold'],
  },
  pink: {
    id: 'pink',
    name: 'Hot Pink',
    description: 'Energetic and playful pink',
    primaryColor: '#db2777',
    colorFamily: 'pink',
    tags: ['playful', 'energetic'],
  },
  rose: {
    id: 'rose',
    name: 'Soft Rose',
    description: 'Elegant pink-red blend',
    primaryColor: '#e11d48',
    colorFamily: 'pink-red',
    tags: ['elegant', 'warm'],
  },
  red: {
    id: 'red',
    name: 'Bold Red',
    description: 'Strong and attention-grabbing',
    primaryColor: '#dc2626',
    colorFamily: 'red',
    tags: ['bold', 'energetic'],
  },
  orange: {
    id: 'orange',
    name: 'Vibrant Orange',
    description: 'Warm and inviting orange',
    primaryColor: '#ea580c',
    colorFamily: 'orange',
    tags: ['warm', 'friendly'],
  },
  amber: {
    id: 'amber',
    name: 'Golden Amber',
    description: 'Rich golden tones',
    primaryColor: '#d97706',
    colorFamily: 'yellow-orange',
    tags: ['warm', 'rich'],
  },
  yellow: {
    id: 'yellow',
    name: 'Sunshine Yellow',
    description: 'Bright and cheerful',
    primaryColor: '#ca8a04',
    colorFamily: 'yellow',
    tags: ['cheerful', 'bright'],
  },
  lime: {
    id: 'lime',
    name: 'Fresh Lime',
    description: 'Energetic yellow-green',
    primaryColor: '#65a30d',
    colorFamily: 'yellow-green',
    tags: ['fresh', 'energetic'],
  },
  green: {
    id: 'green',
    name: 'Forest Green',
    description: 'Natural and balanced',
    primaryColor: '#16a34a',
    colorFamily: 'green',
    tags: ['natural', 'balanced'],
  },
  emerald: {
    id: 'emerald',
    name: 'Rich Emerald',
    description: 'Luxurious green tone',
    primaryColor: '#059669',
    colorFamily: 'green',
    tags: ['luxurious', 'sophisticated'],
  },
  teal: {
    id: 'teal',
    name: 'Ocean Teal',
    description: 'Calming blue-green',
    primaryColor: '#0d9488',
    colorFamily: 'blue-green',
    tags: ['calming', 'balanced'],
  },
  cyan: {
    id: 'cyan',
    name: 'Bright Cyan',
    description: 'Crisp and modern',
    primaryColor: '#0891b2',
    colorFamily: 'blue',
    tags: ['modern', 'crisp'],
  },
  sky: {
    id: 'sky',
    name: 'Sky Blue',
    description: 'Light and airy blue',
    primaryColor: '#0284c7',
    colorFamily: 'blue',
    tags: ['light', 'airy'],
  },
  slate: {
    id: 'slate',
    name: 'Neutral Slate',
    description: 'Professional gray tones',
    primaryColor: '#475569',
    colorFamily: 'gray',
    tags: ['professional', 'neutral', 'minimal'],
  },
};

/**
 * Get all available theme IDs
 */
export function getAvailableThemes(): string[] {
  return Object.keys(THEME_REGISTRY);
}

/**
 * Get metadata for a specific theme
 */
export function getThemeMetadata(themeId: string): ThemeMetadata | null {
  return THEME_REGISTRY[themeId] || null;
}

/**
 * Get all theme metadata
 */
export function getAllThemeMetadata(): ThemeMetadata[] {
  return Object.values(THEME_REGISTRY);
}

/**
 * Check if a theme exists
 */
export function isValidTheme(themeId: string): boolean {
  return themeId in THEME_REGISTRY;
}

/**
 * Get themes by tag
 */
export function getThemesByTag(tag: string): ThemeMetadata[] {
  return Object.values(THEME_REGISTRY).filter(theme =>
    theme.tags.includes(tag)
  );
}

/**
 * Get themes by color family
 */
export function getThemesByColorFamily(family: string): ThemeMetadata[] {
  return Object.values(THEME_REGISTRY).filter(theme =>
    theme.colorFamily === family
  );
}
