// Static checks 1–5 (no browser). Each returns { id, name, fails: [], warns: [], passes: n }.
import fs from 'node:fs';
import path from 'node:path';
import { walkHtml, loadPage, meta, jsonLd, norm, decode, snapshot, loadsAds, isRedirect, rmFigures } from './lib.mjs';
import { siteHelpers, derivedTexts } from './site-helpers.mjs';

const mk = (id, name) => ({ id, name, fails: [], warns: [], passes: 0 });

// ---------- allowlist ----------
// An entry matches a difference when every field it gives matches. Regex fields: url, path, value. Exact fields:
// old and new (the two sides of a `changed` difference), values (a list of exact added/removed values).
export function makeAllow(entries) {
  const used = new Set();
  const allowed = (d) => entries.find((a, i) => {
    if (a.check && a.check !== d.check) return false;
    if (a.kind && a.kind !== d.kind) return false;
    if (a.field && a.field !== d.field) return false;
    if (a.url && !new RegExp(a.url).test(d.page)) return false;
    if (a.value && !new RegExp(a.value).test(String(d.value ?? ''))) return false;
    if (a.path && !new RegExp(a.path).test(String(d.path ?? ''))) return false;
    if ('old' in a && a.old !== d.old) return false;
    if ('new' in a && a.new !== d.new) return false;
    if (a.values && !a.values.includes(d.value)) return false;
    used.add(i);
    return true;
  });
  return { allowed, unused: () => entries.filter((_, i) => !used.has(i)) };
}

// ---------- approved FAQ wording ----------
// scripts/checks/faq-approved.json: per page URL and FAQ JSON-LD path, the exact live (old) text and the exact
// reviewed (new) text. A changed FAQ question or answer passes check 1 only when both sides equal an approved entry,
// so any later edit to that text (one word that flips the meaning) fails until it is reviewed and approved again.
// Regenerate deliberately with `node scripts/checks/run.mjs --approve-faq` (never part of check:site).
export function makeFaqApprovals(entries) {
  const used = new Set();
  const key = (u, p) => `${u}\u0000${p}`;
  const by = new Map(entries.map((e, i) => [key(e.url, e.path), i]));
  const allowed = (d) => {
    const i = by.get(key(d.page, d.path));
    if (i == null) return false;
    const e = entries[i];
    if (e.old !== d.old || e.new !== d.new) return false;
    used.add(i);
    return true;
  };
  return { allowed, unused: () => entries.filter((_, i) => !used.has(i)) };
}

// Visible-text comparison used by check 3 (FAQ JSON-LD must equal the visible FAQ): tags stripped, case and the
// spaces next to punctuation ignored.
const tight = (s) => s.replace(/\s+([.,;:!?)\]])/g, '$1').replace(/([(\[])\s+/g, '$1');
const stripText = (s) => tight(norm(decode(String(s || '').replace(/<[^>]+>/g, ' '))).toLowerCase());
const FAQ_PATH = /^FAQPage(#\d+)?\.mainEntity\[\d+\]\.(name|acceptedAnswer\.text)$/;

/** The figures the NCD control and derived displays may add, per page: computed from car-models.json with the site's helpers. */
async function derivedSets(repo) {
  const h = await siteHelpers(repo);
  const models = JSON.parse(fs.readFileSync(path.join(repo, 'src/data/car-models.json'), 'utf8'));
  const per = new Map();
  const all = new Set();
  const listed = new Set(); // any model's premium at any step: model pages list related models with their range
  for (const m of models) {
    for (const v of rmFigures(derivedTexts(h, m))) all.add(v);
    for (const v of rmFigures(Object.values(h.carSteps(m).ins).join(' ; '))) listed.add(v);
  }
  for (const m of models) per.set(`/car-insurance/${m.slug}/`, new Set([...rmFigures(derivedTexts(h, m)), ...listed]));
  // The homepage and the car hub show the same per-model figures for every model they list.
  per.set('/', all);
  per.set('/car-insurance/', all);
  return per;
}

// ---------- 1. contract against live ----------
export async function contract(dist, baseline, allow, repo, faq, pending = null) {
  const r = mk(1, 'Contract against live (a5a1c65)');
  const cur = snapshot(dist, true);
  const base = baseline.pages;
  const derived = await derivedSets(repo);
  const auto = { derived: 0, faqApproved: 0 };
  const push = (d) => {
    if (allow.allowed(d)) { r.allowed = (r.allowed || 0) + 1; return; }
    // A figure the page's NCD control or derived display prints, computed from the data with the site's helpers.
    if (d.kind === 'added' && d.field === 'rm' && derived.get(d.page)?.has(d.value)) { auto.derived++; r.allowed = (r.allowed || 0) + 1; return; }
    // FAQ wording: allowed only by an exact reviewed entry in faq-approved.json (old and new text), and only when
    // the new text is also the visible FAQ text.
    if (d.kind === 'changed' && d.field === 'jsonld' && FAQ_PATH.test(d.path) && d.old != null && d.new != null) {
      const visible = tight(norm(cur[d.page].visible).toLowerCase()).includes(stripText(d.new));
      if (visible && pending) { pending.push({ url: d.page, path: d.path, old: d.old, new: d.new }); return; }
      if (visible && faq.allowed(d)) { auto.faqApproved++; r.allowed = (r.allowed || 0) + 1; return; }
      d.why = !visible ? 'new FAQ text is not the visible text' : 'FAQ text change not approved: review it, then node scripts/checks/run.mjs --approve-faq';
    }
    r.fails.push(d);
  };
  for (const page of Object.keys(cur)) if (!base[page]) push({ check: 'contract', page, kind: 'pageAdded', field: 'page', value: page });
  for (const page of Object.keys(base)) {
    const b = base[page], c = cur[page];
    if (!c) { push({ check: 'contract', page, kind: 'pageRemoved', field: 'page', value: page }); continue; }
    const before = r.fails.length;
    for (const f of ['title', 'h1', 'description', 'canonical', 'robots', 'ads']) {
      if (b[f] !== c[f]) push({ check: 'contract', page, kind: 'changed', field: f, old: b[f], new: c[f], value: `${b[f]} -> ${c[f]}` });
    }
    for (const f of ['rm', 'pct', 'phones']) {
      const bs = new Set(b[f]), cs = new Set(c[f]);
      for (const v of b[f]) if (!cs.has(v)) push({ check: 'contract', page, kind: 'removed', field: f, value: v });
      for (const v of c[f]) if (!bs.has(v)) push({ check: 'contract', page, kind: 'added', field: f, value: v });
    }
    for (const p of new Set([...Object.keys(b.jsonld), ...Object.keys(c.jsonld)])) {
      if (b.jsonld[p] !== c.jsonld[p]) push({ check: 'contract', page, kind: 'changed', field: 'jsonld', path: p, old: b.jsonld[p] ?? null, new: c.jsonld[p] ?? null, value: `${b.jsonld[p] ?? '(none)'} -> ${c.jsonld[p] ?? '(none)'}` });
    }
    if (r.fails.length === before) r.passes++;
  }
  // Contextual figures: the highest-risk numbers checked where they are shown, not only as a page-wide set.
  await contextual(dist, cur, repo, r);
  r.info = `auto-allowed: ${auto.derived} derived NCD figures (expected set from car-models.json), ${auto.faqApproved} FAQ edits approved exactly in faq-approved.json; contextual: ${r.contextual}`;
  return { r, cur };
}

async function contextual(dist, cur, repo, r) {
  const h = await siteHelpers(repo);
  const read = (f) => JSON.parse(fs.readFileSync(path.join(repo, 'src/data', f), 'utf8'));
  const models = read('car-models.json');
  const bySlug = Object.fromEntries(models.map((m) => [m.slug, m]));
  const fail = (page, check, value, source) => r.fails.push({ check: 'contextual', page, kind: check, value, source });
  // (a) NCD steps in the HTML (what a reader sees without JavaScript, plus the data attributes CSS switches to):
  //     every model page and the homepage's default car, all six steps, price, total and saving.
  const pages = [...models.map((m) => `/car-insurance/${m.slug}/`), '/'];
  let n = 0;
  for (const u of pages) {
    const root = cur[u]?.root;
    const ea = root?.querySelector('[data-ea]');
    const m = bySlug[ea?.getAttribute('data-slug')];
    if (!m) { fail(u, 'ncd-steps', 'no [data-ea] with a known data-slug', 'src/components/edisi/ModelAnswer.astro / HomeAnswer.astro'); continue; }
    if (u !== '/' && u !== `/car-insurance/${m.slug}/`) fail(u, 'ncd-steps', `answer block shows ${m.slug}`);
    const s = h.carSteps(m);
    const at = (sel, k) => { const el = ea.querySelector(sel); if (!el) return null; return k === '55' ? norm(el.querySelector('.pv')?.textContent || '') : el.getAttribute(`data-p${k}`); };
    for (const k of ['0', '25', '30', '38', '45', '55']) {
      // The homepage's answer block has no saving line; every model page has all three.
      const want = { '.ea-pnum': s.price[k], '.ea-sum-t': s.total[k] || null, '.ea-save .px': u === '/' ? null : s.saving[k] };
      for (const [sel, w] of Object.entries(want)) {
        if (w == null) continue;
        const got = at(sel, k);
        if (got !== w) fail(u, 'ncd-steps', `${sel} at NCD ${k}: got "${got}" expected "${w}"`, 'src/components/edisi/steps.ts / ModelAnswer.astro');
      }
    }
    n++;
  }
  // (b) Each plan page's lead equals its record's field.
  let leads = 0;
  const leadOf = (u) => norm(cur[u]?.root?.querySelector('.pa-lead-v')?.textContent || '');
  for (const c of read('medical-cards.json').records) {
    const u = `/medical-cards/${c.slug}/`;
    if (!cur[u]) continue;
    const want = /^RM[\d,]+$/.test(c.annualLimit ?? '') ? c.annualLimit : '';
    if (leadOf(u) !== want) fail(u, 'plan-lead', `lead "${leadOf(u)}" expected annualLimit "${want}"`, 'src/pages/medical-cards/[slug].astro'); else leads++;
  }
  for (const c of read('critical-illness.json').records) {
    const u = `/critical-illness/${c.slug}/`;
    if (!cur[u]) continue;
    const fact = c.analysis?.facts?.find((f) => f.label === 'Penyakit yang dilindungi');
    const want = fact?.value.match(/^(\d+)\s/)?.[1] ?? '';
    if (leadOf(u) !== want) fail(u, 'plan-lead', `lead "${leadOf(u)}" expected "${want}" (start of "Penyakit yang dilindungi")`, 'src/pages/critical-illness/[slug].astro'); else leads++;
  }
  // (c) Buy-direct table: one row per record, each linking the record's official URL.
  const direct = read('direct-online.json').records;
  const t = cur['/insurans-online/']?.root?.querySelector('#beli-terus tbody');
  const rows = t ? t.querySelectorAll('tr') : [];
  const links = rows.map((tr) => tr.querySelector('a[data-direct-insurer]')?.getAttribute('href'));
  const host = (x) => { try { return new URL(x).hostname; } catch { return String(x); } };
  if (rows.length !== direct.length) fail('/insurans-online/', 'buy-direct', `${rows.length} rows, data has ${direct.length}`, 'src/pages/insurans-online/index.astro');
  else direct.forEach((d, i) => { if (links[i] !== d.url || host(links[i]) !== host(d.url)) fail('/insurans-online/', 'buy-direct', `row ${i + 1} ${d.company}: links ${links[i]} expected ${d.url}`); });
  r.contextual = `${n} answer blocks × 6 steps, ${leads} plan leads, ${rows.length} buy-direct rows`;
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
  // Pages where ads were switched off on purpose since the baseline (exact URLs, each with a reason).
  const adsOffFile = new URL('./ads-changes.json', import.meta.url);
  const adsOff = new Map((fs.existsSync(adsOffFile) ? JSON.parse(fs.readFileSync(adsOffFile, 'utf8')).removed : []).map((e) => [e.url, e]));
  for (const u of baseAds) if (!curAds.has(u) && !adsOff.has(u)) r.fails.push({ page: u, check: 'AdSense no longer loads (baseline loads it)', source: 'src/layouts/Base.astro / ads gate' });
  for (const u of adsOff.keys()) if (curAds.has(u) || !baseAds.has(u)) r.fails.push({ page: u, check: 'stale entry in ads-changes.json (page loads ads, or never did)', source: 'scripts/checks/ads-changes.json' });
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
    // Terkini item pages: at least one outbound source link (https, off-site) and one internal "updates" link to a
    // built page. src/lib/terkini.ts enforces the data at build time; this checks the output.
    if (/^\/terkini\/[^/]+\/$/.test(url)) {
      const src = root.querySelectorAll('a[data-source]').filter((a) => { try { const h = new URL(a.getAttribute('href')); return h.protocol === 'https:' && !/(^|\.)insurans\.co$/.test(h.hostname); } catch { return false; } });
      const upd = root.querySelectorAll('a[data-updates]').filter((a) => { const h = a.getAttribute('href') || ''; return /^\/(?!\/)/.test(h) && resolveTarget(dist, new URL(h, 'https://insurans.co').pathname); });
      if (!src.length) errs.push({ check: 'Terkini item without an outbound source link', value: url, source: 'src/data/terkini.json' });
      if (!upd.length) errs.push({ check: 'Terkini item without an internal updates link', value: url, source: 'src/data/terkini.json' });
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
  // List thumbnails (/images/kereta/kecil/, scripts/make-car-thumbs.mjs) are crops of a credited photo: each maps through
  // src/data/car-thumbs.json to the photo it was made from. They need no per-thumbnail credit on list pages, but
  // their source photo must be credited and listed on /kredit-foto/, which must explain them (#gambar-kecil).
  const thumbsFile = path.join(repo, 'src/data/car-thumbs.json');
  const thumbs = fs.existsSync(thumbsFile) ? JSON.parse(fs.readFileSync(thumbsFile, 'utf8')) : [];
  const thumbBySrc = new Map(thumbs.flatMap((t) => [t.src144, t.src96].filter(Boolean).map((s) => [s, t])));
  const isThumb = (s) => /^\/images\/kereta\/kecil\//.test(s);
  const thumbDir = path.join(dist, 'images/kereta/kecil');
  if (fs.existsSync(thumbDir)) {
    for (const f of fs.readdirSync(thumbDir)) {
      const src = `/images/kereta/kecil/${f}`;
      const t = thumbBySrc.get(src);
      const rec = t && bySrc.get(t.from);
      if (!rec?.credit?.author || !rec.credit.licence || !rec.credit.source) r.fails.push({ page: src, check: 'thumbnail without a credited source photo', value: f, source: 'src/data/car-thumbs.json' });
      else r.passes++;
    }
  }
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
      if (isThumb(s)) {
        const t = thumbBySrc.get(s);
        const src = t && bySrc.get(t.from);
        if (!src?.credit?.author || !src.credit.licence || !src.credit.source) { ok = false; r.fails.push({ page: url, check: 'thumbnail without a credited source photo', value: s, source: 'src/data/car-thumbs.json' }); }
        continue;
      }
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
    const slugs = new Set([...used.keys()].map((s) => (isThumb(s) ? bySrc.get(thumbBySrc.get(s)?.from)?.slug : bySrc.get(s)?.slug)).filter(Boolean));
    if ([...used.keys()].some(isThumb) && !kf.root.querySelector('#gambar-kecil')) r.fails.push({ page: '/kredit-foto/', check: 'list thumbnails used but not explained (#gambar-kecil)', source: 'src/pages/kredit-foto/index.astro' });
    for (const slug of slugs) {
      const rec = data.find((d) => d.slug === slug);
      if (!html.includes(rec.credit.source)) r.fails.push({ page: '/kredit-foto/', check: 'used photo not listed', value: slug, source: 'src/pages/kredit-foto.astro' });
      else r.passes++;
    }
  }
  // Brand and insurer logos (/images/jenama/, /images/syarikat/): every file needs a record in brand-logos.json or
  // company-logos.json with its source, exact source URL and date, and /kredit-foto/ must link that URL.
  const logoRecs = ['src/data/brand-logos.json', 'src/data/company-logos.json']
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(repo, f), 'utf8')).records);
  const kfHtml = kf ? kf.root.toString() : '';
  let logoFiles = 0;
  for (const dir of ['jenama', 'syarikat']) {
    const d = path.join(dist, 'images', dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      logoFiles++;
      const src = `/images/${dir}/${f}`;
      const rec = logoRecs.find((x) => x.path === src);
      if (!rec || !rec.source || !rec.sourceUrl || !rec.retrieved) r.fails.push({ page: src, check: 'logo without source/sourceUrl/retrieved record', value: f, source: 'src/data/*-logos.json' });
      else if (!kfHtml.includes(`href="${rec.sourceUrl}"`)) r.fails.push({ page: '/kredit-foto/', check: 'logo source not linked on the credits page', value: src, source: 'src/pages/kredit-foto/index.astro' });
      else r.passes++;
    }
  }
  r.info = `${used.size} photo files used, ${logoFiles} logo files`;
  return r;
}

export const isRedirectPage = isRedirect;
export function loadAll(dist) {
  const pages = walkHtml(dist).map(({ file, url }) => ({ file, url, ...loadPage(file) }));
  const idsByFile = new Map(pages.map((p) => [p.file, new Set(p.root.querySelectorAll('[id]').map((e) => e.id))]));
  return { pages, idsByFile };
}
