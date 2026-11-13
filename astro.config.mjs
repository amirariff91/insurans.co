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
  // Astro 7 changed the default to 'jsx', which drops whitespace between text,
  // inline elements and expressions on separate lines (251 lost spaces on 81
  // pages here). Keep the Astro 6 HTML whitespace rules until the templates are
  // migrated; see docs/astro-7-upgrade.md.
  compressHTML: true,
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
    '/companies/kurnia': '/companies/berjaya-sompo/',
    '/perbandingan/kurnia-vs-lonpac': '/perbandingan/berjaya-sompo-vs-lonpac/',
  },
});
