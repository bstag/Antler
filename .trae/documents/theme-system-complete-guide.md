# Antler CMS Theme System - Complete Guide

## Overview

Antler CMS features a sophisticated theme system that provides 16+ built-in color themes with seamless switching capabilities. The system supports both site-wide defaults and user preferences, with full integration between development and production modes.

## Available Themes

### Color Theme Collection

The theme system includes a comprehensive collection of professionally designed color themes:

#### Blue Family
- **Blue** - Classic professional blue
- **Indigo** - Deep indigo for sophistication
- **Cyan** - Bright cyan for modern appeal
- **Sky** - Light and airy blue

#### Purple Family
- **Purple** - Rich purple for creativity
- **Violet** - Soft violet tones

#### Pink/Red Family
- **Pink** - Soft pink for warmth
- **Rose** - Elegant rose tones
- **Red** - Bold red for energy

#### Green Family
- **Green** - Natural green
- **Emerald** - Vibrant emerald
- **Lime** - Fresh lime green
- **Teal** - Sophisticated teal

#### Warm Tones
- **Orange** - Vibrant orange for friendliness
- **Amber** - Warm amber tones
- **Yellow** - Bright yellow for optimism

#### Neutral
- **Slate** - Professional gray tones

## Theme Architecture

### Theme Registry System

Each theme is defined with comprehensive metadata:

```typescript
interface ThemeMetadata {
  id: string;           // Unique theme identifier
  name: string;         // Display name
  description: string;  // Theme description
  primaryColor: string; // Hex color code
  colorFamily: string;  // Color family grouping
  tags: string[];       // Descriptive tags
}
```

### Theme Loading Mechanism

The system uses CSS file swapping for instant theme changes:

1. **CSS Generation**: Each theme has its own CSS file with Tailwind color variables
2. **Dynamic Loading**: Themes are loaded by swapping `<link>` elements
3. **Fallback System**: Automatic fallback to default theme if invalid theme requested
4. **Persistence**: User preferences saved to localStorage

## Configuration Levels

### 1. Site Default Theme

Configured in `site.config.json`:

```json
{
  "customization": {
    "theme": {
      "default": "blue",
      "allowUserOverride": true,
      "availableThemes": ["blue", "indigo", "purple", "green"]
    }
  }
}
```

### 2. User Preferences

- Stored in browser localStorage
- Overrides site default when `allowUserOverride` is true
- Persists across browser sessions
- Can be cleared to revert to site default

### 3. Runtime Theme Switching

Available through multiple interfaces:
- Admin interface theme settings
- Public site theme toggle (if enabled)
- Programmatic API calls

## Admin Interface Integration

### Theme Management Panel

Located at `/admin/theme-settings/`, provides:

- **Live Theme Preview**: See changes instantly
- **Theme Gallery**: Visual grid of all available themes
- **Site Default Configuration**: Set the default theme for all users
- **User Override Settings**: Control whether users can change themes
- **Available Themes Selection**: Choose which themes to make available

### Real-time Updates

- Changes apply immediately without page reload
- Live preview of theme changes
- Instant feedback on theme selection
- Automatic saving of preferences

## API Endpoints

### Theme Configuration API

#### Get Current Theme Configuration
```
GET /api/theme/current
```

Response:
```json
{
  "siteDefault": "blue",
  "userPreference": "purple",
  "active": "purple",
  "allowUserOverride": true,
  "availableThemes": ["blue", "indigo", "purple", "green"]
}
```

#### Update Site Default Theme
```
POST /api/theme/set-default
```

Request:
```json
{
  "theme": "indigo"
}
```

#### Get Theme Metadata
```
GET /api/theme/metadata
```

Response:
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
    }
  ],
  "count": 16
}
```

## Implementation Details

### Client-Side Theme Loading

```typescript
// Initialize theme on page load
function initializeTheme(): string {
  const themeName = getCurrentTheme();
  loadTheme(themeName);
  return themeName;
}

// Switch to new theme
function switchTheme(themeName: string, savePreference: boolean = true): void {
  loadTheme(themeName);
  if (savePreference) {
    saveUserPreference(themeName);
  }
}
```

### Theme CSS Structure

Each theme generates Tailwind CSS custom properties:

```css
:root {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-900: #1e3a8a;
}
```

### Static Site Integration

For production builds:
1. Site default theme is baked into HTML
2. Theme metadata embedded as JSON
3. Client-side switching still available
4. No server dependencies required

## Development vs Production

### Development Mode
- Full admin interface for theme management
- Real-time theme switching
- API endpoints for configuration
- Hot reloading support

### Production Mode
- Embedded theme configuration
- Client-side theme switching only
- Optimized CSS delivery
- No server dependencies

## Customization Options

### Adding New Themes

1. **Define Theme Metadata**:
```typescript
const customTheme: ThemeMetadata = {
  id: 'custom',
  name: 'Custom Theme',
  description: 'My custom color scheme',
  primaryColor: '#ff6b35',
  colorFamily: 'orange',
  tags: ['custom', 'unique']
};
```

2. **Generate CSS File**: Create corresponding CSS with Tailwind variables

3. **Register Theme**: Add to theme registry

### Theme Customization

- Modify existing theme colors
- Create theme variants
- Add custom CSS properties
- Integrate with design systems

## Best Practices

### Theme Selection
- Choose themes that match your brand
- Consider accessibility and contrast ratios
- Test themes across different content types
- Provide meaningful theme names and descriptions

### User Experience
- Enable user override for better personalization
- Provide visual theme previews
- Maintain consistent theme switching UI
- Consider system preference detection

### Performance
- Lazy load theme CSS files
- Cache theme preferences
- Minimize theme switching overhead
- Optimize CSS delivery

## Accessibility Considerations

### Color Contrast
- All themes meet WCAG AA contrast requirements
- High contrast options available
- Text remains readable across all themes

### User Preferences
- Respect system dark/light mode preferences
- Provide clear theme selection interface
- Maintain theme choice persistence

## Troubleshooting

### Common Issues

#### Theme Not Loading
- Check theme name spelling
- Verify theme is in available themes list
- Clear browser cache and localStorage
- Check console for CSS loading errors

#### Theme Not Persisting
- Verify localStorage is enabled
- Check `allowUserOverride` setting
- Ensure theme preference is being saved

#### Admin Theme Settings Not Working
- Confirm development server is running
- Check API endpoint availability
- Verify file permissions for config updates

### Debug Information

Enable theme debugging:
```javascript
localStorage.setItem('antler-theme-debug', 'true');
```

This comprehensive theme system provides professional-grade theming capabilities while maintaining simplicity and performance across both development and production environments.