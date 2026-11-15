// Allianz Travel Easy brochure (English): premium rates, file page 1 (one tall page).
import { pageLines, pdf, toks, findLine, checkTable, pushRow } from './lib.mjs';

export const id = 'allianz-travel-easy-brochure-en';
export const file = 'allianz-ate-brochure.pdf';

const TRIP_COLS = ['Domestic', 'Overseas > Asia', 'Overseas > Worldwide'];
const DAYS = ['1 - 5 days', '6 - 10 days', '11 - 15 days', '16 - 22 days', '23 - 31 days'];
const EXTRA = 'Each additional week or part';

function tripTable(lines, page, cells, table, startRe, endRe, withAnnual) {
  const start = findLine(lines, startRe, 0, table);
  const end = findLine(lines, endRe, start + 1, `end of ${table}`);
  for (let i = start + 1; i < end; i++) {
    const line = lines[i];
    const t = toks(line);
    if (!t.length) continue;
    if (/^\d+ - \d+ days$/.test(t[0]) || t[0] === 'Annual Plan') {
      pushRow(cells, { table, page, row: t[0], cols: TRIP_COLS, values: t.slice(1) });
    } else if (t[0] === 'Each additional') {
      // Label and the Domestic cell wrap over two lines:
      //   "Each additional        Not"
      //   "week or part        Applicable     28     67"
      const next = toks(lines[i + 1]);
      if (t[1] !== 'Not' || next[0] !== 'week or part' || next[1] !== 'Applicable')
        throw new Error(`[${table}] unexpected wrapped row: ${JSON.stringify([t, next])}`);
      pushRow(cells, { table, page, row: EXTRA, cols: TRIP_COLS, values: ['Not Applicable', ...next.slice(2)] });
      i++;
    }
  }
  const rows = [...DAYS, EXTRA, ...(withAnnual ? ['Annual Plan'] : [])];
  checkTable(cells, table, { rows, cols: TRIP_COLS });
}

export function extract(srcDir) {
  const page = 1;
  const lines = pageLines(pdf(srcDir, file), page);
  const cells = [];
  const pr = findLine(lines, /^Premium Rates\s*$/, 0, 'Premium Rates');
  const adults = /^\s*Adults \(18 to 70 years old\) and Children \(30 days to 17 years old\)\s*$/;
  const seniors = /^\s*Senior Citizens \(71 to 85 years old\)\s*$/;
  if (findLine(lines, adults, 0) < pr) throw new Error('adults table before Premium Rates heading');
  tripTable(lines, page, cells, 'premium adults and children', adults, seniors, true);
  tripTable(lines, page, cells, 'premium senior citizens', seniors, /^Optional Bene/, false);

  // Optional benefit: High Altitude Mountaineering, per trip.
  {
    const table = 'premium high altitude mountaineering';
    const s = findLine(lines, /^\s*High Altitude Mountaineering \(above 3,500 metres/, pr, table);
    const e = findLine(lines, /^Premium Discount\s*$/, s, 'Premium Discount');
    if (!lines.slice(s, e).some((l) => /Asia\/Worldwide \(per trip\)/.test(l))) throw new Error(`[${table}] header missing`);
    for (let i = s + 1; i < e; i++) {
      const t = toks(lines[i]);
      if (/^\d+ - \d+ years old$/.test(t[0] ?? ''))
        pushRow(cells, { table, page, row: t[0], cols: ['Asia/Worldwide (per trip)'], values: t.slice(1) });
    }
    checkTable(cells, table, { rows: ['18 - 40 years old', '41 - 60 years old'], cols: ['Asia/Worldwide (per trip)'] });
  }

  // Premium discount (a percentage, printed in the premium section).
  {
    const table = 'premium discount multiple travellers and children';
    const s = findLine(lines, /^\s*Multiple Travellers and Children\s*$/, pr, table);
    const e = findLine(lines, /^\s*Notes:\s*$/, s, 'discount notes');
    for (let i = s + 1; i < e; i++) {
      const t = toks(lines[i]);
      if (t.length === 2 && /^\d+$/.test(t[1]))
        pushRow(cells, { table, page, row: t[0], cols: ['Discount (%)'], values: [t[1]] });
    }
    checkTable(cells, table, { rows: ['5 or more travellers¹', 'Children²'], cols: ['Discount (%)'] });
  }
  if (!lines.some((l) => /subject to Service Tax for domestic trips/.test(l)))
    throw new Error('service-tax note not found');
  return { id, method: 'text', cells };
}
