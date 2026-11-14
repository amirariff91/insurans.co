#!/usr/bin/env node
// insurans.co site checks. Run after `bun run build`:  bun run check:site
// Release run: all ten checks must RUN and pass; a skipped check (no browser) fails the run.
// Static-only run (checks 1-5, no browser): bun run check:site:static  (same as --static or CHECKS=1,2,3,4,5).
// Options (env): DIST (default ./dist), CHROME_PATH (Chromium/Chrome binary), PLAYWRIGHT_CORE (path to a
// playwright-core package if the project has none), CHECKS=1,2,6 (subset: only those run, and must not skip),
// ALLOWLIST (alternative allowlist file). Writes scripts/checks/report.json; exits 1 on any failure or required skip.
// See docs/checks.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S from './static.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../..');
const DIST = path.resolve(process.env.DIST || path.join(REPO, 'dist'));
const STATIC = process.argv.includes('--static');
const ONLY = STATIC ? new Set([1, 2, 3, 4, 5]) : process.env.CHECKS ? new Set(process.env.CHECKS.split(',').map(Number)) : null;
const want = (n) => !ONLY || ONLY.has(n);
const t0 = Date.now();

if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error(`No build at ${DIST}. Run: bun run build`); process.exit(2); }
const baselineFile = fs.readdirSync(HERE).find((f) => /^baseline-.+\.json$/.test(f));
const baseline = JSON.parse(fs.readFileSync(path.join(HERE, baselineFile), 'utf8'));
const allowJson = JSON.parse(fs.readFileSync(process.env.ALLOWLIST || path.join(HERE, 'allowlist.json'), 'utf8'));
const allow = S.makeAllow(allowJson.entries);
const FAQ_FILE = path.join(HERE, 'faq-approved.json');
const faqJson = fs.existsSync(FAQ_FILE) ? JSON.parse(fs.readFileSync(FAQ_FILE, 'utf8')) : { entries: [] };
const faq = S.makeFaqApprovals(faqJson.entries);

// --approve-faq: record every FAQ question/answer that differs from the baseline today (and is not covered by an
// allowlist entry) as approved, old and new text exact. Deliberate only: review the printed changes first. It
// writes scripts/checks/faq-approved.json and runs no checks; check:site never passes this flag.
if (process.argv.includes('--approve-faq')) {
  const pending = [];
  const { r } = await S.contract(DIST, baseline, allow, REPO, faq, pending);
  pending.sort((a, b) => a.url.localeCompare(b.url) || a.path.localeCompare(b.path, 'en', { numeric: true }));
  const prev = new Map(faqJson.entries.map((e) => [`${e.url} ${e.path}`, e]));
  for (const e of pending) {
    const p = prev.get(`${e.url} ${e.path}`);
    const tag = !p ? 'NEW' : p.old === e.old && p.new === e.new ? 'same' : 'CHANGED';
    if (tag !== 'same') console.log(`${tag} ${e.url} ${e.path}\n  old: ${e.old}\n  new: ${e.new}`);
  }
  const out = { note: 'Reviewed FAQ wording changes against the live baseline: exact old and new text per page and JSON-LD path. Regenerate only after reviewing: node scripts/checks/run.mjs --approve-faq (docs/checks.md).', baseline: baseline.commit, entries: pending };
  fs.writeFileSync(FAQ_FILE, JSON.stringify(out, null, 1) + '\n');
  console.log(`Wrote ${pending.length} approved FAQ items to scripts/checks/faq-approved.json (${r.fails.length} other check-1 differences not affected).`);
  process.exit(0);
}

const results = [];
const { pages, idsByFile } = S.loadAll(DIST);
if (want(1)) results.push((await S.contract(DIST, baseline, allow, REPO, faq)).r);
if (want(2)) results.push(S.adsIndexing(DIST, baseline, pages));
if (want(3)) results.push(S.structure(DIST, pages, idsByFile));
if (want(4)) results.push(S.copyHygiene(pages));
if (want(5)) results.push(S.photoCredits(DIST, pages, REPO));

if ([6, 7, 8, 9, 10].some(want)) {
  const { browserChecks } = await import('./browser.mjs');
  results.push(...(await browserChecks({ DIST, REPO, pages: pages.filter((p) => !S.isRedirectPage(p.html)).map((p) => p.url), want })));
}

const status = (r) => (r.skipped ? 'SKIPPED' : r.fails.length ? 'FAIL' : 'PASS');
const report = {
  dist: DIST, baseline: baseline.commit, runtimeSec: Math.round((Date.now() - t0) / 100) / 10,
  summary: results.map((r) => ({ id: r.id, name: r.name, status: status(r), pass: r.passes, fail: r.fails.length, warn: r.warns.length, allowed: r.allowed || 0, info: r.info, skipped: r.skipped })),
  unusedAllowlist: want(1) ? [...allow.unused().map((e) => e.reason), ...faq.unused().map((e) => `faq-approved.json: ${e.url} ${e.path}`)] : [],
  results,
};
fs.writeFileSync(path.join(HERE, 'report.json'), JSON.stringify(report, null, 1));

const short = (o) => Object.entries(o).filter(([k]) => k !== 'page').map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`).join(' ').slice(0, 220);
for (const r of results) {
  console.log(`\n[${status(r)}] ${r.id}. ${r.name}  pass ${r.passes} · fail ${r.fails.length} · warn ${r.warns.length}${r.allowed ? ` · allowlisted ${r.allowed}` : ''}${r.info ? `  (${r.info})` : ''}${r.skipped ? `  ${r.skipped}` : ''}`);
  for (const f of r.fails.slice(0, 25)) console.log(`   FAIL ${f.page || ''} ${short(f)}`);
  if (r.fails.length > 25) console.log(`   … ${r.fails.length - 25} more failures in report.json`);
  for (const w of r.warns.slice(0, 8)) console.log(`   warn ${w.page || ''} ${short(w)}`);
  if (r.warns.length > 8) console.log(`   … ${r.warns.length - 8} more warnings in report.json`);
}
if (report.unusedAllowlist.length) console.log(`\nUnused allowlist entries: ${report.unusedAllowlist.join(' | ')}`);
const failed = results.filter((r) => r.fails.length).length;
// Every requested check is required: a skip is not a pass.
const skipped = results.filter((r) => r.skipped).length;
const bad = failed + skipped;
console.log(`\n${bad ? 'FAILED' : 'OK'}: ${results.length - bad} of ${results.length} checks passed, ${failed} failing, ${skipped} skipped${STATIC ? ' (static-only run: checks 6-10 not requested)' : ''}, ${report.runtimeSec}s. Report: scripts/checks/report.json`);
if (skipped) console.log('Skipped checks fail the run. Install a browser (see docs/checks.md: CHROME_PATH, PLAYWRIGHT_CORE) or run the static checks only: bun run check:site:static');
process.exit(bad ? 1 : 0);
