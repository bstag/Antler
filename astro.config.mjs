import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import { unified } from '@astrojs/markdown-remark';
import rehypeAddBaseUrl from './src/lib/rehype-add-base-url.mjs';

export default defineConfig({
  // we Have moved to astro 6 and are using static output
  output: 'static',

  integrations: [
    tailwind(),
    react()
  ],

  adapter: node({
    mode: 'standalone',
  }),

  site: 'https://StagWare.com',
  base: process.env.BASE_PATH || '/',

  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    },
    processor: unified({
      rehypePlugins: [
        [rehypeAddBaseUrl, { base: process.env.BASE_PATH || '/' }]
      ],
    }),
  },

  vite: {
    optimizeDeps: {
      exclude: ['supabase/supabase-js']
    }
  }
});
