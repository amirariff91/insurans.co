// Shared helpers for the text-layer price-table parsers.
// Each parser reads one PDF's text layer with `pdftotext -layout` and returns
// a flat list of cells; `checkTable` makes each table fail loudly if its shape
// or values are not what the parser expects.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Lines of one file page (1-based), from the PDF's text layer. */
export function pageLines(pdfPath, page) {
  if (!existsSync(pdfPath)) throw new Error(`PDF not found: ${pdfPath}`);
  const out = execFileSync(
    'pdftotext',
    ['-layout', '-f', String(page), '-l', String(page), pdfPath, '-'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024 },
  );
  return out.split('\n');
}

export const pdf = (srcDir, name) => join(srcDir, name);

/** Split a layout line into cells on runs of two or more spaces. */
export const toks = (line) => line.trim().split(/\s{2,}/).filter(Boolean);

const NUM = /^(\d{1,3}(,\d{3})+|\d+)(\.\d+)?$/;
const WORDS = new Set(['NA', 'N/A', 'Not Applicable']);
export const isNum = (v) => NUM.test(v);
export const isValue = (v) => isNum(v) || WORDS.has(v);

/** Index of the first line matching `re` (from `from`), or throw. */
export function findLine(lines, re, from = 0, what = String(re)) {
  for (let i = from; i < lines.length; i++) if (re.test(lines[i])) return i;
  throw new Error(`heading not found: ${what}`);
}

/**
 * Self-check one table. `spec.rows` is the expected row labels in order,
 * `spec.cols` the expected column keys; every row x col must appear exactly
 * once (except pairs listed in `spec.absent` as "row|col"), every value must
 * be a number or a printed NA word.
 */
export function checkTable(cells, table, spec) {
  const mine = cells.filter((c) => c.table === table);
  const fail = (msg) => {
    throw new Error(`[${table}] self-check failed: ${msg}`);
  };
  const rows = [...new Set(mine.map((c) => c.row))];
  const cols = [...new Set(mine.map((c) => c.col))];
  if (rows.length !== spec.rows.length || rows.some((r, i) => r !== spec.rows[i]))
    fail(`rows ${JSON.stringify(rows)} != expected ${JSON.stringify(spec.rows)}`);
  if (cols.length !== spec.cols.length || cols.some((c) => !spec.cols.includes(c)))
    fail(`cols ${JSON.stringify(cols)} != expected ${JSON.stringify(spec.cols)}`);
  const absent = new Set(spec.absent ?? []);
  const seen = new Map();
  for (const c of mine) {
    const k = `${c.row}|${c.col}`;
    if (seen.has(k)) fail(`duplicate cell ${k}`);
    seen.set(k, c);
    if (c.value === undefined || c.value === null || c.value === '') fail(`empty cell ${k}`);
    if (!isValue(c.value)) fail(`value does not parse: ${k} = ${JSON.stringify(c.value)}`);
  }
  for (const r of spec.rows)
    for (const col of spec.cols) {
      const k = `${r}|${col}`;
      if (!seen.has(k) && !absent.has(k)) fail(`missing cell ${k}`);
      if (seen.has(k) && absent.has(k)) fail(`cell ${k} should be absent`);
    }
  const expected = spec.rows.length * spec.cols.length - absent.size;
  if (mine.length !== expected) fail(`${mine.length} cells, expected ${expected}`);
  return mine.length;
}

/** Push one row of values against a list of column keys. */
export function pushRow(cells, { table, page, row, cols, values }) {
  if (values.length !== cols.length)
    throw new Error(
      `[${table}] row "${row}" on page ${page}: ${values.length} values for ${cols.length} columns: ${JSON.stringify(values)}`,
    );
  values.forEach((value, i) => cells.push({ table, page, row, col: cols[i], value }));
}

/** Cartesian helper: ['A','B'] x ['x','y'] -> ['A > x','A > y','B > x','B > y'] */
export const cross = (outer, inner) => outer.flatMap((o) => inner.map((i) => `${o} > ${i}`));
