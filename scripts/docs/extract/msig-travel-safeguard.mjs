// MSIG Travel SafeGuard brochure, English price pages.
// File pages 12-15 base plan (printed 11-14); 16 Alternative Transport Top-Up add-on (printed 15);
// 18 Cruise Benefit add-on (printed 17); 19 Golf Benefit add-on (printed 18, the benefit list is on
// file page 18); 20 Pet Benefit add-on (printed 19).
// The Malay pages (46, 48, 50, 51, 52, 54, 55, 56) repeat the same tables and are not parsed.
import { pageLines, pdf, toks, findLine, checkTable, pushRow, cross, expectHeader } from './lib.mjs';

export const id = 'msig-travel-safeguard-brochure';
export const file = 'msig-tsg-brochure.pdf';
export const skipPages = { 46: 'Malay', 48: 'Malay', 50: 'Malay', 51: 'Malay', 52: 'Malay', 54: 'Malay', 55: 'Malay', 56: 'Malay' };

const B65 = 'BELOW 65 YEARS OLD';
const A65 = '65 - 80 YEARS OLD';
const PLANS5 = ['TRAVEL SHIELD', 'TRAVEL MAX', 'TRAVEL SHIELD', 'TRAVEL MAX', 'GOLDEN JOY'];
const five = (older) => [...cross([B65], PLANS5.slice(0, 2)), ...cross([older], PLANS5.slice(2))];
const FIVE = five(A65);
const DUR = ['1 - 5 days', '6 - 10 days', '11 - 18 days', '19 - 31 days', 'Each additional week'];
const AREA = /^(Area|AREA) [\d-]+( & \d)?\*?$/;
const PLAN123 = ['Plan 1', 'Plan 2', 'Plan 3'];
const TYPES = ['Insured Only', 'Insured & Spouse', 'Family'];

// Printed headers, squashed. Columns are assigned by position under these.
const H_FIVE = [
  'BELOW 65 YEARS OLD 65 - 80 YEARS OLD',
  'TRAVEL TRAVEL TRAVEL TRAVEL GOLDEN',
  'TRAVEL',
  'AREA SHIELD MAX SHIELD MAX JOY',
  'DURATION',
  '(RM) (RM) (RM) (RM) (RM)',
  'NEW NEW',
];
const H_FAMILY = ['BELOW 65 YEARS OLD', 'TRAVEL', 'AREA TRAVEL SHIELD TRAVEL MAX', 'DURATION', '(RM) (RM)'];
const H_ANNUAL = [
  'BELOW 65 YEARS OLD 65 - 80 YEARS OLD^',
  'TRAVEL TRAVEL TRAVEL TRAVEL GOLDEN',
  'AREA SHIELD MAX SHIELD MAX JOY',
  '(RM) (RM) (RM) (RM) (RM)',
  'NEW NEW',
];
const H_ADDON3 = ['AREA 1 AREA 2 & 3 AREA 4', 'TYPE Plan 1 Plan 2 Plan 3 Plan 1 Plan 2 Plan 3 Plan 1 Plan 2 Plan 3', '(RM) (RM) (RM) (RM) (RM) (RM) (RM) (RM) (RM)'];
const H_ADDON2 = ['AREA 1 AREA 2 & 3', 'TYPE Plan 1 Plan 2 Plan 3 Plan 1 Plan 2 Plan 3', '(RM) (RM) (RM) (RM) (RM) (RM)'];

/** Rows grouped by area where the area label sits on any line of its group. */
function areaGrouped(lines, from, to, table, page, inner, areas, cells) {
  const groups = [];
  let g = null;
  for (let i = from; i < to; i++) {
    let t = toks(lines[i]);
    if (!t.length) continue;
    if (AREA.test(t[0])) {
      if (!g) throw new Error(`[${table}] area label before first row`);
      if (g.area) throw new Error(`[${table}] two area labels in one group`);
      g.area = t[0];
      t = t.slice(1);
      if (!t.length) continue;
    }
    if (/^\d+ - \d+ days$/.test(t[0]) || t[0] === 'Each additional week') {
      if (t[0] === '1 - 5 days') groups.push((g = { area: null, rows: [] }));
      g.rows.push([t[0], t.slice(1)]);
    } else if (t[0] === 'Each additional' && t.length === 1) {
      // Wrapped label: "Each additional" / values only / "week"
      const v = toks(lines[i + 1]);
      if (toks(lines[i + 2]).join(' ') !== 'week') throw new Error(`[${table}] wrapped label not closed`);
      g.rows.push(['Each additional week', v]);
      i += 2;
    } else {
      throw new Error(`[${table}] unrecognised line on page ${page}: ${JSON.stringify(lines[i])}`);
    }
  }
  if (groups.map((x) => x.area).join('|') !== areas.join('|'))
    throw new Error(`[${table}] areas ${JSON.stringify(groups.map((x) => x.area))} != ${JSON.stringify(areas)}`);
  for (const { area, rows } of groups)
    for (const [row, values] of rows) pushRow(cells, { table, page, row, cols: cross([area], inner), values });
  checkTable(cells, table, { rows: DUR, cols: cross(areas, inner) });
}

/** Rows "Insured Only", "Insured & Spouse", "Family", with labels wrapped over two lines. */
function typeRows(lines, from, to, table, page, cols, rows, cells) {
  for (let i = from; i < to; i++) {
    const t = toks(lines[i]);
    if (!t.length) continue;
    if (t[0] === 'Insured' || t[0] === 'Insured &') {
      let values = t.slice(1);
      let j = i + 1;
      while (!values.length) values = toks(lines[j++]);
      while (!toks(lines[j]).length) j++;
      const tail = toks(lines[j]);
      pushRow(cells, { table, page, row: `${t[0]} ${tail.join(' ')}`, cols, values });
      i = j;
    } else if (t[0] === 'Family' || t[0] === 'Insured Only') {
      pushRow(cells, { table, page, row: t[0], cols, values: t.slice(1) });
    } else {
      throw new Error(`[${table}] unrecognised line on page ${page}: ${JSON.stringify(lines[i])}`);
    }
  }
  checkTable(cells, table, { rows, cols });
}

const TAX_BOTH = /^\s*\* Premiums for Area 4 and Annual Cover are inclusive of 8% Service Tax\.\s*$/;

export function extract(srcDir) {
  const P = (n) => pageLines(pdf(srcDir, file), n);
  const cells = [];
  const NOTE4 = /^\s*\* Area 4 premium inclusive of 8% Service Tax\.\s*$/;

  // Base plan, single trip: insured only, insured & spouse (5 plan columns), family (2 columns).
  for (const [page, table, head, inner, header] of [
    [12, 'single trip insured only', /SINGLE TRIP PREMIUM \(INSURED ONLY\)/, FIVE, H_FIVE],
    [13, 'single trip insured & spouse', /SINGLE TRIP PREMIUM \(INSURED & SPOUSE\)/, FIVE, H_FIVE],
    [14, 'single trip family', /SINGLE TRIP PREMIUM \(FAMILY\)/, cross([B65], PLANS5.slice(0, 2)), H_FAMILY],
  ]) {
    const lines = P(page);
    const s = findLine(lines, head, 0, table);
    const h = expectHeader(lines, s, header, table);
    const e = findLine(lines, NOTE4, h, 'Area 4 tax note');
    areaGrouped(lines, h + 1, e, table, page, inner, ['Area 1', 'Area 2', 'Area 3', 'Area 4*'], cells);
  }

  // Base plan, annual cover. The 65 - 80 band is printed with "^" (renewal only).
  {
    const page = 15;
    const table = 'annual cover';
    const lines = P(page);
    const s = findLine(lines, /ANNUAL COVER PREMIUM\*/, 0, table);
    const h = expectHeader(lines, s, H_ANNUAL, table);
    const e = findLine(lines, /^\* Annual Cover inclusive of 8% Service Tax\.\s*$/, h, 'annual tax note');
    findLine(lines, /^\^ Annual Cover under age band 65 - 80 years old is for renewal only\.\s*$/, e, 'renewal note');
    const cols = five(`${A65}^`);
    for (let i = h + 1; i < e; i++) {
      const t = toks(lines[i]);
      if (!t.length) continue;
      if (!/^Area \d$/.test(t[0])) throw new Error(`[${table}] unrecognised line: ${JSON.stringify(lines[i])}`);
      pushRow(cells, { table, page, row: t[0], cols, values: t.slice(1) });
    }
    checkTable(cells, table, { rows: ['Area 1', 'Area 2', 'Area 3'], cols });
  }

  // Add-on: Alternative Transport Top-Up.
  {
    const page = 16;
    const lines = P(page);
    findLine(lines, /^\s*Alternative Transport Top-Up\s*$/, 0, 'Alternative Transport Top-Up');
    const s = findLine(lines, /^\s+SINGLE TRIP PREMIUM\s*$/, 0, 'ATT single');
    const e = findLine(lines, /^\s+ANNUAL COVER PREMIUM\*\s*$/, s, 'ATT annual');
    let h = expectHeader(lines, s, H_ADDON3, 'alternative transport top-up single trip');
    typeRows(lines, h + 1, e, 'alternative transport top-up single trip', page, cross(['AREA 1', 'AREA 2 & 3', 'AREA 4'], PLAN123), TYPES, cells);
    const e2 = findLine(lines, TAX_BOTH, e, 'ATT tax note');
    h = expectHeader(lines, e, H_ADDON2, 'alternative transport top-up annual cover');
    typeRows(lines, h + 1, e2, 'alternative transport top-up annual cover', page, cross(['AREA 1', 'AREA 2 & 3'], PLAN123), ['Insured Only'], cells);
  }

  // Add-on: Cruise Benefit (per cruise trip). Type label sits on the middle (Area 2) line of each group.
  {
    const page = 18;
    const lines = P(page);
    const plans = ['PLAN 1', 'PLAN 2'];
    const areaRows = (s, e, table, rows) => {
      let type = null;
      const got = [];
      for (let i = s; i < e; i++) {
        let t = toks(lines[i]);
        if (!t.length) continue;
        if (!/^Area \d$/.test(t[0])) {
          type = t[0];
          t = t.slice(1);
        }
        if (!/^Area \d$/.test(t[0] ?? '')) throw new Error(`[${table}] unrecognised line: ${JSON.stringify(lines[i])}`);
        got.push([type, t[0], t.slice(1)]);
      }
      if (got.length % 3) throw new Error(`[${table}] ${got.length} area lines, not a multiple of 3`);
      let prev = null;
      for (let k = 0; k < got.length; k += 3) {
        const grp = got.slice(k, k + 3);
        const ty = grp[1][0];
        if (!ty || ty === prev || grp[2][0] !== ty) throw new Error(`[${table}] type label not on the middle line of group ${k / 3 + 1}`);
        prev = ty;
        for (const [, area, values] of grp) pushRow(cells, { table, page, row: ty, cols: cross([area], plans), values });
      }
      checkTable(cells, table, { rows, cols: cross(['Area 1', 'Area 2', 'Area 3'], plans) });
    };
    const s = findLine(lines, /^\s+PREMIUM PER CRUISE TRIP\s*$/, 0, 'cruise single');
    const h = expectHeader(lines, s, ['TYPE AREAS PLAN 1 PLAN 2', '(RM) (RM)'], 'cruise single');
    const s2 = findLine(lines, /^\s+PREMIUM PER CRUISE TRIP FOR ANNUAL COVER\*\s*$/, s, 'cruise annual');
    const h2 = expectHeader(lines, s2, ['AREAS PLAN 1 PLAN 2', '(RM) (RM)'], 'cruise annual');
    const e2 = findLine(lines, /^\s*\* Premiums for Annual Cover is inclusive of 8% Service Tax\.\s*$/, s2, 'cruise tax note');
    areaRows(h + 1, s2, 'cruise benefit per cruise trip', TYPES);
    areaRows(h2 + 1, e2, 'cruise benefit per cruise trip annual cover', ['Insured Only']);
    findLine(lines, /^\s*Golf Benefit\s*$/, e2, 'Golf Benefit heading (owner of page 19 tables)');
  }

  // Add-on: Golf Benefit (premium tables on file page 19).
  {
    const page = 19;
    const lines = P(page);
    const inner = [...cross([B65], ['INSURED ONLY', 'INSURED & SPOUSE', 'FAMILY']), ...cross([A65], ['INSURED ONLY', 'INSURED & SPOUSE'])];
    const s = findLine(lines, /^\s+SINGLE TRIP PREMIUM\s*$/, 0, 'golf single');
    const h = expectHeader(lines, s, [
      'BELOW 65 YEARS OLD 65 - 80 YEARS OLD',
      'TRAVEL INSURED INSURED & INSURED INSURED &',
      'AREA FAMILY',
      'DURATION ONLY SPOUSE ONLY SPOUSE',
      '(RM)',
      '(RM) (RM) (RM) (RM)',
    ], 'golf benefit single trip');
    const e = findLine(lines, /^\s+ANNUAL COVER PREMIUM\*\s*$/, h, 'golf annual');
    areaGrouped(lines, h + 1, e, 'golf benefit single trip', page, inner, ['Area 1-3', 'Area 4*'], cells);
    const e2 = findLine(lines, TAX_BOTH, e, 'golf tax note');
    // Printed "BELOW 65 YEARS OLD (RM)" and "65 - 80 YEARS OLD (RM)"; the unit is dropped.
    const h2 = expectHeader(lines, e, ['TYPE BELOW 65 YEARS OLD (RM) 65 - 80 YEARS OLD (RM)'], 'golf benefit annual cover');
    typeRows(lines, h2 + 1, e2, 'golf benefit annual cover', page, [B65, A65], ['Insured Only'], cells);
  }

  // Add-on: Pet Benefit (file page 20). On the single-trip table one row of values is printed
  // across the three insured types (one pet benefit per policy); it is written to each type.
  // The Area 4 unit captions are printed "(RM)*"; the unit is dropped and the mark kept ("Plan 1*").
  {
    const page = 20;
    const lines = P(page);
    findLine(lines, /^\s*Pet Benefit\s*$/, 0, 'Pet Benefit heading');
    const table = 'pet benefit single trip';
    const s = findLine(lines, /^\s+SINGLE TRIP PREMIUM\s*$/, 0, table);
    const h = expectHeader(lines, s, [
      'AREA 1 AREA 2 & 3 AREA 4',
      'TYPE',
      'Plan 1 Plan 2 Plan 3 Plan 1 Plan 2 Plan 3 Plan 1 Plan 2 Plan 3',
      '(RM) (RM) (RM) (RM) (RM) (RM) (RM)* (RM)* (RM)*',
    ], table);
    const e = findLine(lines, /^\s+ANNUAL COVER PREMIUM\*\s*$/, h, 'pet annual');
    const body = lines.slice(h + 1, e).map(toks).filter((t) => t.length);
    const shape = body.map((t) => t[0]).join('|');
    if (shape !== 'Insured|Only|Insured|and Spouse|Family' || body[2].length !== 10)
      throw new Error(`[${table}] expected one shared value row across Insured Only / Insured and Spouse / Family, got ${JSON.stringify(body)}`);
    const cols = [...cross(['AREA 1', 'AREA 2 & 3'], PLAN123), ...cross(['AREA 4'], PLAN123.map((p) => `${p}*`))];
    for (const row of ['Insured Only', 'Insured and Spouse', 'Family'])
      pushRow(cells, { table, page, row, cols, values: body[2].slice(1) });
    checkTable(cells, table, { rows: ['Insured Only', 'Insured and Spouse', 'Family'], cols });
    const e2 = findLine(lines, TAX_BOTH, e, 'pet tax note');
    const h2 = expectHeader(lines, e, H_ADDON2, 'pet benefit annual cover');
    typeRows(lines, h2 + 1, e2, 'pet benefit annual cover', page, cross(['AREA 1', 'AREA 2 & 3'], PLAN123), ['Insured Only'], cells);
  }
  return { id, method: 'text', cells };
}
