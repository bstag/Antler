# Theme System - Static Site Compatible

## Overview
This theme system is designed to work in **both static and server modes**, with graceful degradation.

---

## 🌐 **Static Mode (Production)**

### What Works in Static Mode:
✅ **Theme Switching** - Users can switch between 16 color themes
✅ **Local Storage** - User preferences persist in browser
✅ **Dark/Light Mode** - Full dark mode support
✅ **No Server Required** - Works on any static host (GitHub Pages, Netlify, etc.)
✅ **No Flash** - Theme loads before page render (FOUC prevention)

### How It Works:
1. **Build Time**: Default theme is baked into HTML from `site.config.json`
2. **Runtime**: JavaScript loads user preference from localStorage
3. **Theme Files**: All 16 theme CSS files are included in the build
4. **Client-Side Only**: Theme switching happens entirely in the browser

### Limitations in Static Mode:
❌ **Cannot change site default** - Requires editing `site.config.json` and rebuilding
❌ **API endpoints don't work** - All server routes return 404
❌ **Admin "Save as Default" disabled** - Only user preferences work

---

## 🔧 **Development Mode (with Server)**

### Additional Features in Dev Mode:
✅ **API Endpoints** - `/api/theme/*` routes work
✅ **Admin Panel** - Full theme management interface
✅ **Save Site Default** - Update `site.config.json` via UI
✅ **Live Config Updates** - No need to manually edit JSON

### API Endpoints:
- `GET /api/theme/current` - Get theme config
- `POST /api/theme/set-default` - Update site default (admin only)
- `GET /api/theme/metadata` - Get all theme info

---

## 📁 File Structure

```
src/
├── styles/
│   ├── global.css                    # Base styles (no colors)
│   └── themes/                       # Theme CSS files
│       ├── theme-blue.css           # Default theme
│       ├── theme-purple.css         # Purple variant
│       └── ... (14 more themes)
├── lib/
│   └── theme/
│       ├── theme-registry.ts        # Theme metadata
│       ├── theme-loader.ts          # Client-side loader
│       └── theme-config-api.ts      # API wrapper (with static fallbacks)
└── pages/
    └── api/
        └── theme/                    # Server APIs (dev mode only)
            ├── current.ts
            ├── set-default.ts
            └── metadata.ts
```

---

## 🎨 Available Themes

16 color schemes based on Tailwind CSS palettes:

| Theme | Color | Best For |
|-------|-------|----------|
| Blue | #2563eb | Professional, default |
| Indigo | #4f46e5 | Sophisticated |
| Purple | #9333ea | Creative |
| Pink | #db2777 | Energetic |
| Rose | #e11d48 | Elegant |
| Red | #dc2626 | Bold |
| Orange | #ea580c | Warm |
| Amber | #d97706 | Rich |
| Yellow | #ca8a04 | Cheerful |
| Lime | #65a30d | Fresh |
| Green | #16a34a | Natural |
| Emerald | #059669 | Luxurious |
| Teal | #0d9488 | Calming |
| Cyan | #0891b2 | Modern |
| Sky | #0284c7 | Light |
| Slate | #475569 | Minimal |

---

## 🚀 Usage

### For Site Visitors (Static Mode):
```javascript
// Automatically available on all pages
// Theme switcher UI can be added anywhere

// Switch theme
localStorage.setItem('antler-selected-theme', 'purple');
location.reload(); // Or use theme-loader.ts functions

// Get current theme
const theme = localStorage.getItem('antler-selected-theme') || 'blue';
```

### For Developers:
```typescript
import { switchTheme, getCurrentTheme } from '@/lib/theme';

// Switch theme with live preview
switchTheme('purple', true); // true = save preference

// Get current theme
const currentTheme = getCurrentTheme();
```

### Changing Site Default:
**Static Mode:** Edit `site.config.json`:
```json
{
  "customization": {
    "theme": {
      "default": "purple"  // Change this
    }
  }
}
```
Then rebuild: `npm run build`

**Dev Mode:** Use admin panel "Save as Site Default" button

---

## 🎯 How Theme Loading Works

### 1. Build Time
- Astro reads `site.config.json`
- Default theme is injected into HTML
- All theme CSS files are included in build
- Config embedded as inline JSON

### 2. Page Load (Before Render)
```html
<script is:inline>
  // Runs IMMEDIATELY (before page renders)
  const userTheme = localStorage.getItem('antler-selected-theme');
  const defaultTheme = document.getElementById('theme-config').textContent;
  const activeTheme = userTheme || defaultTheme;

  // Load theme CSS
  document.getElementById('theme-stylesheet').href =
    `/src/styles/themes/theme-${activeTheme}.css`;
</script>
```

### 3. After Page Load
- React components can use `theme-loader.ts`
- Theme can be switched without page reload
- Preference saved to localStorage

---

## 🔒 Static Site Guarantees

✅ **Zero Server Dependencies**
- No Node.js required in production
- No database needed
- No API calls required

✅ **Works Everywhere**
- GitHub Pages ✓
- Netlify ✓
- Vercel ✓
- Any CDN ✓

✅ **Fast Performance**
- CSS files pre-generated
- No runtime compilation
- Cached by browser

---

## 🛠️ Maintenance

### Adding a New Theme:
1. Run theme generator: `node scripts/generate-themes.js`
2. Add theme to `site.config.json` availableThemes array
3. Add metadata to `src/lib/theme/theme-registry.ts`
4. Rebuild site

### Changing Colors:
Edit the theme file directly:
```css
/* src/styles/themes/theme-blue.css */
:root {
  --color-primary-600: #2563eb;  /* Change this */
}
```

---

## 📝 Notes

- **Dark Mode**: Independent of color theme (can have dark purple, light green, etc.)
- **Performance**: All 16 themes add ~200KB to build (gzipped ~50KB)
- **Browser Support**: Works in all modern browsers (CSS variables required)
- **Fallback**: Always defaults to 'blue' theme if anything fails

---

## 🐛 Troubleshooting

**Theme not changing?**
- Check localStorage: `localStorage.getItem('antler-selected-theme')`
- Clear cache and reload
- Check browser console for errors

**API not working?**
- Normal in static mode
- Use `npm run dev` for API features
- Check `output: 'static'` in astro.config.mjs

**Build errors?**
- Ensure all theme files exist in `src/styles/themes/`
- Validate `site.config.json` syntax
- Check theme name matches available themes list
