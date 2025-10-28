---
title: "Customization Guide"
description: "How to customize themes, layouts, and styling in Antler"
group: "Advanced"
order: 2
---
Antler is built with customization in mind. This guide covers how to modify themes, layouts, styling, and components to match your brand and requirements.

## Theme System

Antler features a comprehensive theme system with 16 built-in color themes, supporting both light and dark modes. The system works seamlessly across both the static production site and the admin interface.

> **📖 Complete Theme Documentation**: For detailed information about the theme system, including all 16 available themes, user customization, admin integration, and developer guides, see the [Theme System Documentation](./theme-system).

### Quick Overview

- **16 Color Themes**: Amber, Blue, Cyan, Emerald, Gray, Green, Indigo, Lime, Orange, Pink, Purple, Red, Rose, Sky, Teal, and Yellow
- **Universal Coverage**: Consistent theming across static site and admin interface
- **User Customization**: Theme selection available at `/settings`
- **CSS Variables**: Theme-aware custom properties for consistent styling
- **FOUC Prevention**: Flash of Unstyled Content prevention built-in

### Basic Theme Usage

Themes use CSS custom properties that automatically adapt to the selected color theme:

```css
/* Theme-aware styling */
.my-component {
  background-color: var(--theme-bg-primary);
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-border);
}

.my-component:hover {
  background-color: var(--theme-surface-hover);
}
```

### Quick Theme Customization

1. **Set Default Theme** in `site.config.json`:
   ```json
   {
     "customization": {
       "theme": {
         "default": "blue"
       }
     }
   }
   ```

2. **Use Theme Variables** in components:
   ```astro
   <div style="background-color: var(--theme-primary)">
     Themed content
   </div>
   ```

3. **Create Custom Themes** by adding new theme stylesheets to `src/styles/themes/`

## Layout Customization

### Base Layout Structure

The main layout structure is defined in `src/layouts/BaseLayout.astro`:

```astro
---
// BaseLayout.astro
export interface Props {
  title: string;
  description?: string;
  image?: string;
}

const { title, description, image } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Meta tags, styles, etc. -->
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Main Layout Components

The `src/layouts/MainLayout.astro` provides the standard page structure:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

export interface Props {
  title: string;
  description?: string;
}
---

<BaseLayout {...Astro.props}>
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</BaseLayout>
```

### Customizing Layouts

1. **Create Custom Layouts**:
   ```astro
   <!-- src/layouts/BlogLayout.astro -->
   ---
   import MainLayout from './MainLayout.astro';
   
   export interface Props {
     title: string;
     description?: string;
     author?: string;
     publishDate?: Date;
   }
   
   const { title, description, author, publishDate } = Astro.props;
   ---
   
   <MainLayout title={title} description={description}>
     <article class="max-w-4xl mx-auto px-4 py-8">
       <header class="mb-8">
         <h1 class="text-4xl font-bold mb-4">{title}</h1>
         {author && (
           <p class="text-gray-600">By {author}</p>
         )}
         {publishDate && (
           <time class="text-gray-500">
             {publishDate.toLocaleDateString()}
           </time>
         )}
       </header>
       
       <div class="prose prose-lg max-w-none">
         <slot />
       </div>
     </article>
   </MainLayout>
   ```

2. **Modify Existing Layouts**:
   ```astro
   <!-- Add custom sections to MainLayout -->
   <BaseLayout {...Astro.props}>
     <Header />
     
     <!-- Add breadcrumbs -->
     <nav class="breadcrumbs">
       <slot name="breadcrumbs" />
     </nav>
     
     <main>
       <slot />
     </main>
     
     <!-- Add newsletter signup -->
     <section class="newsletter">
       <slot name="newsletter" />
     </section>
     
     <Footer />
   </BaseLayout>
   ```

## Component Customization

### Header Component

Customize the navigation and branding in `src/components/Header.astro`:

```astro
---
// Add your navigation items
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
---

<header class="bg-white dark:bg-gray-900 shadow-sm">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <a href="/" class="text-xl font-bold text-primary-600">
          Your Brand
        </a>
      </div>
      
      <!-- Navigation -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-4">
          {navItems.map((item) => (
            <a
              href={item.href}
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
      
      <!-- Theme toggle -->
      <ThemeToggle />
    </div>
  </nav>
</header>
```

### Footer Component

Customize the footer in `src/components/Footer.astro`:

```astro
<footer class="bg-gray-50 dark:bg-gray-900">
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Brand -->
      <div class="col-span-1 md:col-span-2">
        <h3 class="text-lg font-semibold mb-4">Your Brand</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Building amazing web experiences with modern technologies.
        </p>
        <!-- Social links -->
        <div class="flex space-x-4">
          <a href="#" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">Twitter</span>
            <!-- Twitter icon -->
          </a>
          <!-- More social links -->
        </div>
      </div>
      
      <!-- Quick links -->
      <div>
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Quick Links
        </h4>
        <ul class="space-y-2">
          <li><a href="/about" class="text-gray-600 hover:text-gray-900">About</a></li>
          <li><a href="/blog" class="text-gray-600 hover:text-gray-900">Blog</a></li>
          <li><a href="/projects" class="text-gray-600 hover:text-gray-900">Projects</a></li>
        </ul>
      </div>
      
      <!-- Contact -->
      <div>
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Contact
        </h4>
        <p class="text-gray-600 dark:text-gray-400">
          hello@yourdomain.com
        </p>
      </div>
    </div>
    
    <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <p class="text-center text-gray-500 dark:text-gray-400">
        © 2024 Your Brand. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

## Styling Customization

### Global Styles

Add custom global styles in `src/styles/global.css`:

```css
/* Custom typography */
.prose {
  @apply text-gray-800 dark:text-gray-200;
}

.prose h1 {
  @apply text-3xl font-bold text-gray-900 dark:text-white mb-6;
}

.prose h2 {
  @apply text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8;
}

/* Custom components */
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
```

### Component-Specific Styles

Create scoped styles for specific components:

```astro
<!-- src/components/BlogCard.astro -->
<div class="blog-card">
  <img src={image} alt={title} class="blog-card__image" />
  <div class="blog-card__content">
    <h3 class="blog-card__title">{title}</h3>
    <p class="blog-card__excerpt">{excerpt}</p>
  </div>
</div>

<style>
  .blog-card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105;
  }
  
  .blog-card__image {
    @apply w-full h-48 object-cover;
  }
  
  .blog-card__content {
    @apply p-6;
  }
  
  .blog-card__title {
    @apply text-xl font-semibold mb-2 text-gray-900 dark:text-white;
  }
  
  .blog-card__excerpt {
    @apply text-gray-600 dark:text-gray-300 line-clamp-3;
  }
</style>
```

## Advanced Customization

### Custom Fonts

1. **Add Font Files**:
   ```
   public/
   └── fonts/
       ├── custom-font.woff2
       └── custom-font.woff
   ```

2. **Define Font Face**:
   ```css
   /* src/styles/global.css */
   @font-face {
     font-family: 'CustomFont';
     src: url('/fonts/custom-font.woff2') format('woff2'),
          url('/fonts/custom-font.woff') format('woff');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```

3. **Update Tailwind Config**:
   ```javascript
   // tailwind.config.mjs
   export default {
     theme: {
       extend: {
         fontFamily: {
           'custom': ['CustomFont', 'sans-serif'],
         }
       }
     }
   }
   ```

### Custom Animations

Add custom animations to `src/styles/animations.css`:

```css
/* Scroll animations */
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Hover effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Loading animations */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### Responsive Design

Customize responsive breakpoints in Tailwind:

```javascript
// tailwind.config.mjs
export default {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

Use responsive utilities in components:

```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Responsive grid -->
</div>

<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
  <!-- Responsive typography -->
</h1>
```

## Performance Optimization

### CSS Optimization

1. **Purge Unused CSS**:
   ```javascript
   // tailwind.config.mjs
   export default {
     content: [
       './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
     ],
     // This automatically purges unused CSS
   }
   ```

2. **Critical CSS**:
   ```astro
   <!-- In BaseLayout.astro -->
   <style is:inline>
     /* Critical CSS for above-the-fold content */
     body { font-family: system-ui, sans-serif; }
     .hero { min-height: 100vh; }
   </style>
   ```

### Image Optimization

Use Astro's built-in image optimization:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Hero image"
  width={1200}
  height={600}
  format="webp"
  quality={80}
  class="w-full h-auto"
/>
```

## Accessibility Customization

### Focus Styles

```css
/* Custom focus styles */
.focus-visible:focus-visible {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900;
}

/* Skip to content link */
.skip-to-content {
  @apply absolute -top-10 left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200;
}

.skip-to-content:focus {
  @apply top-4;
}
```

### ARIA Labels and Semantic HTML

```astro
<nav aria-label="Main navigation">
  <ul role="list">
    {navItems.map((item) => (
      <li>
        <a
          href={item.href}
          aria-current={Astro.url.pathname === item.href ? 'page' : undefined}
        >
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

## Brand Customization Checklist

- [ ] Update colors in CSS custom properties
- [ ] Modify Tailwind color palette
- [ ] Replace logo and favicon
- [ ] Customize typography and fonts
- [ ] Update navigation structure
- [ ] Modify footer content and links
- [ ] Add custom animations and transitions
- [ ] Optimize for your brand's accessibility needs
- [ ] Test responsive design on all devices
- [ ] Validate theme switching functionality

## Testing Your Customizations

1. **Visual Testing**:
   ```bash
   npm run dev
   # Test in browser with different screen sizes
   ```

2. **Build Testing**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Accessibility Testing**:
   - Use browser dev tools accessibility panel
   - Test keyboard navigation
   - Verify color contrast ratios
   - Test with screen readers

4. **Performance Testing**:
   - Use Lighthouse for performance audits
   - Test loading times
   - Verify image optimization
   - Check CSS bundle size