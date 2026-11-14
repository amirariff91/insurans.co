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

export function rmFigures(text) {
  const s = new Set();
  // Canonical form: "RM330–670" (no spaces, en dash, no second "RM"), so "RM330 – RM670" and "RM 330-670" compare equal.
  const n = String.raw`\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?`;
  const re = new RegExp(String.raw`RM\s?(${n})(?:\s?[–-]\s?(?:RM\s?)?(${n}))?`, 'g');
  for (const m of text.matchAll(re)) s.add('RM' + m[1] + (m[2] ? '–' + m[2] : ''));
  return [...s].sort();
}
export function percents(text) {
  const s = new Set();
  for (const m of text.matchAll(/\d+(?:[.,]\d+)?\s?%/g)) s.add(m[0].replace(/\s/g, ''));
  return [...s].sort();
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

export function snapshot(dist) {
  const pages = {};
  for (const { file, url } of walkHtml(dist)) {
    const { html, root, visible } = loadPage(file);
    const ld = jsonLd(root);
    pages[url] = {
      title: norm(root.querySelector('title')?.textContent || ''),
      description: meta(root, 'description'),
      canonical: root.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
      robots: meta(root, 'robots'),
      jsonld: flattenLd(ld.blocks),
      rm: rmFigures(visible),
      pct: percents(visible),
      phones: phones(visible, root),
      ads: loadsAds(html),
    };
  }
  return pages;
}
