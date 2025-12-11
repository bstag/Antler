import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import rehypeAddBaseUrl from './src/lib/rehype-add-base-url.mjs';
import fs from 'node:fs';

// Read site.config.json for defaults
const siteConfig = JSON.parse(fs.readFileSync('./site.config.json', 'utf-8'));
const defaultSite = siteConfig.customization?.urls?.baseUrl || 'https://bstag.github.io';
const defaultBase = siteConfig.customization?.urls?.basePath || '/Antler';

// Allow environment variables to override
const site = process.env.SITE || defaultSite;
const base = process.env.BASE || defaultBase;

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

  site,
  base,
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    },
    rehypePlugins: [
      [rehypeAddBaseUrl, { base }]
    ]
  },
  vite: {
    optimizeDeps: {
      exclude: ['supabase/supabase-js']
    }
  }
});
