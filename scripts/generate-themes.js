/**
 * Theme Generator Script
 * Generates CSS theme files for all color schemes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Theme definitions with Tailwind color palettes
const themes = {
  indigo: {
    name: 'Indigo',
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    accent: { main: '#8b5cf6', hover: '#7c3aed', active: '#6d28d9' },
  },
  pink: {
    name: 'Pink',
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724',
    },
    accent: { main: '#f472b6', hover: '#ec4899', active: '#db2777' },
  },
  rose: {
    name: 'Rose',
    primary: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519',
    },
    accent: { main: '#fb7185', hover: '#f43f5e', active: '#e11d48' },
  },
  red: {
    name: 'Red',
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    accent: { main: '#f87171', hover: '#ef4444', active: '#dc2626' },
  },
  orange: {
    name: 'Orange',
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
    accent: { main: '#fb923c', hover: '#f97316', active: '#ea580c' },
  },
  amber: {
    name: 'Amber',
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    accent: { main: '#fbbf24', hover: '#f59e0b', active: '#d97706' },
  },
  yellow: {
    name: 'Yellow',
    primary: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006',
    },
    accent: { main: '#facc15', hover: '#eab308', active: '#ca8a04' },
  },
  lime: {
    name: 'Lime',
    primary: {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#84cc16',
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#3f6212',
      900: '#365314',
      950: '#1a2e05',
    },
    accent: { main: '#a3e635', hover: '#84cc16', active: '#65a30d' },
  },
  green: {
    name: 'Green',
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    accent: { main: '#4ade80', hover: '#22c55e', active: '#16a34a' },
  },
  emerald: {
    name: 'Emerald',
    primary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    accent: { main: '#34d399', hover: '#10b981', active: '#059669' },
  },
  teal: {
    name: 'Teal',
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },
    accent: { main: '#2dd4bf', hover: '#14b8a6', active: '#0d9488' },
  },
  cyan: {
    name: 'Cyan',
    primary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344',
    },
    accent: { main: '#22d3ee', hover: '#06b6d4', active: '#0891b2' },
  },
  sky: {
    name: 'Sky',
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    accent: { main: '#38bdf8', hover: '#0ea5e9', active: '#0284c7' },
  },
  slate: {
    name: 'Slate',
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    accent: { main: '#64748b', hover: '#475569', active: '#334155' },
  },
};

// Secondary palette (Slate - same for all themes)
const secondary = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
};

function generateThemeCSS(themeName, themeData) {
  return `/* Theme: ${themeData.name} - Light & Dark Modes */
/* Based on Tailwind's ${themeData.name} color palette */

:root {
  /* Primary Color Palette - ${themeData.name} */
  --color-primary-50: ${themeData.primary[50]};
  --color-primary-100: ${themeData.primary[100]};
  --color-primary-200: ${themeData.primary[200]};
  --color-primary-300: ${themeData.primary[300]};
  --color-primary-400: ${themeData.primary[400]};
  --color-primary-500: ${themeData.primary[500]};
  --color-primary-600: ${themeData.primary[600]};
  --color-primary-700: ${themeData.primary[700]};
  --color-primary-800: ${themeData.primary[800]};
  --color-primary-900: ${themeData.primary[900]};
  --color-primary-950: ${themeData.primary[950]};

  /* Semantic Primary Colors */
  --color-primary: var(--color-primary-600);
  --color-primary-hover: var(--color-primary-700);
  --color-primary-active: var(--color-primary-800);
  --color-primary-light: var(--color-primary-500);
  --color-primary-lighter: var(--color-primary-400);
  --color-primary-dark: var(--color-primary-700);
  --color-primary-darker: var(--color-primary-800);

  /* Secondary Color Palette - Slate */
  --color-secondary-50: ${secondary[50]};
  --color-secondary-100: ${secondary[100]};
  --color-secondary-200: ${secondary[200]};
  --color-secondary-300: ${secondary[300]};
  --color-secondary-400: ${secondary[400]};
  --color-secondary-500: ${secondary[500]};
  --color-secondary-600: ${secondary[600]};
  --color-secondary-700: ${secondary[700]};
  --color-secondary-800: ${secondary[800]};
  --color-secondary-900: ${secondary[900]};
  --color-secondary-950: ${secondary[950]};

  /* Semantic Secondary Colors */
  --color-secondary: var(--color-secondary-500);
  --color-secondary-hover: var(--color-secondary-600);
  --color-secondary-active: var(--color-secondary-700);
  --color-secondary-light: var(--color-secondary-400);
  --color-secondary-lighter: var(--color-secondary-300);
  --color-secondary-dark: var(--color-secondary-600);
  --color-secondary-darker: var(--color-secondary-700);

  /* Background Colors */
  --color-background: #ffffff;
  --color-background-alt: var(--color-secondary-50);
  --color-surface: var(--color-secondary-50);
  --color-surface-elevated: #ffffff;
  --color-surface-hover: var(--color-secondary-100);
  --color-surface-active: var(--color-secondary-200);

  /* Text Colors */
  --color-text: var(--color-secondary-900);
  --color-text-secondary: var(--color-secondary-700);
  --color-text-muted: var(--color-secondary-500);
  --color-text-disabled: var(--color-secondary-400);
  --color-text-inverse: #ffffff;
  --color-text-on-primary: #ffffff;
  --color-text-on-secondary: #ffffff;

  /* Border Colors */
  --color-border: var(--color-secondary-200);
  --color-border-light: var(--color-secondary-100);
  --color-border-strong: var(--color-secondary-300);
  --color-border-focus: var(--color-primary-500);
  --color-border-error: #ef4444;
  --color-border-success: #10b981;
  --color-border-warning: #f59e0b;

  /* Accent Colors */
  --color-accent: ${themeData.accent.main};
  --color-accent-hover: ${themeData.accent.hover};
  --color-accent-active: ${themeData.accent.active};

  /* Status Colors */
  --color-success: #10b981;
  --color-success-light: #d1fae5;
  --color-success-dark: #047857;
  --color-error: #ef4444;
  --color-error-light: #fee2e2;
  --color-error-dark: #dc2626;
  --color-warning: #f59e0b;
  --color-warning-light: #fef3c7;
  --color-warning-dark: #d97706;
  --color-info: ${themeData.primary[500]};
  --color-info-light: ${themeData.primary[100]};
  --color-info-dark: ${themeData.primary[700]};

  /* Shadow Colors */
  --color-shadow: rgba(0, 0, 0, 0.1);
  --color-shadow-strong: rgba(0, 0, 0, 0.25);
  --color-shadow-light: rgba(0, 0, 0, 0.05);

  /* Overlay Colors */
  --color-overlay: rgba(0, 0, 0, 0.5);
  --color-overlay-light: rgba(0, 0, 0, 0.25);
  --color-overlay-strong: rgba(0, 0, 0, 0.75);
}

/* Dark Theme Overrides */
[data-theme="dark"] {
  /* Primary Color Palette (adjusted for dark theme) */
  --color-primary: var(--color-primary-500);
  --color-primary-hover: var(--color-primary-400);
  --color-primary-active: var(--color-primary-300);
  --color-primary-light: var(--color-primary-400);
  --color-primary-lighter: var(--color-primary-300);
  --color-primary-dark: var(--color-primary-600);
  --color-primary-darker: var(--color-primary-700);

  /* Secondary Colors (inverted for dark theme) */
  --color-secondary: var(--color-secondary-400);
  --color-secondary-hover: var(--color-secondary-300);
  --color-secondary-active: var(--color-secondary-200);
  --color-secondary-light: var(--color-secondary-300);
  --color-secondary-lighter: var(--color-secondary-200);
  --color-secondary-dark: var(--color-secondary-500);
  --color-secondary-darker: var(--color-secondary-600);

  /* Background Colors */
  --color-background: var(--color-secondary-900);
  --color-background-alt: var(--color-secondary-950);
  --color-surface: var(--color-secondary-800);
  --color-surface-elevated: var(--color-secondary-700);
  --color-surface-hover: var(--color-secondary-700);
  --color-surface-active: var(--color-secondary-600);

  /* Text Colors */
  --color-text: #ffffff;
  --color-text-secondary: var(--color-secondary-300);
  --color-text-muted: var(--color-secondary-400);
  --color-text-disabled: var(--color-secondary-500);
  --color-text-inverse: var(--color-secondary-900);
  --color-text-on-primary: #ffffff;
  --color-text-on-secondary: #ffffff;

  /* Border Colors */
  --color-border: var(--color-secondary-700);
  --color-border-light: var(--color-secondary-800);
  --color-border-strong: var(--color-secondary-600);
  --color-border-focus: var(--color-primary-400);
  --color-border-error: #f87171;
  --color-border-success: #34d399;
  --color-border-warning: #fbbf24;

  /* Accent Colors */
  --color-accent: ${themeData.accent.main};
  --color-accent-hover: ${themeData.accent.hover};
  --color-accent-active: ${themeData.accent.active};

  /* Status Colors (adjusted for dark theme) */
  --color-success: #34d399;
  --color-success-light: rgba(52, 211, 153, 0.1);
  --color-success-dark: #10b981;
  --color-error: #f87171;
  --color-error-light: rgba(248, 113, 113, 0.1);
  --color-error-dark: #ef4444;
  --color-warning: #fbbf24;
  --color-warning-light: rgba(251, 191, 36, 0.1);
  --color-warning-dark: #f59e0b;
  --color-info: ${themeData.primary[400]};
  --color-info-light: rgba(${hexToRgb(themeData.primary[400])}, 0.1);
  --color-info-dark: ${themeData.primary[500]};

  /* Shadow Colors */
  --color-shadow: rgba(0, 0, 0, 0.3);
  --color-shadow-strong: rgba(0, 0, 0, 0.5);
  --color-shadow-light: rgba(0, 0, 0, 0.1);

  /* Overlay Colors */
  --color-overlay: rgba(0, 0, 0, 0.7);
  --color-overlay-light: rgba(0, 0, 0, 0.4);
  --color-overlay-strong: rgba(0, 0, 0, 0.9);
}
`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

// Generate all theme files
const themesDir = path.join(__dirname, '..', 'src', 'styles', 'themes');

// Ensure directory exists
if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true });
}

// Generate each theme file
Object.entries(themes).forEach(([themeName, themeData]) => {
  const css = generateThemeCSS(themeName, themeData);
  const filePath = path.join(themesDir, `theme-${themeName}.css`);
  fs.writeFileSync(filePath, css);
  console.log(`✓ Generated: theme-${themeName}.css`);
});

console.log(`\n✓ All ${Object.keys(themes).length} theme files generated successfully!`);
