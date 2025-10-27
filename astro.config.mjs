import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  // we Have moved to astro 5 and are using static output
  output: 'static',

  integrations: [
    tailwind(),
    react()
  ],

  adapter: node({
    mode: 'standalone',
  }),

  site: 'https://bstag.github.io/Antler',
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },
  vite: {
    optimizeDeps: {
      exclude: ['supabase/supabase-js']
    }
  }
});
