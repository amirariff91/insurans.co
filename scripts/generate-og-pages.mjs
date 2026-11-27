// Share cards (1200x630 PNG) for every indexable page that has no card of its own (it would otherwise share
// /og-default.png). Drawn in code from the page's own built HTML, so a card can only say what the page says:
// the H1, the family label (the breadcrumb under "Utama"), the insurer logo or wordmark tile shown by the H1, the
// page's lead figure with its label (PageAnswer), and "insurans.co". Tokens and fonts as in DESIGN.md; no photos.
// Writes public/og/pages/<path>.png and src/data/og-pages.json ({ "/path/": { image, alt } }), which
// src/layouts/Base.astro reads for pages that pass no ogImage.
// Run: bun run build && bun run assets:og:pages && bun run build   (the second build picks up the new cards)
// Pages that set their own ogImage (car models, comparisons, companies) are left alone.
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from '@shuding/opentype.js';
import satori from 'satori';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { DIREKTORI_FONTS_URL, DIREKTORI_FONT_SPECS, createSatoriFonts, loadFonts } from './lib/og-fonts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'og/pages');
const MANIFEST = path.join(ROOT, 'src/data/og-pages.json');
const WIDTH = 1200;
const HEIGHT = 630;
const X = 72;
const CONTENT_WIDTH = WIDTH - 2 * X;
const MAX_BYTES = 120 * 1024;
// The five design tokens (DESIGN.md), exactly.
const C = { paper: '#FFFFFF', ink: '#000000', mute: '#595959', mark: '#FFF3B0', magenta: '#D0106F' };

const el = (type, style, children) => ({ type, props: { style, children } });

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' };
const text = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
      ENTITIES[e] ?? (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : m))
    .replace(/\s+/g, ' ')
    .trim();

async function htmlFiles(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    if ((await stat(p)).isDirectory()) out.push(...(await htmlFiles(p)));
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

/** What the card may say, read from one built page; null when the page is not a candidate. */
function readPage(html, route) {
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) return null;
  const og = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];
  if (!og) return null;
  const ogPath = new URL(og).pathname;
  if (ogPath !== '/og-default.png' && !ogPath.startsWith('/og/pages/')) return null;
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!h1) return null;
  const title = text(h1[1]);
  const before = html.slice(html.indexOf('<main') > -1 ? html.indexOf('<main') : 0, h1.index);
  const nav = html.match(/<nav aria-label="Jejak navigasi"[\s\S]*?<\/nav>/)?.[0] ?? '';
  const crumbs = [...nav.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => text(m[1]).replace(/^›\s*/, ''));
  const family = crumbs.length >= 3 ? crumbs[1] : null;
  const logo = before.match(/<img class="lt-img"[^>]*src="([^"]+)"[^>]*alt="([^"]+)"/);
  const word = before.match(/<span class="lt-name"[^>]*>([\s\S]*?)<\/span>/);
  const leadV = html.match(/<p class="pa-lead-v"[^>]*>([\s\S]*?)<\/p>/);
  const leadL = html.match(/<p class="pa-lead-l"[^>]*>([\s\S]*?)<\/p>/);
  return {
    route,
    title,
    family,
    logo: logo ? { src: logo[1], alt: logo[2] } : null,
    wordmark: !logo && word ? text(word[1]) : null,
    lead: leadV ? { value: text(leadV[1]).replace(/\s/g, ''), label: leadL ? text(leadL[1]).replace(/\s*\[\d+\]/g, '').trim() : '' } : null,
  };
}

function wrap(str, font, size, max) {
  const lines = [];
  let line = '';
  for (const word of str.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && font.getAdvanceWidth(next, size) > max) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
function fit(str, font, sizes, max, maxLines) {
  for (const size of sizes) {
    const lines = wrap(str, font, size, max);
    if (lines.length <= maxLines && lines.every((l) => font.getAdvanceWidth(l, size) <= max)) return { size, lines };
  }
  throw new Error(`Does not fit: ${str}`);
}

/** A logo file from public/, as a PNG data URI with its fitted size inside the tile box. */
async function logoImage(src, boxW, boxH) {
  const file = path.join(PUBLIC, src.replace(/^\//, ''));
  const png = await sharp(await readFile(file), { density: 300 }).resize({ width: boxW * 2, height: boxH * 2, fit: 'inside' }).png().toBuffer();
  const meta = await sharp(png).metadata();
  const k = Math.min(boxW / meta.width, boxH / meta.height);
  return { uri: `data:image/png;base64,${png.toString('base64')}`, w: Math.round(meta.width * k), h: Math.round(meta.height * k) };
}

function card(p, fonts, logo) {
  const hasTop = !!(logo || p.wordmark || p.family);
  const titleTop = hasTop ? 196 : 112;
  const titleLines = p.lead ? 2 : 3;
  const t = fit(p.title, fonts.display, [88, 80, 72, 64, 56, 50, 44], CONTENT_WIDTH, titleLines);
  const top = [];
  if (logo) {
    top.push(el('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 248, height: 88, border: `2px solid ${C.ink}`, borderRadius: 8, backgroundColor: C.paper, marginRight: 28 }, [
      { type: 'img', props: { src: logo.uri, width: logo.w, height: logo.h, style: { width: logo.w, height: logo.h } } },
    ]));
  } else if (p.wordmark) {
    top.push(el('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 248, height: 88, padding: '0 24px', border: `2px solid ${C.ink}`, borderRadius: 8, backgroundColor: C.paper, marginRight: 28, fontFamily: 'Gabarito', fontWeight: 800, fontSize: 36, color: C.ink }, p.wordmark));
  }
  if (p.family) top.push(el('div', { display: 'flex', fontFamily: 'Figtree', fontWeight: 600, fontSize: 32, color: C.mute }, p.family));
  const children = [];
  if (hasTop) children.push(el('div', { display: 'flex', alignItems: 'center', position: 'absolute', left: X, top: 64, height: 88 }, top));
  children.push(el('div', { display: 'flex', flexDirection: 'column', position: 'absolute', left: X, top: titleTop, width: CONTENT_WIDTH },
    t.lines.map((l) => el('div', { fontFamily: 'Gabarito', fontWeight: 800, fontSize: t.size, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.ink, whiteSpace: 'nowrap' }, l))));
  if (p.lead) {
    const leadTop = titleTop + t.lines.length * t.size * 1.04 + 28;
    const value = el('div', { display: 'flex', backgroundColor: C.mark, padding: '4px 18px', borderRadius: 8, fontFamily: 'Gabarito', fontWeight: 800, fontSize: 64, lineHeight: 1.1, color: C.ink }, p.lead.value);
    const room = CONTENT_WIDTH - fonts.display.getAdvanceWidth(p.lead.value, 64) - 60;
    let inline = null;
    try { inline = fit(p.lead.label || ' ', fonts.text, [30, 26], room, 1); } catch { /* label goes under the figure */ }
    const label = inline ?? fit(p.lead.label || ' ', fonts.text, [30, 26, 22], CONTENT_WIDTH, 1);
    children.push(el('div', { display: 'flex', flexDirection: inline ? 'row' : 'column', alignItems: inline ? 'center' : 'flex-start', position: 'absolute', left: X, top: leadTop }, [
      value,
      el('div', { display: 'flex', margin: inline ? '0 0 0 24px' : '12px 0 0 0', fontFamily: 'Figtree', fontWeight: 400, fontSize: label.size, color: C.ink, whiteSpace: 'nowrap' }, label.lines[0]),
    ]));
  }
  children.push(el('div', { display: 'flex', alignItems: 'center', position: 'absolute', left: X, bottom: 56, fontFamily: 'Figtree', fontSize: 32 }, [
    el('div', { width: 26, height: 26, borderRadius: 13, backgroundColor: C.magenta, marginRight: 20 }),
    el('span', { fontWeight: 600, color: C.ink }, 'insurans.co'),
  ]));
  return el('div', { width: WIDTH, height: HEIGHT, display: 'flex', backgroundColor: C.paper, position: 'relative' }, children);
}

const fileFor = (route) => (route === '/' ? 'index.png' : `${route.replace(/^\/|\/$/g, '')}.png`);
const altFor = (p) =>
  [p.title, p.family, p.logo?.alt ?? (p.wordmark ? p.wordmark : null), p.lead ? `${p.lead.label}: ${p.lead.value}` : null]
    .filter(Boolean)
    .map((part) => String(part).replace(/[.\s]+$/, ''))
    .join('. ') + '.';

async function main() {
  const pages = [];
  for (const f of await htmlFiles(DIST)) {
    const rel = path.relative(DIST, path.dirname(f)).split(path.sep).join('/');
    const route = rel ? `/${rel}/` : '/';
    const p = readPage(await readFile(f, 'utf8'), route);
    if (p) pages.push(p);
  }
  if (pages.length === 0) throw new Error('No candidate pages in dist/: run `bun run build` first.');
  pages.sort((a, b) => a.route.localeCompare(b.route));

  const buffers = await loadFonts(DIREKTORI_FONT_SPECS, DIREKTORI_FONTS_URL);
  const satoriFonts = createSatoriFonts(buffers, DIREKTORI_FONT_SPECS);
  const ab = (b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  const fonts = { display: opentype.parse(ab(buffers[0])), text: opentype.parse(ab(buffers[1])) };

  await rm(OUT, { recursive: true, force: true });
  const manifest = {};
  let total = 0;
  let largest = 0;
  for (const p of pages) {
    const logo = p.logo ? await logoImage(p.logo.src, 216, 64) : null;
    const svg = await satori(card(p, fonts, logo), { width: WIDTH, height: HEIGHT, fonts: satoriFonts });
    const raw = new Resvg(svg).render().asPng();
    // Palette PNG keeps flat cards small (well under the 120 KB cap).
    const png = await sharp(raw).png({ palette: true, colours: 64, compressionLevel: 9 }).toBuffer();
    if (png.length > MAX_BYTES) throw new Error(`${p.route}: card is ${png.length} bytes (cap ${MAX_BYTES})`);
    const out = path.join(OUT, fileFor(p.route));
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, png);
    total += png.length;
    largest = Math.max(largest, png.length);
    manifest[p.route] = { image: `/og/pages/${fileFor(p.route)}`, alt: altFor(p) };
  }
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 1)}\n`);
  console.log(`Generated ${pages.length} page share cards (total ${total} bytes, largest ${largest} bytes).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
