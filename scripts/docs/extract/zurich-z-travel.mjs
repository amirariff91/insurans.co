// Zurich Z-Travel Insurance (International) premium sheet, English, file pages 1 and 2.
// Page 1: premium without Section G (Covid-19 benefits)
// Page 2: additional premium for Section G (optional add-on, added to page 1)
import { pageLines, pdf, toks, findLine, checkTable, pushRow, cross, expectHeader } from './lib.mjs';

export const id = 'zurich-z-travel-international-premium-20250701';
export const file = 'zurich-ztravel-premium.pdf';
export const skipPages = { 3: 'Malay', 4: 'Malay' };

const PLANS = ['Silver Plan', 'Gold Plan', 'Diamond Plan'];
const TYPES = ['Individual', 'Individual & Spouse', 'Family', 'Senior'];
const AREAS = ['Area 1', 'Area 2', 'Area 3'];
const EXTRA = 'each additional week, up to 26 weeks';
const ROWS = ['1 - 5 days', '6 - 10 days', '11 - 15 days', '16 - 20 days', EXTRA, 'Annual Trip'];
const PAGES = [
  [1, 'premium without Section G Covid-19 benefits', /^Premium Table without Section G – Covid-19 Benefits\s*$/, 'Page 1 of 2'],
  [2, 'additional premium Section G Covid-19 benefits', /^Additional Premium for Section G – Covid-19 Benefits \(optional\)\s*$/, 'Page 2 of 2'],
];

export function extract(srcDir) {
  const cells = [];
  for (const [page, table, headRe, printed] of PAGES) {
    const lines = pageLines(pdf(srcDir, file), page);
    const h = findLine(lines, headRe, 0, table);
    // Insured types wrap: "Individual & Spouse" is split over three lines and its "(RM)" sits on a line of its own.
    const hEnd = expectHeader(lines, h, [
      'Silver Plan Gold Plan Diamond Plan',
      'Travel Individual Individual Individual',
      'Individual Family Senior Individual Family Senior Individual Family Senior',
      'Duration & Spouse & Spouse & Spouse',
      '(RM) (RM) (RM) (RM) (RM) (RM) (RM) (RM) (RM)',
      '(RM) (RM) (RM)',
    ], table);
    const end = findLine(lines, /^\s*Area of Travel:\s*$/, h, 'Area of Travel');
    findLine(lines, new RegExp(`/Premium/20250701\\s+${printed}\\s*$`), end, printed);
    let area = null;
    for (let i = hEnd + 1; i < end; i++) {
      const t = toks(lines[i]);
      if (!t.length) continue;
      if (t.length === 1 && /^Area \d$/.test(t[0])) {
        area = t[0];
        continue;
      }
      if (!area) continue;
      const cols = cross([area], cross(PLANS, TYPES));
      if (/^\d+ - \d+ days$/.test(t[0])) {
        pushRow(cells, { table, page, row: t[0], cols, values: t.slice(1) });
      } else if (t[0] === 'each additional') {
        const mid = toks(lines[i + 1]);
        const last = toks(lines[i + 2]);
        if (mid[0] !== 'week, up to 26' || last.join(' ') !== 'weeks')
          throw new Error(`[${table}] unexpected wrapped row: ${JSON.stringify([t, mid, last])}`);
        pushRow(cells, { table, page, row: EXTRA, cols, values: mid.slice(1) });
        i += 2;
      } else if (t[0] === 'Annual Trip') {
        // One merged "NA" spans Individual & Spouse and Family in each plan.
        const v = t.slice(1);
        if (v.length !== 9) throw new Error(`[${table}] Annual Trip: expected 9 printed cells, got ${JSON.stringify(v)}`);
        const values = [];
        for (let p = 0; p < 3; p++) {
          const [ind, na, sen] = v.slice(p * 3, p * 3 + 3);
          if (na !== 'NA') throw new Error(`[${table}] Annual Trip merged cell is not NA: ${na}`);
          values.push(ind, na, na, sen);
        }
        pushRow(cells, { table, page, row: 'Annual Trip', cols, values });
      } else {
        throw new Error(`[${table}] unrecognised line on page ${page}: ${JSON.stringify(lines[i])}`);
      }
    }
    checkTable(cells, table, { rows: ROWS, cols: cross(AREAS, cross(PLANS, TYPES)) });
  }
  return { id, method: 'text', cells };
}
