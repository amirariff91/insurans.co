import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Sitemap <lastmod>: the content date the page itself declares, never the build time.
// 1. article:modified_time, 2. JSON-LD dateModified (both from the page's data, e.g. premiumReviewed or asAt),
// 3. for tool pages without either, the asAt of the data file their byline shows.
// Pages with no content date get no <lastmod>. Runs after the HTML is written, so it reads dist/.
const distDir = fileURLToPath(new URL('./dist/', import.meta.url));
const readJson = (file) => JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'));
const dataDatesByPath = {
  '/tools/kalkulator-insurans-rumah/': readJson('./src/data/home-insurance.json').asAt,
  '/tools/kalkulator-roadtax/': readJson('./src/data/roadtax-rates.json').asAt,
  '/tools/kalkulator-roadtax-motosikal/': readJson('./src/data/roadtax-motorcycle.json').asAt,
};
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function pageContentDate(url) {
  const path = new URL(url).pathname;
  const file = join(distDir, path, 'index.html');
  if (existsSync(file)) {
    const html = readFileSync(file, 'utf8');
    const date = html.match(/<meta property="article:modified_time" content="(\d{4}-\d{2}-\d{2})/)?.[1]
      ?? html.match(/"dateModified":"(\d{4}-\d{2}-\d{2})/)?.[1];
    if (date) return date;
  }
  const dataDate = dataDatesByPath[path];
  if (isoDate.test(dataDate ?? '')) return dataDate;
  // Every model page carries a content date. If one has none, the reader above no longer
  // matches the built HTML (output folder, attribute order or JSON spacing changed):
  // fail the build instead of silently dropping <lastmod> from the sitemap.
  if (/^\/car-insurance\/[^/]+\/$/.test(path)) {
    throw new Error(`sitemap lastmod: no content date found for ${path} (looked in ${file})`);
  }
  return undefined;
}

export default defineConfig({
  site: 'https://insurans.co',
  integrations: [
    sitemap({
      serialize(item) {
        const date = pageContentDate(item.url);
        return date ? { ...item, lastmod: date } : item;
      },
    }),
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
