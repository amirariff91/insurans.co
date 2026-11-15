#!/usr/bin/env node
// Validate src/data/documents.json, the document register (see docs/document-register.md).
// Usage: bun run docs:validate   (exit code 1 on any problem)
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dataDir = join(root, 'src', 'data');
const registerPath = join(dataDir, 'documents.json');

const TYPES = ['pds', 'brochure', 'wording', 'price-table', 'flyer'];
const LANGUAGES = ['en', 'ms', 'en+ms', 'zh', 'other'];
const PRICE_TABLE = ['full', 'example', 'template', 'none'];
const STATUS = ['live', 'replaced', 'dead', 'archived-copy'];
const REQUIRED = [
  'id', 'line', 'insurer', 'plan', 'type', 'language', 'url', 'productPage',
  'retrieved', 'sha256', 'bytes', 'pages', 'textLayer', 'priceTable', 'status',
];
const OPTIONAL = [
  'entity', 'planSlug', 'printedVersion', 'printedVersionPage', 'priceTablePages', 'supersedes', 'notes',
];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

function isIsoDate(s) {
  if (typeof s !== 'string' || !ISO_DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
function isHttps(s) {
  if (typeof s !== 'string') return false;
  try { return new URL(s).protocol === 'https:'; } catch { return false; }
}
function isPosInt(n) { return Number.isInteger(n) && n > 0; }
function checkPageRef(where, field, v, pages) {
  if (v === null || v === undefined) return;
  if (typeof v !== 'object' || Array.isArray(v)) return fail(where, `${field} must be an object { file, printed } or null`);
  const files = Array.isArray(v.file) ? v.file : [v.file];
  for (const p of files) {
    if (!isPosInt(p)) fail(where, `${field}.file must be a page number (or list of page numbers), got ${JSON.stringify(v.file)}`);
    else if (isPosInt(pages) && p > pages) fail(where, `${field}.file page ${p} is beyond the document's ${pages} pages`);
  }
  if (v.printed !== null && v.printed !== undefined) {
    if (Array.isArray(v.file)) {
      if (!Array.isArray(v.printed) || v.printed.length !== v.file.length) fail(where, `${field}.printed must be null or a list as long as ${field}.file`);
    } else if (typeof v.printed !== 'string') fail(where, `${field}.printed must be a string or null`);
  }
}

const planCache = new Map();
function planSlugs(line) {
  if (planCache.has(line)) return planCache.get(line);
  const p = join(dataDir, `${line}.json`);
  let slugs = null;
  if (existsSync(p)) {
    try {
      const d = JSON.parse(readFileSync(p, 'utf8'));
      const recs = Array.isArray(d) ? d : d.records ?? d.plans ?? [];
      slugs = new Set(recs.map((r) => r && r.slug).filter(Boolean));
    } catch (e) { slugs = null; }
  }
  planCache.set(line, slugs);
  return slugs;
}

let reg;
try {
  reg = JSON.parse(readFileSync(registerPath, 'utf8'));
} catch (e) {
  console.error(`documents.json: cannot read or parse: ${e.message}`);
  process.exit(1);
}

if (!isIsoDate(reg.updated)) fail('documents.json', `"updated" must be an ISO date, got ${JSON.stringify(reg.updated)}`);
if (!Array.isArray(reg.documents)) {
  fail('documents.json', '"documents" must be an array');
  reg.documents = [];
}

const ids = new Map();
reg.documents.forEach((d, i) => { if (d && typeof d.id === 'string') ids.set(d.id, (ids.get(d.id) ?? 0) + 1); });
const urls = new Map();

reg.documents.forEach((d, i) => {
  const where = `row ${i + 1} (${d && d.id ? d.id : 'no id'})`;
  if (!d || typeof d !== 'object' || Array.isArray(d)) return fail(where, 'row must be an object');

  for (const f of REQUIRED) if (d[f] === undefined || d[f] === null || d[f] === '') fail(where, `missing required field "${f}"`);
  for (const f of Object.keys(d)) if (!REQUIRED.includes(f) && !OPTIONAL.includes(f)) fail(where, `unknown field "${f}"`);

  if (typeof d.id === 'string' && !SLUG.test(d.id)) fail(where, 'id must be a lower-case slug');
  if (ids.get(d.id) > 1) fail(where, `duplicate id "${d.id}"`);
  if (d.type !== undefined && !TYPES.includes(d.type)) fail(where, `type "${d.type}" is not one of ${TYPES.join(', ')}`);
  if (d.language !== undefined && !LANGUAGES.includes(d.language)) fail(where, `language "${d.language}" is not one of ${LANGUAGES.join(', ')}`);
  if (d.priceTable !== undefined && !PRICE_TABLE.includes(d.priceTable)) fail(where, `priceTable "${d.priceTable}" is not one of ${PRICE_TABLE.join(', ')}`);
  if (d.status !== undefined && !STATUS.includes(d.status)) fail(where, `status "${d.status}" is not one of ${STATUS.join(', ')}`);

  for (const f of ['url', 'productPage']) if (d[f] !== undefined && d[f] !== null && !isHttps(d[f])) fail(where, `${f} must be an https URL, got ${JSON.stringify(d[f])}`);
  if (typeof d.url === 'string') {
    if (urls.has(d.url)) fail(where, `url is already registered by row "${urls.get(d.url)}"`);
    else urls.set(d.url, d.id);
  }
  if (d.retrieved !== undefined && !isIsoDate(d.retrieved)) fail(where, `retrieved must be an ISO date (YYYY-MM-DD), got ${JSON.stringify(d.retrieved)}`);
  if (d.sha256 !== undefined && !(typeof d.sha256 === 'string' && /^[0-9a-f]{64}$/.test(d.sha256))) fail(where, 'sha256 must be 64 lower-case hex characters');
  if (d.bytes !== undefined && !isPosInt(d.bytes)) fail(where, 'bytes must be a positive integer');
  if (d.pages !== undefined && !isPosInt(d.pages)) fail(where, 'pages must be a positive integer');
  if (d.textLayer !== undefined && typeof d.textLayer !== 'boolean') fail(where, 'textLayer must be true or false');

  if (d.printedVersion !== undefined && d.printedVersion !== null && typeof d.printedVersion !== 'string') fail(where, 'printedVersion must be a string or null');
  if (typeof d.printedVersion === 'string' && !d.printedVersionPage) fail(where, 'printedVersion is given without printedVersionPage');
  checkPageRef(where, 'printedVersionPage', d.printedVersionPage, d.pages);
  checkPageRef(where, 'priceTablePages', d.priceTablePages, d.pages);
  if (['full', 'example'].includes(d.priceTable) && !d.priceTablePages) fail(where, `priceTable "${d.priceTable}" needs priceTablePages`);
  if (d.priceTable === 'none' && d.priceTablePages) fail(where, 'priceTable "none" must not list priceTablePages');

  if (d.planSlug !== undefined && d.planSlug !== null) {
    const slugs = planSlugs(d.line);
    if (slugs === null) fail(where, `planSlug given but src/data/${d.line}.json does not exist or has no records`);
    else if (!slugs.has(d.planSlug)) fail(where, `planSlug "${d.planSlug}" is not a record slug in src/data/${d.line}.json`);
  }
  if (d.supersedes !== undefined && d.supersedes !== null) {
    if (d.supersedes === d.id) fail(where, 'supersedes points at itself');
    else if (!ids.has(d.supersedes)) fail(where, `supersedes "${d.supersedes}" is not an id in the register`);
  }
  if (d.notes !== undefined && d.notes !== null && typeof d.notes !== 'string') fail(where, 'notes must be a string');
  for (const f of ['entity', 'plan', 'insurer', 'line']) if (d[f] !== undefined && d[f] !== null && typeof d[f] !== 'string') fail(where, `${f} must be a string`);
});

if (problems.length) {
  for (const p of problems) console.error(`✗ ${p}`);
  console.error(`docs:validate: ${problems.length} problem(s) in ${reg.documents.length} row(s)`);
  process.exit(1);
}
console.log(`docs:validate: ${reg.documents.length} row(s), no problems`);
