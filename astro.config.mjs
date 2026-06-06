import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeAddBaseUrl from './src/lib/rehype-add-base-url.mjs';

export default defineConfig({
  // we Have moved to astro 6 and are using static output
  output: 'static',

  integrations: [
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
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['supabase/supabase-js']
    }
  }
});
