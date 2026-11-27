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
  '/tools/kalkulator-roadtax-ev/': readJson('./src/data/roadtax-ev.json').asAt,
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
  // Every model page and Terkini page (index and items) carries a content date. If one has none, the
  // reader above no longer matches the built HTML (output folder, attribute order or JSON spacing changed):
  // fail the build instead of silently dropping <lastmod> from the sitemap.
  if (/^\/car-insurance\/[^/]+\/$/.test(path) || /^\/terkini\/([^/]+\/)?$/.test(path)) {
    throw new Error(`sitemap lastmod: no content date found for ${path} (looked in ${file})`);
  }
  return undefined;
}

// True when the built page at this path declares robots noindex. Runs after the HTML is written.
function builtPageIsNoindex(path) {
  const file = join(distDir, path, 'index.html');
  if (!existsSync(file)) throw new Error(`sitemap filter: no built page for ${path} (looked in ${file})`);
  return /<meta name="robots" content="noindex/.test(readFileSync(file, 'utf8'));
}

export default defineConfig({
  site: 'https://insurans.co',
  integrations: [
    sitemap({
      // Noindex pages stay reachable but leave the sitemap; each hub stays in it.
      // - The 16 /negeri/<state>/ pages: their facts live in the /negeri/ hub table.
      // - The /motorcycle-insurance/<product>/ pages: near-duplicates of each other; their facts live in the
      //   comparison table on /motorcycle-insurance/ (AdSense "low-value content" review, November 2026).
      // - /terkini/<entry>/ pages under TERKINI_INDEX_MIN_WORDS (src/lib/terkini.ts): too short to stand
      //   alone; /terkini/ lists and links them all. The word count is decided in the page, so this reads
      //   the built page's robots meta instead of repeating the rule.
      filter: (page) => {
        const path = new URL(page).pathname;
        if (/^\/negeri\/[^/]+\/$/.test(path)) return false;
        if (/^\/motorcycle-insurance\/[^/]+\/$/.test(path)) return false;
        if (/^\/terkini\/[^/]+\/$/.test(path)) return !builtPageIsNoindex(path);
        return true;
      },
      serialize(item) {
        const date = pageContentDate(item.url);
        // Content dates are Malaysian calendar dates: midnight MYT, not midnight UTC, so a page
        // dated today is never stamped eight hours in the future.
        return date ? { ...item, lastmod: `${date}T00:00:00+08:00` } : item;
      },
    }),
    preact(),
  ],
  output: 'static',
  // Astro 7 changed the default to 'jsx', which drops whitespace between text,
  // inline elements and expressions on separate lines (251 lost spaces on 81
  // pages here). Keep the Astro 6 HTML whitespace rules until the templates are
  // migrated; see docs/astro-7-upgrade.md.
  compressHTML: true,
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
