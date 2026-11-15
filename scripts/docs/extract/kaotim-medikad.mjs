// Takaful Malaysia Kaotim MediKad PDS appendix, file pages 8 to 11.
// Page 8: annual contribution, MediKad (the plan)
// Page 9: monthly contribution, MediKad
// Page 10: annual contribution, MediBooster (the top-up)
// Page 11: monthly contribution, MediBooster
import { pageLines, pdf, toks, findLine, checkTable, pushRow, cross, expectHeader } from './lib.mjs';

export const id = 'kaotim-medikad-pds-en-29072026';
export const file = 'kaotim-medikad-pds.pdf';

const COLS = cross(['MALE', 'FEMALE'], ['Standard', 'Pro', 'Max']);
const ROWS = [
  '6 - 10', '11 - 15', '16 - 20', '21 - 25', '26 - 30', '31 - 35', '36 - 40', '41 - 45',
  '46 - 50', '51 - 55', '56 - 59',
  ...Array.from({ length: 25 }, (_, k) => String(60 + k)),
];
const TIERS = 'Standard Pro Max Standard Pro Max';
const PAGES = [
  [8, 'annual contribution MediKad', 'Annual Contribution for MediKad', 'Page 5 of 8', ['Age MALE FEMALE', TIERS]],
  [9, 'monthly contribution MediKad', 'Monthly Contribution for MediKad', 'Page 6 of 8', ['MALE FEMALE', 'Age', TIERS]],
  [10, 'annual contribution MediBooster', 'Annual Contribution for MediBooster', 'Page 7 of 8', ['MALE FEMALE', 'Age', TIERS]],
  [11, 'monthly contribution MediBooster', 'Monthly Contribution for MediBooster', 'Page 8 of 8', ['MALE FEMALE', 'Age', TIERS]],
];

export function extract(srcDir) {
  const cells = [];
  for (const [page, table, heading, printed, header] of PAGES) {
    const lines = pageLines(pdf(srcDir, file), page);
    const h = findLine(lines, new RegExp(`^\\s*${heading}\\s*$`), 0, heading);
    const hEnd = expectHeader(lines, h, header, table);
    const end = findLine(lines, /The age above is based on the age of the next birthday/, h, 'ANB note');
    findLine(lines, new RegExp(printed), end, `printed page "${printed}"`);
    for (let i = hEnd + 1; i < end; i++) {
      const t = toks(lines[i]);
      if (/^\d+( - \d+)?$/.test(t[0] ?? '')) pushRow(cells, { table, page, row: t[0], cols: COLS, values: t.slice(1) });
    }
    checkTable(cells, table, { rows: ROWS, cols: COLS });
  }
  return { id, method: 'text', cells };
}
