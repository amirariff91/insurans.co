#!/usr/bin/env node
// Compare two folders of cell files, cell by cell.
//   node scripts/docs/extract/compare.mjs <folder A> <folder B> [--report <file.md>]
// Report defaults to ~/.cache/insurans-docs/compare-report.md (outside the repo).
// Exit 1 if any cell disagrees or is in only one folder, 2 on bad input.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
let report = join(homedir(), '.cache', 'insurans-docs', 'compare-report.md');
const ri = args.indexOf('--report');
if (ri >= 0) {
  report = args[ri + 1];
  args.splice(ri, 2);
}
if (args.length !== 2) {
  console.error('usage: compare.mjs <folder A> <folder B> [--report <file.md>]');
  process.exit(2);
}
const [dirA, dirB] = args.map((a) => resolve(a));
if (resolve(report).startsWith(resolve(dirname(new URL(import.meta.url).pathname), '..', '..', '..')))
  console.warn(`warning: report path ${report} is inside the repo`);

/** Lower case; dash variants to "-"; spaces around dashes and runs of spaces collapsed;
 *  footnote marks (*, ^, †, ‡, superscript digits) dropped before NFKC (which would turn
 *  ¹ into 1); unit captions "(RM)" dropped. */
function normLabel(s) {
  return String(s)
    .replace(/[¹²³⁰-₟]/g, '') // superscript digits (footnote marks)
    .replace(/[*^†‡§]/g, '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‐-―−﹘﹣－]/g, '-')
    .replace(/\(rm\)/g, '')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s*>\s*/g, ' > ')
    .replace(/\s+/g, ' ')
    .trim();
}
const key = (c) => [c.table, c.row, c.col].map(normLabel).join(' | ');

function parseNum(v) {
  const s = String(v).trim().replace(/,/g, '');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
}
function same(a, b) {
  const x = parseNum(a);
  const y = parseNum(b);
  if (x !== null && y !== null) return Math.abs(x - y) < 1e-9;
  return normLabel(a) === normLabel(b);
}

function load(dir) {
  const out = new Map();
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.json')).sort()) {
    const doc = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    if (!doc.id || !Array.isArray(doc.cells)) throw new Error(`${join(dir, f)}: not a cell file`);
    const cells = new Map();
    const dups = [];
    for (const c of doc.cells) {
      const k = key(c);
      if (cells.has(k)) dups.push(k);
      cells.set(k, c);
    }
    out.set(doc.id, { file: f, method: doc.method, cells, dups });
  }
  return out;
}

let A, B;
try {
  A = load(dirA);
  B = load(dirB);
} catch (e) {
  console.error(e.message);
  process.exit(2);
}

const md = [`# Cell comparison`, '', `- A: \`${dirA}\``, `- B: \`${dirB}\``, `- Run: ${new Date().toISOString()}`, ''];
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
  if (dups) detail.push('### Duplicate keys after normalising', '', ...[...a.dups.map((k) => `- A: ${k}`), ...b.dups.map((k) => `- B: ${k}`)], '');
  if (!differ.length && !onlyA.length && !onlyB.length && !dups) detail.push('All cells agree.', '');
}

md.push('## Summary', '', ...summary, '', ...detail);
mkdirSync(dirname(resolve(report)), { recursive: true });
writeFileSync(report, md.join('\n') + '\n');
console.log(`report: ${resolve(report)}`);
console.log(bad ? 'RESULT: differences found' : 'RESULT: all cells agree');
process.exit(bad ? 1 : 0);
