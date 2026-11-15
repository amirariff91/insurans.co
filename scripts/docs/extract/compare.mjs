#!/usr/bin/env node
// Compare two folders of cell files, cell by cell, strictly.
//   node scripts/docs/extract/compare.mjs <folder A> <folder B> [--map <naming-map.json>] [--report <file.md>]
// --map renames folder B's tables and columns onto folder A's names (see naming-map.json);
// it never changes a row label's text or a value.
// Report defaults to ~/.cache/insurans-docs/compare-report.md (outside the repo).
// Exit 1 if any cell disagrees, is in only one folder, or a key is duplicated; 2 on bad input.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const report = opt('--report') ?? join(homedir(), '.cache', 'insurans-docs', 'compare-report.md');
const mapPath = opt('--map');
if (args.length !== 2) {
  console.error('usage: compare.mjs <folder A> <folder B> [--map <naming-map.json>] [--report <file.md>]');
  process.exit(2);
}
const [dirA, dirB] = args.map((a) => resolve(a));

/** Formatting only: lower case, dash variants to "-", spaces around "-" and ">" and runs of
 *  spaces collapsed. Footnote marks and other annotations are kept and must match. */
function normLabel(s) {
  return String(s)
    .toLowerCase()
    .replace(/[‐-―−﹘﹣－]/g, '-')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s*>\s*/g, ' > ')
    .replace(/\s+/g, ' ')
    .trim();
}
const key = (c) => [c.table, c.row, c.col].map(normLabel).join(' | ');

const NUM = /^(\d{1,3}(,\d{3})+|\d+)(\.\d+)?$/;
/** Canonical decimal string, or null if the value is not a plainly printed number.
 *  Commas are accepted only in proper groups of three. "1,539" -> "1539", "86.00" -> "86". */
function canonical(v) {
  const s = String(v).trim();
  if (!NUM.test(s)) return null;
  let [int, frac = ''] = s.replace(/,/g, '').split('.');
  int = int.replace(/^0+(?=\d)/, '');
  frac = frac.replace(/0+$/, '');
  return frac ? `${int}.${frac}` : int;
}
function same(a, b) {
  const x = canonical(a);
  const y = canonical(b);
  if (x !== null && y !== null) return x === y;
  return String(a) === String(b);
}

function loadMap(path) {
  if (!path) return {};
  const m = JSON.parse(readFileSync(path, 'utf8'));
  for (const [id, entry] of Object.entries(m)) {
    if (id.startsWith('$')) continue;
    for (const d of entry.dropFromCol ?? [])
      if (typeof d !== 'string' || !d.includes('(RM)') && !d.includes('(%)'))
        throw new Error(`map ${id}: dropFromCol may only remove unit captions, got ${JSON.stringify(d)}`);
    for (const [from, t] of Object.entries(entry.tables ?? {})) {
      if (typeof t.table !== 'string') throw new Error(`map ${id} / ${from}: "table" is required`);
      if (t.rowToCol && typeof t.row !== 'string') throw new Error(`map ${id} / ${from}: rowToCol needs "row"`);
      for (const k of Object.keys(t))
        if (!['table', 'colPrefix', 'rowToCol', 'row'].includes(k)) throw new Error(`map ${id} / ${from}: unknown field ${k}`);
    }
  }
  return m;
}

/** Apply one document's naming map to a cell (folder B side). Values are never touched. */
function mapCell(c, entry, used) {
  if (!entry) return c;
  let { table, row, col } = c;
  for (const d of entry.dropFromCol ?? []) col = col.split(d).join('');
  const t = entry.tables?.[table];
  if (t) {
    used.add(table);
    table = t.table;
    if (t.rowToCol) {
      // The table name carried the group (e.g. insured type) and the row the area:
      // the printed row label moves verbatim to the front of the column key.
      col = `${row} > ${col}`;
      row = t.row;
    }
    if (t.colPrefix) col = `${t.colPrefix} > ${col}`;
  }
  return { ...c, table, row, col };
}

function load(dir, map = {}) {
  const out = new Map();
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.json')).sort()) {
    const doc = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    if (!doc.id || !Array.isArray(doc.cells)) throw new Error(`${join(dir, f)}: not a cell file`);
    if (out.has(doc.id)) throw new Error(`${dir}: two files carry id "${doc.id}": ${out.get(doc.id).file} and ${f}`);
    const entry = map[doc.id];
    const used = new Set();
    const cells = new Map();
    const dups = [];
    for (const raw of doc.cells) {
      const c = mapCell(raw, entry, used);
      const k = key(c);
      if (cells.has(k)) dups.push([k, cells.get(k).value, c.value]);
      else cells.set(k, c);
    }
    const unused = Object.keys(entry?.tables ?? {}).filter((t) => !used.has(t));
    out.set(doc.id, { file: f, method: doc.method, cells, dups, unused });
  }
  return out;
}

let A, B;
try {
  A = load(dirA);
  B = load(dirB, loadMap(mapPath));
} catch (e) {
  console.error(e.message);
  process.exit(2);
}
for (const [id, d] of B) if (d.unused.length) console.warn(`warning: ${id}: map tables not found in B: ${d.unused.join('; ')}`);

const md = [`# Cell comparison`, '', `- A: \`${dirA}\``, `- B: \`${dirB}\``, `- Map applied to B: ${mapPath ? `\`${resolve(mapPath)}\`` : 'none'}`, `- Run: ${new Date().toISOString()}`, ''];
const summary = ['| Document | Agree | Disagree | Only A | Only B | Duplicate keys |', '|---|---:|---:|---:|---:|---:|'];
const detail = [];
let bad = false;
const esc = (s) => String(s).replace(/\|/g, '\\|');

for (const id of [...new Set([...A.keys(), ...B.keys()])].sort()) {
  const a = A.get(id);
  const b = B.get(id);
  if (!a || !b) {
    bad = true;
    const side = a ? 'A' : 'B';
    const n = (a ?? b).cells.size;
    console.log(`${id}: only in ${side} (${n} cells)`);
    summary.push(`| ${id} | 0 | 0 | ${a ? n : 0} | ${b ? n : 0} | 0 |`);
    detail.push(`## ${id}`, '', `Document only in folder ${side}.`, '');
    continue;
  }
  const agree = [];
  const differ = [];
  const onlyA = [];
  const onlyB = [];
  for (const [k, ca] of a.cells) {
    const cb = b.cells.get(k);
    if (!cb) onlyA.push(ca);
    else if (same(ca.value, cb.value)) agree.push(k);
    else differ.push([ca, cb]);
  }
  for (const [k, cb] of b.cells) if (!a.cells.has(k)) onlyB.push(cb);
  const dups = a.dups.length + b.dups.length;
  if (differ.length || onlyA.length || onlyB.length || dups) bad = true;
  console.log(
    `${id}: ${agree.length} agree, ${differ.length} disagree, ${onlyA.length} only in A, ${onlyB.length} only in B` +
      (dups ? `, ${dups} duplicate keys` : ''),
  );
  summary.push(`| ${id} | ${agree.length} | ${differ.length} | ${onlyA.length} | ${onlyB.length} | ${dups} |`);
  detail.push(`## ${id}`, '');
  const cellRow = (c) => `| ${esc(c.table)} | ${c.page ?? ''} | ${esc(c.row)} | ${esc(c.col)} | ${esc(c.value)} |`;
  if (differ.length) {
    detail.push('### Disagree', '', '| Table | Page A | Page B | Row | Column | A | B |', '|---|---|---|---|---|---|---|');
    for (const [ca, cb] of differ)
      detail.push(`| ${esc(ca.table)} | ${ca.page ?? ''} | ${cb.page ?? ''} | ${esc(ca.row)} | ${esc(ca.col)} | ${esc(ca.value)} | ${esc(cb.value)} |`);
    detail.push('');
  }
  for (const [label, list] of [['Only in A', onlyA], ['Only in B', onlyB]]) {
    if (!list.length) continue;
    detail.push(`### ${label}`, '', '| Table | Page | Row | Column | Value |', '|---|---|---|---|---|', ...list.map(cellRow), '');
  }
  if (dups)
    detail.push(
      '### Duplicate keys after normalising',
      '',
      ...a.dups.map(([k, v1, v2]) => `- A: ${k}: values ${v1} and ${v2}`),
      ...b.dups.map(([k, v1, v2]) => `- B: ${k}: values ${v1} and ${v2}`),
      '',
    );
  if (!differ.length && !onlyA.length && !onlyB.length && !dups) detail.push('All cells agree.', '');
}

md.push('## Summary', '', ...summary, '', ...detail);
mkdirSync(dirname(resolve(report)), { recursive: true });
writeFileSync(report, md.join('\n') + '\n');
console.log(`report: ${resolve(report)}`);
console.log(bad ? 'RESULT: differences found' : 'RESULT: all cells agree');
process.exit(bad ? 1 : 0);
