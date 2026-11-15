#!/usr/bin/env node
// Watch the document register for changes (see docs/document-register.md).
// Usage: bun run docs:watch [--out <report.md>]
// Read-only towards the repository: it never writes into the repo and never edits documents.json.
// Documents are hashed in memory and not saved anywhere.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const register = JSON.parse(readFileSync(join(root, 'src', 'data', 'documents.json'), 'utf8'));

const SCRATCH = join(homedir(), '.cache', 'insurans-docs', 'watch');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const PAUSE_MS = 600; // at most two requests a second to one host
const TIMEOUT_MS = 90_000;
const RETRY_PAUSE_MS = 3_000;

const today = new Date().toISOString().slice(0, 10);
const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const out = resolve(outIdx >= 0 && args[outIdx + 1] ? args[outIdx + 1] : join(SCRATCH, `watch-${today}.md`));
const rel = relative(root, out);
if (!rel.startsWith('..') && !isAbsolute(rel)) {
  console.error(`docs:watch: refusing to write the report inside the repository (${out}); pick a path outside it`);
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lastHit = new Map();
async function politeFetch(url) {
  const host = new URL(url).host;
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const wait = (lastHit.get(host) ?? 0) + PAUSE_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastHit.set(host, Date.now());
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: '*/*' },
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const body = Buffer.from(await res.arrayBuffer());
      if (res.ok || attempt === 2) return { status: res.status, finalUrl: res.url, type: res.headers.get('content-type') ?? '', body };
      lastErr = `HTTP ${res.status}`;
    } catch (e) {
      lastErr = e.name === 'TimeoutError' ? `timed out after ${TIMEOUT_MS / 1000} s` : e.message;
      if (attempt === 2) return { status: 0, error: lastErr };
    }
    await sleep(RETRY_PAUSE_MS);
  }
  return { status: 0, error: lastErr };
}

// Normalise a URL for comparison: decode, drop the fragment, keep the query.
function norm(u) {
  try {
    const x = new URL(u);
    x.hash = '';
    return decodeURI(x.href).replace(/^http:/, 'https:').replace('://s3.ap-southeast-1.', '://s3-ap-southeast-1.');
  } catch { return u; }
}
function pdfLinks(html, base) {
  const found = new Set();
  const re = /(?:href|src|data-href)\s*=\s*["']([^"']+?\.pdf(?:\?[^"']*)?)["']|["'](https?:\/\/[^"'\s]+?\.pdf)["']/gi;
  for (const m of html.matchAll(re)) {
    const raw = (m[1] ?? m[2]).replace(/&amp;/g, '&');
    try { found.add(norm(new URL(raw, base).href)); } catch { /* ignore */ }
  }
  return found;
}

const docs = register.documents;
const live = docs.filter((d) => d.status === 'live');
const known = new Set(docs.map((d) => norm(d.url)));

const changed = [], dead = [], unchanged = [], pageErrors = [], newLinks = [], unlinked = [];

// Product pages first.
const pages = [...new Set(live.map((d) => d.productPage).filter(Boolean))];
for (const page of pages) {
  const r = await politeFetch(page);
  if (r.status !== 200 || !/html/i.test(r.type)) {
    pageErrors.push({ page, why: r.error ?? `HTTP ${r.status}${r.type ? `, ${r.type.split(';')[0]}` : ''}` });
    continue;
  }
  const links = pdfLinks(r.body.toString('utf8'), r.finalUrl || page);
  for (const l of links) if (!known.has(l)) newLinks.push({ page, url: l });
  for (const d of live.filter((x) => x.productPage === page)) if (!links.has(norm(d.url))) unlinked.push({ id: d.id, page });
}

// Then each live document.
for (const d of live) {
  const r = await politeFetch(d.url);
  if (r.status !== 200) {
    dead.push({ id: d.id, url: d.url, why: r.error ?? `HTTP ${r.status}` });
    continue;
  }
  const isPdf = r.body.subarray(0, 5).toString('latin1') === '%PDF-';
  if (!isPdf) {
    dead.push({ id: d.id, url: d.url, why: `HTTP 200 but not a PDF (${r.type.split(';')[0] || 'no type'}${r.finalUrl !== d.url ? `, landed on ${r.finalUrl}` : ''})` });
    continue;
  }
  const sha = createHash('sha256').update(r.body).digest('hex');
  const bytes = r.body.length;
  if (sha !== d.sha256 || bytes !== d.bytes) changed.push({ id: d.id, url: d.url, was: `${d.bytes} bytes, ${d.sha256.slice(0, 12)}…`, now: `${bytes} bytes, ${sha.slice(0, 12)}…` });
  else unchanged.push(d.id);
}

const lines = [
  `# Document register watch, ${today}`,
  '',
  `Register updated ${register.updated}; ${docs.length} rows, ${live.length} live. Product pages checked: ${pages.length}.`,
  'Nothing was changed in the repository. A change below needs a person to read the new document.',
  '',
];
const section = (title, rows, fmt) => {
  lines.push(`## ${title} (${rows.length})`, '');
  if (!rows.length) lines.push('None.', '');
  else { for (const r of rows) lines.push(`- ${fmt(r)}`); lines.push(''); }
};
section('Changed: hash or size differs from the register', changed, (r) => `\`${r.id}\`: was ${r.was}; now ${r.now}. <${r.url}>`);
section('No longer loads', dead, (r) => `\`${r.id}\`: ${r.why}. <${r.url}>`);
section('PDF links on a product page that are not in the register', newLinks, (r) => `<${r.url}> on <${r.page}>`);
section('Registered documents no longer linked from their product page', unlinked, (r) => `\`${r.id}\` not found on <${r.page}>`);
section('Product pages that could not be read', pageErrors, (r) => `<${r.page}>: ${r.why}`);
section('Unchanged', unchanged, (r) => `\`${r}\``);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join('\n'));
console.log(
  `docs:watch: ${live.length} live, ${unchanged.length} unchanged, ${changed.length} changed, ${dead.length} not loading, ` +
  `${newLinks.length} unregistered PDF links, ${unlinked.length} no longer linked, ${pageErrors.length} product pages unreadable. Report: ${out}`,
);
