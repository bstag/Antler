import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeAddBaseUrl from './src/lib/rehype-add-base-url.mjs';

export default defineConfig({
  output: 'static',

  integrations: [
    react()
  ],

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
