import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// Static production build configuration
// This excludes all admin functionality for pure static deployment
export default defineConfig({
  output: 'static',
  integrations: [
    tailwind(),
    react()
  ],

  site: 'https://your-domain.com',
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },
  vite: {
    optimizeDeps: {
      exclude: ['@supabase/supabase-js']
    },
    server: {
      fs: {
        // Exclude admin directories from static builds
        allow: ['src'],
        deny: ['src/pages/admin', 'src/components/admin', 'src/lib/admin']
      }
    }
  }
});