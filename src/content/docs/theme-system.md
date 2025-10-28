---
title: "Theme System"
description: "Complete guide to Antler's 16-theme system for both static sites and admin interface"
group: "Advanced"
order: 1
---
Antler features a comprehensive theme system with 16 built-in color themes, supporting both light and dark modes. The system works seamlessly across both the static production site and the admin interface, providing consistent theming throughout your entire application.

## Overview

The theme system consists of:

- **16 Color Themes**: Amber, Blue, Cyan, Emerald, Gray, Green, Indigo, Lime, Orange, Pink, Purple, Red, Rose, Sky, Teal, and Yellow
- **Dual Mode Support**: Light and dark mode for each theme
- **Universal Coverage**: Works on both static site and admin interface
- **User Preferences**: Persistent theme selection with localStorage
- **FOUC Prevention**: Flash of Unstyled Content prevention
- **CSS Variables**: Theme-aware custom properties for consistent styling

## Theme Architecture

### Core Components

1. **Theme Registry** (`src/utils/theme-registry.ts`)
   - Defines all 16 available themes
   - Provides theme metadata and validation

2. **Theme Loader** (`src/utils/theme-loader.ts`)
   - Handles dynamic theme switching
   - Manages localStorage persistence
   - Prevents FOUC with initialization scripts

3. **Theme Stylesheets** (`src/styles/themes/`)
   - Individual CSS files for each theme
   - CSS custom properties for consistent theming
   - Dark mode variants using `[data-theme="dark"]` selector

4. **Theme Components**
   - `ThemeToggle.tsx`: Dark/light mode switcher
   - Settings page: Complete theme customization interface

### Theme Structure

Each theme defines CSS custom properties for consistent styling:

```css
/* Example: theme-blue.css */
:root {
  --theme-primary: #3b82f6;
  --theme-primary-dark: #1d4ed8;
  --theme-primary-light: #60a5fa;
  --theme-secondary: #64748b;
  --theme-accent: #f59e0b;
  
  /* Background colors */
  --theme-bg-primary: #ffffff;
  --theme-bg-secondary: #f8fafc;
  --theme-bg-tertiary: #f1f5f9;
  
  /* Text colors */
  --theme-text-primary: #0f172a;
  --theme-text-secondary: #475569;
  --theme-text-muted: #64748b;
  
  /* Border and surface colors */
  --theme-border: #e2e8f0;
  --theme-surface: #ffffff;
  --theme-surface-hover: #f8fafc;
}

[data-theme="dark"] {
  --theme-primary: #60a5fa;
  --theme-bg-primary: #0f172a;
  --theme-bg-secondary: #1e293b;
  --theme-text-primary: #f8fafc;
  /* ... dark mode variants */
}
```

## Static Site Integration

### Automatic Theme Loading

The static site automatically loads themes through `BaseLayout.astro`:

```astro
---
// BaseLayout.astro
import siteConfig from '../site.config.json';

const defaultTheme = siteConfig.customization?.theme?.default || 'blue';
---

<html lang="en">
  <head>
    <!-- Dynamic theme loading -->
    <link 
      id="theme-stylesheet" 
      rel="stylesheet" 
      href={`/src/styles/themes/theme-${defaultTheme}.css`}
    />
    
    <!-- FOUC prevention script -->
    <script is:inline>
      (function() {
        // Initialize theme before page render
        const savedTheme = localStorage.getItem('selectedTheme') || 'blue';
        const savedMode = localStorage.getItem('theme') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Load theme stylesheet
        const themeLink = document.getElementById('theme-stylesheet');
        if (themeLink) {
          themeLink.href = `/src/styles/themes/theme-${savedTheme}.css`;
        }
        
        // Apply dark mode
        if (savedMode === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### User Theme Selection

Users can customize themes through the `/settings` page:

1. **Color Theme Selection**: Grid of all 16 available themes
2. **Dark Mode Toggle**: Switch between light and dark modes
3. **Reset to Default**: Restore site's default theme
4. **Live Preview**: Instant theme switching without page reload

## Admin Interface Integration

### Admin Theme Loading

The admin interface supports the same theme system with slight variations for server-side rendering:

```astro
<!-- src/pages/admin/index.astro -->
<html lang="en">
  <head>
    <link 
      id="theme-stylesheet" 
      rel="stylesheet" 
      href="/src/styles/themes/theme-blue.css"
    />
    
    <script is:inline>
      // Same FOUC prevention as static site
      (function() {
        const savedTheme = localStorage.getItem('selectedTheme') || 'blue';
        const savedMode = localStorage.getItem('theme') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        const themeLink = document.getElementById('theme-stylesheet');
        if (themeLink) {
          themeLink.href = `/src/styles/themes/theme-${savedTheme}.css`;
        }
        
        if (savedMode === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
  </head>
</html>
```

### Admin-Specific Styling

The admin interface includes additional global styles for optimal user experience:

```typescript
// AdminApp.tsx - Global admin styles
const globalStyles = `
  body {
    background-color: var(--theme-bg-secondary);
    color: var(--theme-text-primary);
  }
  
  [data-theme="dark"] body {
    background-color: var(--theme-bg-primary);
  }
  
  /* Custom scrollbar theming */
  ::-webkit-scrollbar-thumb {
    background-color: var(--theme-border);
  }
  
  [data-theme="dark"] ::-webkit-scrollbar-thumb {
    background-color: var(--theme-text-muted);
  }
`;
```

## Available Themes

| Theme | Primary Color | Description |
|-------|---------------|-------------|
| Amber | `#f59e0b` | Warm golden yellow |
| Blue | `#3b82f6` | Classic blue (default) |
| Cyan | `#06b6d4` | Bright cyan |
| Emerald | `#10b981` | Rich emerald green |
| Gray | `#6b7280` | Neutral gray |
| Green | `#22c55e` | Vibrant green |
| Indigo | `#6366f1` | Deep indigo |
| Lime | `#84cc16` | Bright lime green |
| Orange | `#f97316` | Vibrant orange |
| Pink | `#ec4899` | Bright pink |
| Purple | `#a855f7` | Rich purple |
| Red | `#ef4444` | Bold red |
| Rose | `#f43f5e` | Soft rose |
| Sky | `#0ea5e9` | Light sky blue |
| Teal | `#14b8a6` | Balanced teal |
| Yellow | `#eab308` | Bright yellow |

## User Guide

### Changing Themes

**For End Users:**

1. Navigate to `/settings` on your site
2. Select a color theme from the grid
3. Toggle dark/light mode as desired
4. Changes are saved automatically

**Theme Persistence:**
- Selections are saved to `localStorage`
- Themes persist across browser sessions
- System dark mode preference is respected by default

### Theme Switching Behavior

- **Instant Application**: Theme changes apply immediately without page reload
- **Cross-Page Consistency**: Theme selection persists across all pages
- **Admin Sync**: Theme changes in the main site apply to admin interface
- **Fallback Handling**: Defaults to site's configured theme if localStorage is unavailable

## Developer Guide

### Creating Custom Themes

1. **Create Theme Stylesheet**:
   ```css
   /* src/styles/themes/theme-custom.css */
   :root {
     --theme-primary: #your-primary-color;
     --theme-primary-dark: #your-primary-dark;
     --theme-primary-light: #your-primary-light;
     /* Define all required CSS variables */
   }
   
   [data-theme="dark"] {
     /* Dark mode variants */
   }
   ```

2. **Register Theme**:
   ```typescript
   // src/utils/theme-registry.ts
   export const themes = [
     // ... existing themes
     {
       id: 'custom',
       name: 'Custom',
       primary: '#your-primary-color',
       description: 'Your custom theme'
     }
   ];
   ```

3. **Update Site Configuration**:
   ```json
   // site.config.json
   {
     "customization": {
       "theme": {
         "default": "custom"
       }
     }
   }
   ```

### Using Theme Variables

**In CSS:**
```css
.my-component {
  background-color: var(--theme-bg-primary);
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-border);
}

.my-component:hover {
  background-color: var(--theme-surface-hover);
}
```

**In Components:**
```astro
<!-- Astro component -->
<div class="bg-theme-primary text-white p-4">
  <h2 style="color: var(--theme-text-primary)">Themed Content</h2>
</div>
```

```tsx
// React component
const ThemedButton = () => (
  <button 
    style={{
      backgroundColor: 'var(--theme-primary)',
      color: 'var(--theme-bg-primary)'
    }}
  >
    Themed Button
  </button>
);
```

### Theme-Aware Tailwind Classes

The system integrates with Tailwind CSS for responsive, theme-aware styling:

```html
<!-- Light/dark mode responsive -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content that adapts to dark mode
</div>

<!-- Using theme variables with Tailwind -->
<div class="bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]">
  Theme-aware content
</div>
```

## Configuration

### Site-Level Configuration

Configure default theme in `site.config.json`:

```json
{
  "customization": {
    "theme": {
      "default": "blue",
      "allowUserSelection": true,
      "darkModeDefault": "system"
    }
  }
}
```

### Environment-Specific Themes

You can set different default themes for different environments:

```javascript
// astro.config.mjs
export default defineConfig({
  // ... other config
  vite: {
    define: {
      __DEFAULT_THEME__: JSON.stringify(
        process.env.NODE_ENV === 'production' ? 'blue' : 'purple'
      )
    }
  }
});
```

## Performance Considerations

### Optimization Features

- **CSS Loading**: Only one theme stylesheet loaded at a time
- **FOUC Prevention**: Inline scripts prevent flash of unstyled content
- **Lazy Loading**: Theme stylesheets are swapped dynamically
- **Caching**: Browser caches theme stylesheets for faster subsequent loads

### Best Practices

1. **Minimize Custom Properties**: Only define necessary CSS variables
2. **Use Semantic Names**: Choose descriptive variable names for maintainability
3. **Test All Themes**: Ensure your content works well with all 16 themes
4. **Consider Contrast**: Maintain accessibility standards across all themes

## Troubleshooting

### Common Issues

**Theme Not Loading:**
- Check that theme stylesheet exists in `src/styles/themes/`
- Verify theme ID matches registry entry
- Ensure localStorage permissions are available

**FOUC (Flash of Unstyled Content):**
- Confirm initialization script is present in page head
- Check that script runs before body content loads
- Verify CSS custom properties are defined

**Admin Theme Inconsistency:**
- Ensure all admin pages include theme loading script
- Check that `global.css` is imported in admin layouts
- Verify theme variables are used consistently

**Dark Mode Not Working:**
- Confirm `[data-theme="dark"]` selectors are present
- Check that dark mode toggle updates `data-theme` attribute
- Verify localStorage is saving dark mode preference

### Debug Mode

Enable theme debugging by adding to localStorage:

```javascript
localStorage.setItem('theme-debug', 'true');
```

This will log theme loading events to the browser console.

## Migration Guide

### From Legacy Theme System

If migrating from an older theme system:

1. **Backup Current Themes**: Save existing theme customizations
2. **Update CSS Variables**: Replace old variables with new theme variables
3. **Test All Pages**: Verify theme consistency across site and admin
4. **Update Documentation**: Inform users about new theme options

### Upgrading Themes

When adding new themes or updating existing ones:

1. **Maintain Backward Compatibility**: Keep existing theme IDs unchanged
2. **Test Thoroughly**: Verify all components work with new themes
3. **Update Registry**: Add new themes to theme registry
4. **Document Changes**: Update this documentation with new theme information

## API Reference

### Theme Loader Functions

```typescript
// Load a specific theme
loadTheme(themeId: string): void

// Get current theme
getCurrentTheme(): string

// Save theme preference
saveTheme(themeId: string): void

// Clear theme preference
clearTheme(): void

// Initialize theme system
initializeTheme(): void

// Dark mode functions
toggleDarkMode(): void
setDarkMode(enabled: boolean): void
isDarkMode(): boolean
```

### Theme Registry

```typescript
interface Theme {
  id: string;
  name: string;
  primary: string;
  description?: string;
}

// Get all available themes
getAvailableThemes(): Theme[]

// Validate theme ID
isValidTheme(themeId: string): boolean

// Get theme by ID
getTheme(themeId: string): Theme | undefined
```

This comprehensive theme system provides a robust foundation for customizing the appearance of both your static site and admin interface, ensuring a consistent and professional look across your entire Antler application.