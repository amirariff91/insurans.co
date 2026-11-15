// Shared helpers for scripts/checks: page discovery, HTML parsing, visible text, figure extraction.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// node-html-parser is a transitive dependency of Astro (hoisted into node_modules). If it ever disappears,
// add it as a devDependency.
export const { parse } = require('node-html-parser');

export function walkHtml(dist) {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== '_astro') walk(p); } else if (e.name.endsWith('.html')) out.push(p);
    }
  };
  walk(dist);
  return out.sort().map((file) => ({ file, url: '/' + path.relative(dist, file).replace(/\\/g, '/').replace(/index\.html$/, '') }));
}

export const norm = (s) => (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

export function decode(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

/** Parse once; returns {root, html, visible, ...}. Visible text = body minus script/style/template/svg (noscript kept). */
export function loadPage(file) {
  const html = fs.readFileSync(file, 'utf8');
  const root = parse(html, { comment: false, blockTextElements: { script: true, style: true, noscript: true, pre: true } });
  const body = root.querySelector('body') || root;
  const clone = parse(body.toString(), { comment: false, blockTextElements: { script: true, style: true, noscript: true, pre: true } });
  for (const el of clone.querySelectorAll('script, style, template, svg')) el.remove();
  // noscript is parsed as raw text; strip its tags so its words count as visible (they are, without JS).
  let visible = clone.toString().replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<br\s*\/?>/gi, ' ').replace(/<\/(p|li|div|h[1-6]|td|th|dt|dd|section|tr)>/gi, ' $&');
  visible = norm(decode(visible.replace(/<[^>]+>/g, ' ')));
  return { html, root, visible };
}

export function meta(root, name) {
  const el = root.querySelector(`meta[name="${name}"]`);
  return el ? el.getAttribute('content') : null;
}

export function jsonLd(root) {
  const blocks = [];
  const errors = [];
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try { blocks.push(JSON.parse(s.textContent)); } catch (e) { errors.push(String(e.message).slice(0, 120)); }
  }
  return { blocks, errors };
}

/** Flatten JSON-LD blocks into path=value pairs; blocks are keyed by @type, so order does not matter. */
export function flattenLd(blocks) {
  const out = {};
  const seen = {};
  const rec = (v, p) => {
    if (Array.isArray(v)) v.forEach((x, i) => rec(x, `${p}[${i}]`));
    else if (v && typeof v === 'object') for (const k of Object.keys(v).sort()) rec(v[k], `${p}.${k}`);
    else out[p] = typeof v === 'string' ? norm(v) : v;
  };
  const expand = (b) => (b && b['@graph'] ? b['@graph'] : [b]);
  for (const b of blocks.flatMap(expand)) {
    const t = Array.isArray(b?.['@type']) ? b['@type'].join('+') : b?.['@type'] || '?';
    seen[t] = (seen[t] || 0) + 1;
    rec(b, seen[t] > 1 ? `${t}#${seen[t]}` : t);
  }
  return out;
}

// ---- figures, compared by VALUE: "RM22,000 – RM38,000", "RM22,000–38,000" and "RM 22,000-RM 38,000" are one figure;
// "RM50K-100K" and "RM50,000–100,000" are one figure; "RM280.00" and "RM280" are one figure. Ranges keep both ends.
const NUM = String.raw`\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?`;
const SUF = String.raw`(?:\s?(k|K|ribu|juta|million|bilion|billion)(?![A-Za-z]))?`;
const MULT = { k: 1e3, K: 1e3, ribu: 1e3, juta: 1e6, million: 1e6, bilion: 1e9, billion: 1e9 };
const RM_RE = new RegExp(String.raw`RM\s?(${NUM})${SUF}(?:\s?[–-]\s?(?:RM\s?)?(${NUM})${SUF})?`, 'g');
const fmtNum = (v) => v.toLocaleString('en-US', { maximumFractionDigits: 2 });
const val = (n, suf) => Math.round(parseFloat(n.replace(/,/g, '')) * (suf ? MULT[suf] : 1) * 100) / 100;
/** Every RM figure as canonical text, in order, duplicates kept: "RM330–670", "RM30,000,000,000". */
export function rmList(text) {
  const out = [];
  for (const m of text.matchAll(RM_RE)) {
    const [, a, sa, b, sb] = m;
    const lo = val(a, sa || (b ? sb : undefined)); // "RM50-100K": the second end's unit applies to both
    out.push('RM' + fmtNum(lo) + (b ? '–' + fmtNum(val(b, sb || sa)) : ''));
  }
  return out;
}
export const rmFigures = (text) => [...new Set(rmList(text))].sort();
// Percentages, ranges with both ends: "0.2%–0.5%", "5-20%", "5 – 20 %" -> "0.2–0.5%", "5–20%". A decimal comma counts as a point.
const P = String.raw`\d+(?:[.,]\d+)?`;
const PCT_RE = new RegExp(String.raw`(?<![\d.,])(${P})\s?(?:%\s?)?[–-]\s?(${P})\s?%|(?<![\d.,])(${P})\s?%`, 'g');
const pnum = (x) => String(parseFloat(x.replace(',', '.')));
export function pctList(text) {
  const out = [];
  for (const m of text.matchAll(PCT_RE)) out.push(m[3] ? pnum(m[3]) + '%' : pnum(m[1]) + '–' + pnum(m[2]) + '%');
  return out;
}
export const percents = (text) => [...new Set(pctList(text))].sort();
/** The multiset of figures in a text: RM amounts, percentages and any other number, each canonical. */
export function figureBag(text) {
  const t = String(text || '');
  const rest = t.replace(RM_RE, ' ').replace(PCT_RE, ' ');
  const bare = [...rest.matchAll(new RegExp(NUM, 'g'))].map((m) => fmtNum(parseFloat(m[0].replace(/,/g, ''))));
  return [...rmList(t), ...pctList(t), ...bare].sort();
}
export function phones(text, root) {
  const s = new Set();
  for (const m of text.matchAll(/(?:\+?60[\s-]?|\b0)1\d[\s-]?\d{3,4}[\s-]?\d{4}\b|(?:\+?60[\s-]?|\b0)[3-9][\s-]?\d{3,4}[\s-]?\d{4}\b|\b1[\s-]?[3789]00[\s-]?\d{2}[\s-]?\d{4}\b/g)) s.add(m[0].replace(/\D/g, ''));
  for (const a of root.querySelectorAll('a[href^="tel:"]')) s.add(a.getAttribute('href').replace(/\D/g, ''));
  return [...s].sort();
}
export const ADS_JS = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
export const loadsAds = (html) => html.replace(/<!--[\s\S]*?-->/g, '').includes(ADS_JS);
export const isRedirect = (html) => /http-equiv="refresh"/i.test(html);

/** keep: also return each page's visible text and parsed root (not stored in a baseline). */
export function snapshot(dist, keep = false) {
  const pages = {};
  for (const { file, url } of walkHtml(dist)) {
    const { html, root, visible } = loadPage(file);
    const ld = jsonLd(root);
    pages[url] = {
      title: norm(root.querySelector('title')?.textContent || ''),
      h1: norm(root.querySelector('h1')?.textContent || ''),
      description: meta(root, 'description'),
      canonical: root.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
      robots: meta(root, 'robots'),
      jsonld: flattenLd(ld.blocks),
      rm: rmFigures(visible),
      pct: percents(visible),
      phones: phones(visible, root),
      ads: loadsAds(html),
    };
    if (keep) Object.defineProperties(pages[url], { visible: { value: visible }, root: { value: root } });
  }
  return pages;
}
