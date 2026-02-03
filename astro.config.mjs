import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import rehypeAddBaseUrl from './src/lib/rehype-add-base-url.mjs';

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

  site: 'https://StagWare.com',
  base: '/Antler',
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    },
    rehypePlugins: [
      [rehypeAddBaseUrl, { base: '/Antler' }]
    ]
  },
  vite: {
    optimizeDeps: {
      exclude: ['supabase/supabase-js']
    }
  }
});
