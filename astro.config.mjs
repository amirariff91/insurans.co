import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://insurans.co',
  integrations: [
    tailwind(),
    sitemap(),
    preact(),
  ],
  output: 'static',
});
