import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://insurans.co',
  integrations: [
    sitemap(),
    preact(),
  ],
  output: 'static',
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
  },
});
