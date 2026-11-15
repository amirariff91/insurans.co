// Etiqa OneMedical annual premium tables (two registered files, same layout).
// Prices are on file page 1 only; file page 2 carries the notes.
import { pageLines, pdf, toks, findLine, checkTable, pushRow, expectHeader } from './lib.mjs';

export const docs = [
  { id: 'etiqa-onemedical-premium-table-jun2026', file: 'etiqa-om-premium-jun2026.pdf' },
  { id: 'etiqa-onemedical-premium-table-until-may2026', file: 'etiqa-om-premium.pdf' },
];

const COLS = ['Plan 1', 'Plan 2', 'Plan 3'];
const ROWS = [
  '1–5', '6 – 10', '11 – 16', '17 – 20', '21 – 25', '26 – 30', '31 – 35', '36 – 40',
  '41 – 45', '46 – 50', '51 – 55',
  ...Array.from({ length: 29 }, (_, k) => `${56 + k}*`),
];
const LEFT = 'annual premium no deductible';
const RIGHT = 'annual premium RM1,000 deductible';

function one({ id, file }, srcDir) {
  const page = 1;
  const lines = pageLines(pdf(srcDir, file), page);
  const title = findLine(lines, /^OneMedical - Table of Annual Premium Rates \(Male & Female\)\s*$/, 0, 'title');
  // Left half = no deductible, right half = RM1,000 deductible, each Plan 1, 2, 3 in that order.
  const h = expectHeader(lines, title, [
    'No Deductible RM1,000 Deductible',
    'Age Next Age Next',
    'Plan 1 Plan 2 Plan 3 Plan 1 Plan 2 Plan 3',
    'Birthday Birthday',
    '(RM) (RM) (RM) (RM) (RM) (RM)',
    '(ANB) (ANB)',
  ], id);
  const end = findLine(lines, /^\* Applicable for renewal only\.\s*$/, h, 'footnote');
  const cells = [];
  for (let i = h + 1; i < end; i++) {
    const t = toks(lines[i]);
    if (!/^\d+(\s?–\s?\d+)?\*?$/.test(t[0] ?? '')) continue;
    if (t.length !== 8 || t[4] !== t[0]) throw new Error(`[${id}] bad row: ${JSON.stringify(t)}`);
    pushRow(cells, { table: LEFT, page, row: t[0], cols: COLS, values: t.slice(1, 4) });
    pushRow(cells, { table: RIGHT, page, row: t[4], cols: COLS, values: t.slice(5, 8) });
  }
  checkTable(cells, LEFT, { rows: ROWS, cols: COLS });
  checkTable(cells, RIGHT, { rows: ROWS, cols: COLS });
  const notes = pageLines(pdf(srcDir, file), 2).join('\n');
  if (!/occupational class 1 and 2 only/.test(notes)) throw new Error(`[${id}] occupational-class note not found on page 2`);
  return { id, method: 'text', cells };
}

export function extract(srcDir) {
  return docs.map((d) => one(d, srcDir));
}
