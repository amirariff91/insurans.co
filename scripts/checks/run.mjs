#!/usr/bin/env node
// insurans.co site checks. Run after `bun run build`:  bun run check:site
// Options (env): DIST (default ./dist), CHROME_PATH, CHECKS=1,2,6 (subset), SKIP_BROWSER=1.
// Writes scripts/checks/report.json; exits 1 on any failure. See docs/checks.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S from './static.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../..');
const DIST = path.resolve(process.env.DIST || path.join(REPO, 'dist'));
const ONLY = process.env.CHECKS ? new Set(process.env.CHECKS.split(',').map(Number)) : null;
const want = (n) => !ONLY || ONLY.has(n);
const t0 = Date.now();

if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error(`No build at ${DIST}. Run: bun run build`); process.exit(2); }
const baselineFile = fs.readdirSync(HERE).find((f) => /^baseline-.+\.json$/.test(f));
const baseline = JSON.parse(fs.readFileSync(path.join(HERE, baselineFile), 'utf8'));
const allowJson = JSON.parse(fs.readFileSync(path.join(HERE, 'allowlist.json'), 'utf8'));
const allow = S.makeAllow(allowJson.entries);

const results = [];
const { pages, idsByFile } = S.loadAll(DIST);
if (want(1)) results.push(S.contract(DIST, baseline, allow).r);
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
  unusedAllowlist: want(1) ? allow.unused().map((e) => e.reason) : [],
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
console.log(`\n${failed ? 'FAILED' : 'OK'}: ${results.length} checks, ${failed} failing, ${results.filter((r) => r.skipped).length} skipped, ${report.runtimeSec}s. Report: scripts/checks/report.json`);
process.exit(failed ? 1 : 0);
