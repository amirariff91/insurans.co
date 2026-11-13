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
  build: {
    // The whole site uses one ~6.8 KB (gzip) stylesheet; inlining it removes the only
    // render-blocking request on every page.
    inlineStylesheets: 'always',
  },
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
    '/companies/kurnia': '/companies/berjaya-sompo/',
    '/perbandingan/kurnia-vs-lonpac': '/perbandingan/berjaya-sompo-vs-lonpac/',
  },
});
