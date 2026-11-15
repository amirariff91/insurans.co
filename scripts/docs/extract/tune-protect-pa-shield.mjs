// Tune Protect PA Shield brochure: premium table, English, file page 6.
import { pageLines, pdf, toks, findLine, checkTable, pushRow, expectHeader } from './lib.mjs';

export const id = 'tune-protect-pa-shield-brochure-072025';
export const file = 'tune-pashield-brochure.pdf';
export const skipPages = { 12: 'Malay' };

const COLS = ['Plan 1', 'plan 2', 'Plan 3', 'Plan 4', 'Plan 5']; // "plan 2" is printed lower case
const ROWS = ['Class 1 & Class 2', 'Class 3'];
const TABLES = [
  ['annual premium without weekly benefits', /^\s*Annual Premium without Weekly Benefits\s*$/],
  ['annual premium with weekly benefits', /^\s*Annual Premium with Weekly Benefits\s*$/],
];

export function extract(srcDir) {
  const page = 6;
  const lines = pageLines(pdf(srcDir, file), page);
  const cap = findLine(lines, /^\s+Premium \(RM\)\s*$/, 0, 'Premium (RM) caption');
  // Full header, top to bottom; columns below are assigned by position.
  const head = expectHeader(lines, cap, ['Premium Rates Plan 1 plan 2 Plan 3 Plan 4 Plan 5'], 'premium rates');
  const cells = [];
  for (const [table, re] of TABLES) {
    let i = findLine(lines, re, head, table) + 1;
    expectHeader(lines, i - 1, ['Occupation'], table);
    for (const row of ROWS) {
      i++;
      while (!lines[i].trim()) i++;
      const t = toks(lines[i]);
      if (t[0] !== row) throw new Error(`[${table}] expected row "${row}", got ${JSON.stringify(t)}`);
      pushRow(cells, { table, page, row, cols: COLS, values: t.slice(1) });
    }
    checkTable(cells, table, { rows: ROWS, cols: COLS });
  }
  if (!lines.some((l) => /premium above are excluded 8% Service Tax and RM10 Stamp Duty/.test(l)))
    throw new Error('tax note not found: meaning of the figures may have changed');
  return { id, method: 'text', cells };
}
