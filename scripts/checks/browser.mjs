// Browser checks 6–10 (playwright-core + a local Chromium). Missing browser => SKIPPED, never PASS.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

const BLOCK = /googletagmanager\.com|google-analytics\.com|googlesyndication\.com|fundingchoicesmessages\.google\.com|doubleclick\.net/;
const DEFAULT_CHROME = '/home/dev/.cache/ms-playwright/chromium-1247/chrome-linux64/chrome';
const FALLBACK_PW = '/home/dev/.local/lib/node_modules/@playwright/cli/node_modules/playwright-core';
const mk = (id, name) => ({ id, name, fails: [], warns: [], passes: 0 });
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

function loadPlaywright(repo) {
  const req = createRequire(path.join(repo, 'package.json'));
  try { return req('playwright-core'); } catch {}
  try { return createRequire(import.meta.url)(FALLBACK_PW); } catch {}
  return null;
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg' };
function serve(dist) {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = path.join(dist, p);
    if (!f.startsWith(dist)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404, { 'content-type': 'text/html' }); res.end(fs.existsSync(path.join(dist, '404.html')) ? fs.readFileSync(path.join(dist, '404.html')) : 'not found'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((ok) => srv.listen(0, '127.0.0.1', () => ok(srv)));
}

async function pool(items, n, fn) {
  const q = [...items];
  await Promise.all(Array.from({ length: n }, async () => { while (q.length) await fn(q.shift()); }));
}

// ---- in-page probes (serialised into the page) ----
const SEL = (el) => { const p = []; let e = el; for (let i = 0; e && e.nodeType === 1 && i < 3; i++, e = e.parentElement) { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = [...e.classList].filter((x) => !/^astro-|^data-astro/.test(x)).slice(0, 2); if (c.length) s += '.' + c.join('.'); p.unshift(s); if (e.id) break; } return p.join('>'); };

function probeLayout({ w, touch, selSrc }) {
  const sel = new Function('return ' + selSrc)();
  const de = document.documentElement;
  const out = { overflow: de.scrollWidth - de.clientWidth, wide: [], small: {}, targets: {} };
  const visible = (el) => { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity !== 0; };
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (el.closest('.sr-only, [aria-hidden="true"] .sr-only')) continue;
    let anc = el.parentElement, scroller = false;
    while (anc && anc !== document.body) { const o = getComputedStyle(anc).overflowX; if (o !== 'visible') { scroller = true; break; } anc = anc.parentElement; }
    if (!scroller && (r.right > w + 1 || r.left < -1) && visible(el)) out.wide.push(`${sel(el)} [${Math.round(r.left)}..${Math.round(r.right)}]`);
  }
  // smallest font on visible text
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || el.closest('script,style,noscript,.sr-only,svg')) continue;
    const rr = document.createRange(); rr.selectNodeContents(n); const rect = rr.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden') continue;
    const fs = parseFloat(cs.fontSize);
    if (fs < 14 - 0.01) { const k = `${sel(el)} ${fs}px`; out.small[k] = (out.small[k] || 0) + 1; }
  }
  if (touch) {
    for (const el of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], label:has(input)')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || !visible(el)) continue;
      if (el.matches('input[type=radio], input[type=checkbox]') && el.closest('label')) continue; // the label is the target
      if (el.closest('.sr-only')) continue; // skip link: only on screen when focused
      if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') {
        const p = el.parentElement; const own = p ? p.textContent.replace(el.textContent, '').trim() : '';
        if (own.length > 0 && el.closest('p, li, td, dd, figcaption, blockquote')) continue; // inline prose link
      }
      if (r.width < 44 - 0.5 || r.height < 44 - 0.5) {
        const k = el.tagName.toLowerCase() + ([...el.classList].filter((c) => !/^astro-/.test(c)).slice(0, 2).map((c) => '.' + c).join('') || '') + ` (in ${el.parentElement ? sel(el.parentElement).split('>').pop() : '?'})`;
        out.targets[k] = (out.targets[k] || 0) + 1;
      }
    }
  }
  return out;
}

function probeFirstScreen({ H, selSrc }) {
  const sel = new Function('return ' + selSrc)();
  const W = innerWidth;
  const h1 = document.querySelector('h1');
  const o = { h1px: h1 ? parseFloat(getComputedStyle(h1).fontSize) : null, h1class: h1?.className || '', h1rules: [] };
  if (h1) {
    const rules = [];
    const walk = (list, media) => { for (const r of list) { if (r.cssRules && r.media) { if (matchMedia(r.media.mediaText).matches) walk(r.cssRules, r.media.mediaText); } else if (r.cssRules && !r.selectorText) walk(r.cssRules, media); else if (r.selectorText && r.style?.fontSize || r.style?.font) { try { if (h1.matches(r.selectorText)) rules.push(`${r.selectorText} { font-size: ${r.style.fontSize || r.style.font} }${media ? ' @media ' + media : ''}`); } catch {} } } };
    for (const s of document.styleSheets) { try { walk(s.cssRules, ''); } catch {} }
    o.h1rules = rules.slice(-4);
  }
  const ans = document.querySelector('.mod:has(.mod-bar), .et-panel, [data-section="page-answer"], .ea-price, [data-price]');
  o.answerTop = ans ? Math.round(ans.getBoundingClientRect().top + scrollY) : null;
  o.answerSel = ans ? sel(ans) : null;
  const btns = [...document.querySelectorAll('.ea .ea-btn')].filter((b) => b.getBoundingClientRect().height);
  o.btnBottoms = btns.map((b) => Math.round(b.getBoundingClientRect().bottom + scrollY));
  const price = document.querySelector('.ea-price');
  if (price) { const r = price.getBoundingClientRect(); o.price = [Math.round(r.left), Math.round(r.right), W]; }
  // magenta fills in the first screen
  const hsl = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); if (+a < 0.5) return null; const R = r / 255, G = g / 255, B = b / 255; const mx = Math.max(R, G, B), mn = Math.min(R, G, B), l = (mx + mn) / 2, d = mx - mn; if (!d) return { h: 0, s: 0, l }; const s = d / (1 - Math.abs(2 * l - 1)); let h = mx === R ? ((G - B) / d) % 6 : mx === G ? (B - R) / d + 2 : (R - G) / d + 4; h = (h * 60 + 360) % 360; return { h, s, l }; };
  const isMag = (c) => { const x = hsl(c); return x && x.h >= 300 && x.h <= 350 && x.s > 0.6 && x.l > 0.25 && x.l < 0.65; };
  const mags = [];
  let ncdCounted = false;
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.top + scrollY >= H) continue;
    const cs = getComputedStyle(el);
    const fill = isMag(cs.backgroundColor) || isMag(getComputedStyle(el, '::after').backgroundColor) && getComputedStyle(el, '::after').content !== 'none';
    if (!fill) continue;
    if (el.closest('.ea-ncd')) { if (ncdCounted) continue; ncdCounted = true; mags.push('NCD control (selected bar + knob)'); continue; }
    mags.push(sel(el));
  }
  o.magenta = mags;
  return o;
}

function probePx() {
  const ea = document.querySelector('[data-ea]');
  const read = (el) => {
    if (!el) return { v: null, n: 0 };
    const pv = el.querySelector('.pv');
    const pvShown = pv && getComputedStyle(pv).display !== 'none';
    const after = getComputedStyle(el, '::after').content;
    const afterShown = after && after !== 'none' && after !== 'normal' && after !== '""';
    return { v: pvShown ? pv.textContent.trim() : afterShown ? after.replace(/^"|"$/g, '') : null, n: (pvShown ? 1 : 0) + (afterShown ? 1 : 0) };
  };
  const all = [...(ea || document).querySelectorAll('.px')].filter((e) => e.getBoundingClientRect().width || e.closest('[data-ea]'));
  const multi = all.map(read).filter((x) => x.n !== 1).length;
  const knob = document.querySelector('.ins-knob');
  return {
    slug: ea?.dataset.slug, price: read(ea?.querySelector('.ea-pnum')).v, total: read(ea?.querySelector('.ea-sum-t')).v,
    save: read(ea?.querySelector('.ea-save .px')).v, multi, nPx: all.length,
    rt: (ea?.querySelector('.ea-sum')?.textContent.match(/roadtax\s*RM\s?([\d,]+)/i) || [])[1],
    knobY: knob ? Math.round(knob.getBoundingClientRect().top * 10) / 10 : null,
  };
}

const fmt = (n) => n.toLocaleString('en-US');
const r10 = (x) => Math.round(x / 10) * 10;
function expectedStep(m, step) {
  const hasRt = Number.isFinite(m.roadtaxMin) && Number.isFinite(m.roadtaxMax);
  const f = step / 100;
  const lo = step === 0 ? m.premiumNCD0Min : step === 55 ? m.premiumNCD55Min : r10(m.premiumNCD0Min * (1 - f));
  const hi = step === 0 ? m.premiumNCD0Max : step === 55 ? m.premiumNCD55Max : r10(m.premiumNCD0Max * (1 - f));
  return {
    price: `${fmt(lo)}–${fmt(hi)}`,
    total: hasRt ? `RM${fmt(Math.round(lo + m.roadtaxMin))}–${fmt(Math.round(hi + m.roadtaxMax))}` : null,
    save: step === 0 ? 'Tiada diskaun pada tahap ini' : `Jimat RM${fmt(m.premiumNCD0Min - lo)}–${fmt(m.premiumNCD0Max - hi)} setahun berbanding tanpa NCD`,
  };
}

// 15 calculator fixtures (from the fx-tools review run of the merged build, 2026-11).
const CALC = [
  { tool: 'ncd', in: [2000, 55], expect: ['RM 900', 'RM 1,100'] },
  { tool: 'ncd', in: [1234, 38.33], expect: ['RM 761', 'RM 473'] },
  { tool: 'ncd', in: [3500, 0], expect: ['RM 3,500', 'RM 0'] },
  { tool: 'claim', in: [900, 55, 800, 400], expect: ['tidak melebihi ambang dua tahun', 'RM 400'] },
  { tool: 'claim', in: [1500, 25, 3000, 0], expect: ['Bayaran bersih melebihi ambang dua tahun', 'RM 3,000'] },
  { tool: 'roadtax', in: ['1498', 'semenanjung', 'saloon'], expect: ['RM 90.00'] },
  { tool: 'roadtax', in: ['2500', 'sabahSarawak', 'nonSaloon'], expect: ['RM 463.00'] },
  { tool: 'roadtax', in: ['1800', 'semenanjung', 'nonSaloon'], expect: ['RM 360.00'] },
  { tool: 'motor', in: ['150', 'semenanjung'], expect: ['Kadar sedia ada'] },
  { tool: 'motor', in: ['250', 'sabahSarawak'], expect: ['RM 12.00'] },
  { tool: 'motor', in: ['600', 'semenanjung'], expect: ['RM 250.00'] },
  { tool: 'rumah', in: ['landed', '1A', '300000', '50000'], expect: ['RM 449.00'] },
  { tool: 'rumah', in: ['flat', '1B', '500000', '80000'], expect: ['RM 1,641.00'] },
  { tool: 'nyawa', in: ['5000', '10', '500000', '50000', '100000'], expect: ['RM 950,010'] },
  { tool: 'nyawa', in: ['8000', '15', '300000', '20000', '0'], expect: ['RM 1,240,015'] },
];
const CC = [['1.5', '1,500cc'], ['1496', '1,496cc'], ['2', '2,000cc'], ['0.66', '660cc'], ['15', null], ['15cc', null]];
const TOOLS = { 'ncd-calculator/': '#kalkulator, form', 'kalkulator-roadtax/': '#roadtax-form', 'kalkulator-roadtax-motosikal/': '#motor-roadtax-form', 'kalkulator-insurans-rumah/': '#fire-form', 'kalkulator-coverage-nyawa/': '#coverage-form' };

async function runCalc(page, base, c) {
  const T = base + '/tools/';
  const txt = async (s) => clean(await page.textContent(s));
  if (c.tool === 'ncd') { await page.goto(T + 'ncd-calculator/'); await page.fill('#base-premium', String(c.in[0])); await page.check(`#ncd-selector input[value="${c.in[1]}"]`, { force: true }); await page.waitForTimeout(400); return (await txt('#result-premium')) + ' / jimat ' + (await txt('#result-saving')); }
  if (c.tool === 'claim') { await page.goto(T + 'ncd-calculator/'); await page.fill('#current-premium', String(c.in[0])); await page.selectOption('#current-ncd-pct', String(c.in[1])); await page.fill('#repair-cost', String(c.in[2])); await page.fill('#excess', String(c.in[3])); await page.click('#claim-calc-btn'); await page.waitForTimeout(200); return txt('#claim-result'); }
  if (c.tool === 'roadtax') { await page.goto(T + 'kalkulator-roadtax/'); await page.fill('#engine-cc', c.in[0]); await page.check(`input[name=region][value=${c.in[1]}]`, { force: true }); await page.check(`input[name=body][value=${c.in[2]}]`, { force: true }); await page.click('#roadtax-form button[type=submit]'); await page.waitForTimeout(200); return txt('#roadtax-value'); }
  if (c.tool === 'motor') { await page.goto(T + 'kalkulator-roadtax-motosikal/'); await (await page.$('#motor-roadtax-form input:not([type=radio])')).fill(c.in[0]); await page.check(`input[name=region][value=${c.in[1]}]`, { force: true }); await page.click('#motor-roadtax-form button[type=submit]'); await page.waitForTimeout(200); return txt('#motor-result'); }
  if (c.tool === 'rumah') { await page.goto(T + 'kalkulator-insurans-rumah/'); await page.check(`input[name=propertyType][value="${c.in[0]}"]`, { force: true }); await page.check(`input[name=constructionClass][value="${c.in[1]}"]`, { force: true }); const ins = await page.$$('#fire-form input:not([type=radio])'); await ins[0].fill(c.in[2]); await ins[1].fill(c.in[3]); await page.click('#fire-form button[type=submit]'); await page.waitForTimeout(200); return txt('#fire-result'); }
  if (c.tool === 'nyawa') { await page.goto(T + 'kalkulator-coverage-nyawa/'); const ins = await page.$$('#coverage-form input:not([type=radio])'); for (let i = 0; i < ins.length && i < c.in.length; i++) await ins[i].fill(c.in[i]); await page.click('#coverage-form button[type=submit]'); await page.waitForTimeout(200); return txt('#coverage-result'); }
}

export async function browserChecks({ DIST, REPO, pages, want }) {
  const names = { 6: 'Layout (320/390/1280)', 7: 'First screen at 390×844', 8: 'NCD control', 9: 'Calculators', 10: 'Console and requests' };
  const R = Object.fromEntries([6, 7, 8, 9, 10].filter(want).map((n) => [n, mk(n, names[n])]));
  const pw = loadPlaywright(REPO);
  const exe = process.env.CHROME_PATH || DEFAULT_CHROME;
  if (!pw || !fs.existsSync(exe)) { for (const r of Object.values(R)) r.skipped = `SKIPPED: ${!pw ? 'playwright-core not found' : 'no Chromium at ' + exe}`; return Object.values(R); }
  const srv = await serve(DIST);
  const base = `http://127.0.0.1:${srv.address().port}`;
  const browser = await pw.chromium.launch({ executablePath: exe });
  const selSrc = SEL.toString();
  const newCtx = async (opts = {}) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', ...opts });
    await ctx.route((u) => BLOCK.test(u.toString()), (r) => r.abort());
    return ctx;
  };
  const content = pages.filter((u) => u !== '/404.html');
  try {
    // ---- 6 + 10: every page at three widths ----
    if (R[6] || R[10]) {
      const ctxs = await Promise.all([320, 390, 1280].map((w) => newCtx({ viewport: { width: w, height: 900 } })));
      const targetAgg = {};
      const smallAgg = {};
      await pool(content.flatMap((u) => [0, 1, 2].map((i) => [u, i])), 6, async ([u, i]) => {
        const w = [320, 390, 1280][i];
        const page = await ctxs[i].newPage();
        const errs = [];
        if (i === 2) {
          page.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 160)));
          page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|net::ERR_BLOCKED|Failed to load resource: net::ERR/.test(m.text())) errs.push('console: ' + m.text().slice(0, 160)); });
          page.on('requestfailed', (q) => { if (q.url().startsWith(base)) errs.push('requestfailed: ' + q.url().replace(base, '')); });
          page.on('response', (s) => { if (s.url().startsWith(base) && s.status() >= 400) errs.push(`HTTP ${s.status()}: ${s.url().replace(base, '')}`); });
        }
        try {
          await page.goto(base + u, { waitUntil: 'load' });
          if (R[6]) {
            const o = await page.evaluate(probeLayout, { w, touch: w === 390, selSrc });
            const bad = [];
            if (o.overflow > 0) bad.push({ page: u, width: w, check: 'horizontal page overflow', value: `${o.overflow}px` });
            if (o.wide.length) bad.push({ page: u, width: w, check: 'element wider than viewport', value: o.wide.slice(0, 5).join(' | ') + (o.wide.length > 5 ? ` (+${o.wide.length - 5})` : '') });
            for (const [k, n] of Object.entries(o.small)) { smallAgg[k] = smallAgg[k] || { n: 0, pages: new Set(), widths: new Set() }; smallAgg[k].n += n; smallAgg[k].pages.add(u); smallAgg[k].widths.add(w); }
            for (const [k, n] of Object.entries(o.targets)) { targetAgg[k] = targetAgg[k] || { n: 0, pages: new Set() }; targetAgg[k].n += n; targetAgg[k].pages.add(u); }
            if (bad.length) R[6].fails.push(...bad); else R[6].passes++;
          }
          if (R[10] && i === 2) { await page.waitForTimeout(150); if (errs.length) R[10].fails.push(...[...new Set(errs)].map((e) => ({ page: u, check: 'console/request', value: e }))); else R[10].passes++; }
        } catch (e) { (R[6] || R[10]).fails.push({ page: u, width: w, check: 'load error', value: String(e.message).slice(0, 160) }); }
        await page.close();
      });
      if (R[6]) {
        for (const [k, v] of Object.entries(smallAgg).sort((a, b) => b[1].pages.size - a[1].pages.size)) R[6].fails.push({ page: [...v.pages].slice(0, 3).join(', ') + (v.pages.size > 3 ? ` (+${v.pages.size - 3} pages)` : ''), check: 'font under 14px', value: `${k} ×${v.n} at ${[...v.widths].join('/')}` });
        for (const [k, v] of Object.entries(targetAgg).sort((a, b) => b[1].n - a[1].n)) R[6].warns.push({ check: 'target under 44×44 at 390', value: `${k}: ${v.n} on ${v.pages.size} pages`, page: [...v.pages][0] });
      }
      await Promise.all(ctxs.map((c) => c.close()));
    }

    // ---- 7: first screen per template family ----
    if (R[7]) {
      const ctx = await newCtx({ viewport: { width: 390, height: 844 } });
      const fam = (u) => (u === '/' ? '(home)' : u.split('/').filter(Boolean).length > 1 ? u.split('/')[1] + '/*' : u.split('/')[1]);
      const reps = new Map();
      for (const u of content) { if (/^\/car-insurance\/[^/]+\/$/.test(u) || u === '/') { reps.set(u, u); continue; } const f = fam(u); if (![...reps.values()].includes(f)) reps.set(u, f); }
      const page = await ctx.newPage();
      await page.goto(base + '/');
      const homeH1 = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.ea-h1') || document.querySelector('h1')).fontSize));
      R[7].info = `homepage .ea-h1 at 390 = ${homeH1}px; ${reps.size} pages probed`;
      const h1Table = {};
      for (const [u, f] of reps) {
        await page.goto(base + u);
        const o = await page.evaluate(probeFirstScreen, { H: 844, selSrc });
        const bad = [];
        const key = /^\/car-insurance\/[^/]+\/$/.test(u) ? 'car-insurance/<model>' : f;
        h1Table[key] = h1Table[key] || { px: new Set(), rules: o.h1rules, page: u };
        h1Table[key].px.add(o.h1px);
        if (o.h1px !== homeH1) bad.push({ check: 'phone H1 size differs from homepage ea-h1', value: `${o.h1px}px (home ${homeH1}px); h1.class="${o.h1class}"; rules: ${o.h1rules.join(' ; ')}` });
        if (o.answerTop == null) R[7].warns.push({ page: u, check: 'no answer box (.mod/.mod-bar, PageAnswer, price block)' });
        else if (o.answerTop >= 844) bad.push({ check: 'answer box starts below first screen', value: `${o.answerSel} top=${o.answerTop}` });
        if (/^\/car-insurance\/[^/]+\/$/.test(u)) {
          if (o.btnBottoms.length < 2) bad.push({ check: 'model page: expected 2 buttons', value: o.btnBottoms.length });
          else if (o.btnBottoms.some((b) => b > 844)) bad.push({ check: 'model page: button ends below 844', value: o.btnBottoms.join(',') });
          if (o.price && (o.price[0] < 8 || o.price[1] > o.price[2] - 8)) bad.push({ check: 'model page: price touches the screen edge', value: `left ${o.price[0]} right ${o.price[1]} of ${o.price[2]}` });
        }
        if (o.magenta.length > 3) R[7].warns.push({ page: u, check: 'more than 3 magenta fills in first screen', value: `${o.magenta.length}: ${o.magenta.join(' | ')}` });
        (R[7].magenta = R[7].magenta || {})[u] = o.magenta.length;
        if (bad.length) R[7].fails.push(...bad.map((b) => ({ page: u, ...b }))); else R[7].passes++;
      }
      R[7].h1Table = Object.fromEntries(Object.entries(h1Table).map(([k, v]) => [k, { px: [...v.px], page: v.page, rules: v.rules }]));
      await ctx.close();
    }

    // ---- 8: NCD control ----
    if (R[8]) {
      const models = JSON.parse(fs.readFileSync(path.join(REPO, 'src/data/car-models.json'), 'utf8'));
      const bySlug = Object.fromEntries(models.map((m) => [m.slug, m]));
      const targets = ['/', '/car-insurance/perodua-axia/', '/car-insurance/honda-civic/', '/car-insurance/mercedes-c-class/'];
      for (const js of [true, false]) {
        for (const u of targets) {
          const ctx = await newCtx({ viewport: { width: 390, height: 844 }, javaScriptEnabled: js }); // fresh storage: the step is remembered in localStorage
          const page = await ctx.newPage();
          await page.goto(base + u);
          const o55 = await page.evaluate(probePx);
          const m = bySlug[o55.slug];
          if (!m) { R[8].fails.push({ page: u, js, check: 'no [data-ea] model slug' }); await ctx.close(); continue; }
          let ok = true;
          for (const step of [0, 25]) {
            await page.check(`#ncd-${step}`, { force: true });
            await page.waitForTimeout(250);
            const o = await page.evaluate(probePx);
            const ex = expectedStep(m, step);
            for (const k of ['price', 'total', 'save']) if (ex[k] != null && o55[k] != null && o[k] !== ex[k]) { ok = false; R[8].fails.push({ page: u, js, step, check: `${k} at NCD ${step}%`, value: `got "${o[k]}" expected "${ex[k]}"`, source: 'src/components/edisi/steps.ts / ModelAnswer.astro / HomeAnswer.astro' }); }
            if (o.multi) { ok = false; R[8].fails.push({ page: u, js, step, check: 'price element shows 0 or 2 values', value: `${o.multi} of ${o.nPx}`, source: 'src/styles/edisi-answer.css' }); }
            if (js && o.knobY === o55.knobY) { ok = false; R[8].fails.push({ page: u, js, step, check: 'logo dot did not move with the step', value: `y ${o.knobY}`, source: 'src/components/SiteHeader.astro' }); }
          }
          if (ok) R[8].passes++;
          await ctx.close();
        }
      }
    }

    // ---- 9: calculators ----
    if (R[9]) {
      const ctx = await newCtx({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      R[9].cases = [];
      for (const c of CALC) {
        let got;
        try { got = await runCalc(page, base, c); } catch (e) { got = 'ERROR ' + String(e.message).slice(0, 120); }
        const ok = c.expect.every((x) => got.includes(x));
        R[9].cases.push({ tool: c.tool, in: c.in, ok, got: got.slice(0, 160) });
        if (ok) R[9].passes++; else R[9].fails.push({ page: '/tools/', check: `calculator ${c.tool} ${c.in.join(',')}`, value: `expected ${c.expect.join(' & ')}; got "${got.slice(0, 140)}"`, source: 'src/pages/tools/**' });
      }
      await page.evaluate(() => localStorage.clear());
      await page.goto(base + '/tools/ncd-calculator/');
      const ncd0 = await page.evaluate(() => ({ checked: document.querySelector('#ncd-selector input:checked')?.value, ex: [...document.querySelectorAll('#ncd-selector .mk-c, #ncd-selector [data-ex]')].some((e) => e.getBoundingClientRect().width && /Contoh/.test(e.textContent)) }));
      if (ncd0.checked === '55' && ncd0.ex) R[9].passes++; else R[9].fails.push({ page: '/tools/ncd-calculator/', check: 'opens at 55% with a labelled example', value: JSON.stringify(ncd0), source: 'src/pages/tools/ncd-calculator/index.astro' });
      for (const [v, exp] of CC) {
        await page.goto(base + '/tools/kalkulator-roadtax/');
        await page.fill('#engine-cc', v);
        await page.click('#roadtax-form button[type=submit]');
        await page.waitForTimeout(150);
        const und = clean(await page.textContent('#engine-cc-understood').catch(() => ''));
        const val = clean(await page.textContent('#roadtax-value').catch(() => ''));
        const ok = exp ? und.includes(exp) && /RM\s?\d/.test(val) : !/RM\s?\d/.test(val);
        if (ok) R[9].passes++; else R[9].fails.push({ page: '/tools/kalkulator-roadtax/', check: `engine-size parser "${v}"`, value: `expected ${exp || 'rejected'}; understood "${und}" value "${val}"`, source: 'src/pages/tools/kalkulator-roadtax/index.astro' });
        R[9].cases.push({ tool: 'cc-parser', in: [v], ok, got: `${und} | ${val}`.slice(0, 160) });
      }
      await ctx.close();
      const nctx = await newCtx({ viewport: { width: 390, height: 900 }, javaScriptEnabled: false });
      const np = await nctx.newPage();
      let navs = 0; np.on('framenavigated', (f) => { if (f === np.mainFrame()) navs++; });
      for (const [slug, form] of Object.entries(TOOLS)) {
        await np.goto(base + '/tools/' + slug);
        navs = 0;
        const notice = await np.evaluate(() => /JavaScript/i.test(document.body.innerText));
        const btn = await np.$(`${form.split(',')[0]} button[type=submit], ${form.split(',').pop().trim()} button[type=submit]`);
        if (btn && (await btn.isVisible())) { await btn.click({ timeout: 2000 }).catch(() => {}); await np.waitForTimeout(300); }
        const url = np.url();
        if (notice && navs === 0 && url === base + '/tools/' + slug) R[9].passes++;
        else R[9].fails.push({ page: '/tools/' + slug, check: 'JS off: notice shown and submit does not navigate', value: `notice=${notice} navigations=${navs} url=${url.replace(base, '')}`, source: `src/pages/tools/${slug}index.astro` });
      }
      await nctx.close();
    }
  } finally {
    await browser.close();
    srv.close();
  }
  return Object.values(R);
}
