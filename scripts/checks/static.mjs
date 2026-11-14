// Static checks 1–5 (no browser). Each returns { id, name, fails: [], warns: [], passes: n }.
import fs from 'node:fs';
import path from 'node:path';
import { walkHtml, loadPage, meta, jsonLd, norm, decode, snapshot, loadsAds, isRedirect } from './lib.mjs';

const mk = (id, name) => ({ id, name, fails: [], warns: [], passes: 0 });

// ---------- allowlist ----------
export function makeAllow(entries) {
  const used = new Set();
  const allowed = (d) => entries.find((a, i) => {
    if (a.check && a.check !== d.check) return false;
    if (a.kind && a.kind !== d.kind) return false;
    if (a.field && a.field !== d.field) return false;
    if (a.url && !new RegExp(a.url).test(d.page)) return false;
    if (a.value && !new RegExp(a.value).test(String(d.value ?? ''))) return false;
    if (a.path && !new RegExp(a.path).test(String(d.path ?? ''))) return false;
    used.add(i);
    return true;
  });
  return { allowed, unused: () => entries.filter((_, i) => !used.has(i)) };
}

// ---------- 1. contract against live ----------
export function contract(dist, baseline, allow) {
  const r = mk(1, 'Contract against live (4dd50a3)');
  const cur = snapshot(dist);
  const base = baseline.pages;
  const push = (d) => { if (allow.allowed(d)) r.allowed = (r.allowed || 0) + 1; else r.fails.push(d); };
  for (const page of Object.keys(cur)) if (!base[page]) push({ check: 'contract', page, kind: 'pageAdded', field: 'page', value: page });
  for (const page of Object.keys(base)) {
    const b = base[page], c = cur[page];
    if (!c) { push({ check: 'contract', page, kind: 'pageRemoved', field: 'page', value: page }); continue; }
    let ok = true;
    for (const f of ['title', 'description', 'canonical', 'robots', 'ads']) {
      if (b[f] !== c[f]) { ok = false; push({ check: 'contract', page, kind: 'changed', field: f, value: `${b[f]} -> ${c[f]}` }); }
    }
    for (const f of ['rm', 'pct', 'phones']) {
      const bs = new Set(b[f]), cs = new Set(c[f]);
      for (const v of b[f]) if (!cs.has(v)) { ok = false; push({ check: 'contract', page, kind: 'removed', field: f, value: v }); }
      for (const v of c[f]) if (!bs.has(v)) { ok = false; push({ check: 'contract', page, kind: 'added', field: f, value: v }); }
    }
    for (const p of new Set([...Object.keys(b.jsonld), ...Object.keys(c.jsonld)])) {
      if (b.jsonld[p] !== c.jsonld[p]) { ok = false; push({ check: 'contract', page, kind: 'changed', field: 'jsonld', path: p, value: `${b.jsonld[p] ?? '(none)'} -> ${c.jsonld[p] ?? '(none)'}` }); }
    }
    if (ok) r.passes++;
  }
  return { r, cur };
}

// ---------- 2. ads and indexing ----------
export function adsIndexing(dist, baseline, pages) {
  const r = mk(2, 'Ads and indexing');
  const baseAds = new Set(Object.entries(baseline.pages).filter(([, p]) => p.ads).map(([u]) => u));
  const curAds = new Set();
  const sitemap = new Set();
  for (const f of fs.readdirSync(dist).filter((f) => /^sitemap.*\.xml$/.test(f) && f !== 'sitemap-index.xml' && fs.statSync(path.join(dist, f)).isFile())) {
    for (const m of fs.readFileSync(path.join(dist, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const u = new URL(m[1]); if (!u.pathname.endsWith('.xml')) sitemap.add(u.pathname);
    }
  }
  for (const { url, html, root } of pages) {
    if (loadsAds(html)) curAds.add(url);
    const robots = meta(root, 'robots') || '';
    const content = !isRedirect(html) && url !== '/404.html';
    if (content) {
      if (meta(root, 'google-adsense-account')) r.passes++; else r.fails.push({ page: url, check: 'adsense-account meta missing', source: 'src/layouts/Base.astro' });
    }
    if (/^\/negeri\/[^/]+\/$/.test(url)) {
      if (norm(robots) === 'noindex, follow') r.passes++; else r.fails.push({ page: url, check: 'state page robots', value: robots, source: 'src/pages/negeri/[state].astro' });
    }
    const noindex = /noindex/.test(robots) || !content;
    if (noindex && sitemap.has(url)) r.fails.push({ page: url, check: 'noindex page in sitemap', source: 'astro.config.mjs (sitemap filter)' });
    if (!noindex && !sitemap.has(url)) r.fails.push({ page: url, check: 'indexable page missing from sitemap', source: 'astro.config.mjs (sitemap filter)' });
  }
  for (const u of baseAds) if (!curAds.has(u)) r.fails.push({ page: u, check: 'AdSense no longer loads (baseline loads it)', source: 'src/layouts/Base.astro / ads gate' });
  for (const u of curAds) if (!baseAds.has(u)) r.fails.push({ page: u, check: 'AdSense now loads (baseline does not)', source: 'src/layouts/Base.astro / ads gate' });
  r.info = `AdSense pages: baseline ${baseAds.size}, current ${curAds.size}; sitemap URLs ${sitemap.size}`;
  return r;
}

// ---------- 3. structure ----------
function resolveTarget(dist, pathname) {
  let p = decodeURIComponent(pathname);
  const cands = p.endsWith('/') ? [p + 'index.html'] : [p, p + '/index.html', p + '.html'];
  for (const c of cands) { const f = path.join(dist, c); if (fs.existsSync(f) && fs.statSync(f).isFile()) return f; }
  return null;
}
export function structure(dist, pages, idsByFile) {
  const r = mk(3, 'Structure');
  for (const { url, file, root, visible } of pages) {
    if (url === '/404.html' || isRedirect(root.toString())) continue;
    const errs = [];
    const html = root.querySelector('html');
    if (html?.getAttribute('lang') !== 'ms') errs.push({ check: 'lang', value: html?.getAttribute('lang') });
    const h1 = root.querySelectorAll('h1');
    if (h1.length !== 1) errs.push({ check: 'h1 count', value: h1.length });
    let prev = 0;
    for (const h of root.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
      const lvl = +h.tagName[1];
      if (prev && lvl > prev + 1) errs.push({ check: 'skipped heading level', value: `h${prev} -> h${lvl} "${norm(h.textContent).slice(0, 50)}"` });
      prev = lvl;
    }
    for (const img of root.querySelectorAll('img')) {
      const miss = ['alt', 'width', 'height'].filter((a) => !img.hasAttribute(a));
      if (miss.length) errs.push({ check: 'img missing ' + miss.join('/'), value: img.getAttribute('src') });
    }
    const ids = idsByFile.get(file);
    const seen = new Map();
    for (const el of root.querySelectorAll('[id]')) seen.set(el.id, (seen.get(el.id) || 0) + 1);
    for (const [id, n] of seen) if (n > 1) errs.push({ check: 'duplicate id', value: `${id} ×${n}` });
    for (const a of root.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (/^(mailto:|tel:|javascript:|data:)/.test(href)) continue;
      let u;
      try { u = new URL(href, 'https://insurans.co' + url); } catch { errs.push({ check: 'bad href', value: href }); continue; }
      if (u.hostname !== 'insurans.co' && u.hostname !== 'www.insurans.co') continue;
      const target = resolveTarget(dist, u.pathname);
      if (!target) { errs.push({ check: 'broken internal link', value: href }); continue; }
      if (u.hash && u.hash.length > 1) {
        const tid = decodeURIComponent(u.hash.slice(1));
        const tids = idsByFile.get(target) || (target.endsWith('.html') ? collectIds(target) : new Set());
        if (!tids.has(tid)) errs.push({ check: 'missing #fragment target', value: href });
      }
    }
    const ld = jsonLd(root);
    for (const e of ld.errors) errs.push({ check: 'JSON-LD does not parse', value: e });
    // Inline tags next to punctuation leave a stray space once tags are stripped ("lain</em>." -> "lain .");
    // compare with spaces around punctuation removed on both sides.
    const tight = (s) => s.replace(/\s+([.,;:!?)\]])/g, '$1').replace(/([(\[])\s+/g, '$1');
    const vis = tight(norm(visible).toLowerCase());
    const strip = (s) => tight(norm(decode(String(s || '').replace(/<[^>]+>/g, ' '))).toLowerCase());
    for (const b of ld.blocks.flatMap((b) => (b['@graph'] ? b['@graph'] : [b]))) {
      if (b['@type'] !== 'FAQPage') continue;
      for (const q of b.mainEntity || []) {
        const qn = strip(q.name), an = strip(q.acceptedAnswer?.text);
        if (!vis.includes(qn)) errs.push({ check: 'FAQ question not visible verbatim', value: qn.slice(0, 80) });
        if (!vis.includes(an)) errs.push({ check: 'FAQ answer not visible verbatim', value: `${qn.slice(0, 50)} :: ${an.slice(0, 80)}` });
      }
    }
    void ids;
    if (errs.length) r.fails.push(...errs.map((e) => ({ page: url, ...e }))); else r.passes++;
  }
  return r;
}
function collectIds(file) {
  const s = new Set();
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)) s.add(m[1]);
  return s;
}

// ---------- 4. copy hygiene ----------
const BAD = [
  [/\bTODO\b/, 'TODO'], [/\bTBD\b/, 'TBD'], [/lorem/i, 'lorem'], [/\bundefined\b/, 'undefined'], [/\bNaN\b/, 'NaN'],
  [/\[object/, '[object'], [/RM\s?—/, 'RM —'], [/[{}]/, 'raw { or }'], [/(?<!\.)\.\.(?!\.)/, 'doubled full stop'],
  [/\basAt\b/, 'asAt'], [/figureVerified/, 'figureVerified'],
];
const EN = ['Free Tool', 'Related tools', 'Flow:', 'Rule of thumb'];
export function copyHygiene(pages) {
  const r = mk(4, 'Copy hygiene');
  for (const { url, root, visible } of pages) {
    let bad = false;
    for (const [re, label] of BAD) {
      const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
      for (const m of visible.matchAll(g)) {
        bad = true;
        r.fails.push({ page: url, check: label, value: visible.slice(Math.max(0, m.index - 40), m.index + 40) });
      }
    }
    if (!url.startsWith('/insurans-online/')) {
      for (const a of root.querySelectorAll('a[href]')) {
        const h = a.getAttribute('href');
        if (/bjak\.my|policystreet\.com|fincrew/i.test(h)) { bad = true; r.fails.push({ page: url, check: 'aggregator link outside /insurans-online/', value: h }); }
      }
    }
    for (const w of EN) if (visible.includes(w)) r.warns.push({ page: url, check: 'English leftover', value: w });
    for (const m of visible.matchAll(/\b20\d\d-\d\d-\d\d\b/g)) r.warns.push({ page: url, check: 'ISO date in visible text', value: visible.slice(Math.max(0, m.index - 30), m.index + 20) });
    if (!bad) r.passes++;
  }
  return r;
}

// ---------- 5. photo credits ----------
export function photoCredits(dist, pages, repo) {
  const r = mk(5, 'Photo credits');
  const data = JSON.parse(fs.readFileSync(path.join(repo, 'src/data/car-photos.json'), 'utf8'));
  const bySrc = new Map();
  for (const rec of data) for (const k of ['src400', 'src800', 'src']) if (rec[k]) bySrc.set(rec[k], rec);
  const used = new Map(); // src -> pages
  for (const { url, root } of pages) {
    const srcs = new Set();
    for (const el of root.querySelectorAll('img, source')) {
      for (const v of [el.getAttribute('src'), ...(el.getAttribute('srcset') || '').split(',').map((x) => x.trim().split(/\s+/)[0])]) {
        if (v && /^\/images\/kereta\/.+\.webp$/.test(v)) srcs.add(v);
      }
    }
    if (!srcs.size) continue;
    let ok = true;
    const html = root.toString();
    for (const s of srcs) {
      used.set(s, [...(used.get(s) || []), url]);
      const rec = bySrc.get(s);
      const c = rec?.credit;
      if (!c || !c.author || !c.licence || !c.source) { ok = false; r.fails.push({ page: url, check: 'photo without author/licence/source record', value: s, source: 'src/data/car-photos.json' }); continue; }
      if (url !== '/kredit-foto/' && !(c.licenceUrl && html.includes(`href="${c.licenceUrl}`))) { ok = false; r.fails.push({ page: url, check: 'no credit linking the licence on the photo page', value: `${s} (${c.licenceUrl})`, source: 'src/components/edisi (car photo credit)' }); }
    }
    if (ok) r.passes++;
  }
  const kf = pages.find((p) => p.url === '/kredit-foto/');
  if (!kf) r.fails.push({ page: '/kredit-foto/', check: 'credits page missing' });
  else {
    const html = kf.root.toString();
    const slugs = new Set([...used.keys()].map((s) => bySrc.get(s)?.slug).filter(Boolean));
    for (const slug of slugs) {
      const rec = data.find((d) => d.slug === slug);
      if (!html.includes(rec.credit.source)) r.fails.push({ page: '/kredit-foto/', check: 'used photo not listed', value: slug, source: 'src/pages/kredit-foto.astro' });
      else r.passes++;
    }
  }
  r.info = `${used.size} photo files used`;
  return r;
}

export const isRedirectPage = isRedirect;
export function loadAll(dist) {
  const pages = walkHtml(dist).map(({ file, url }) => ({ file, url, ...loadPage(file) }));
  const idsByFile = new Map(pages.map((p) => [p.file, new Set(p.root.querySelectorAll('[id]').map((e) => e.id))]));
  return { pages, idsByFile };
}
