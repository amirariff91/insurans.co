// MSIG Travel SafeGuard brochure, English price pages.
// File pages 12-15 base plan (printed 11-14); 16 Alternative Transport Top-Up add-on (printed 15);
// 18 Cruise Benefit add-on (printed 17); 19 Golf Benefit add-on (printed 18, the benefit list is on file page 18).
import { pageLines, pdf, toks, findLine, checkTable, pushRow, cross } from './lib.mjs';

export const id = 'msig-travel-safeguard-brochure';
export const file = 'msig-tsg-brochure.pdf';

const B65 = 'BELOW 65 YEARS OLD';
const A65 = '65 - 80 YEARS OLD';
const FIVE = [...cross([B65], ['TRAVEL SHIELD', 'TRAVEL MAX']), ...cross([A65], ['TRAVEL SHIELD', 'TRAVEL MAX', 'GOLDEN JOY'])];
const DUR = ['1 - 5 days', '6 - 10 days', '11 - 18 days', '19 - 31 days', 'Each additional week'];
const AREA = /^(Area|AREA) [\d-]+( & \d)?\*?$/;

/** Rows grouped by area where the area label sits on any line of its group. */
function areaGrouped(lines, from, to, table, page, inner, areas, cells) {
  const groups = [];
  let g = null;
  let pendingValuesOnly = null;
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

function typeRows(lines, from, to, table, page, cols, rows, cells) {
  // Rows are "Insured Only" (wrapped: "Insured" / values / "Only" or "Insured" + values / "Only"),
  // "Insured & Spouse" (same), "Family".
  for (let i = from; i < to; i++) {
    const t = toks(lines[i]);
    if (!t.length) continue;
    if (t[0] === 'Insured' || t[0] === 'Insured &') {
      let values = t.slice(1);
      let j = i + 1;
      while (!values.length) values = toks(lines[j++]);
      while (!toks(lines[j]).length) j++;
      const tail = toks(lines[j]);
      const label = `${t[0]} ${tail.join(' ')}`;
      pushRow(cells, { table, page, row: label, cols, values });
      i = j;
    } else if (t[0] === 'Family' || t[0] === 'Insured Only') {
      pushRow(cells, { table, page, row: t[0], cols, values: t.slice(1) });
    } else {
      throw new Error(`[${table}] unrecognised line on page ${page}: ${JSON.stringify(lines[i])}`);
    }
  }
  checkTable(cells, table, { rows, cols });
}

function section(lines, startRe, endRe, what) {
  const s = findLine(lines, startRe, 0, what);
  const e = findLine(lines, endRe, s + 1, `end of ${what}`);
  return [s, e];
}

export function extract(srcDir) {
  const P = (n) => pageLines(pdf(srcDir, file), n);
  const cells = [];
  const NOTE4 = /^\s*\* Area 4 premium inclusive of 8% Service Tax\.\s*$/;

  // Base plan, single trip: insured only, insured & spouse (5 plan columns), family (2 columns).
  for (const [page, table, head, inner] of [
    [12, 'single trip insured only', /SINGLE TRIP PREMIUM \(INSURED ONLY\)/, FIVE],
    [13, 'single trip insured & spouse', /SINGLE TRIP PREMIUM \(INSURED & SPOUSE\)/, FIVE],
    [14, 'single trip family', /SINGLE TRIP PREMIUM \(FAMILY\)/, cross([B65], ['TRAVEL SHIELD', 'TRAVEL MAX'])],
  ]) {
    const lines = P(page);
    const s = findLine(lines, head, 0, table);
    const first = findLine(lines, /^\s+(Area 1\s+)?1 - 5 days\s/, s, 'first row');
    const e = findLine(lines, NOTE4, first, 'Area 4 tax note');
    areaGrouped(lines, first, e, table, page, inner, ['Area 1', 'Area 2', 'Area 3', 'Area 4*'], cells);
  }

  // Base plan, annual cover.
  {
    const page = 15;
    const table = 'annual cover';
    const lines = P(page);
    const [s, e] = section(lines, /ANNUAL COVER PREMIUM\*/, /^\* Annual Cover inclusive of 8% Service Tax\.\s*$/, table);
    for (let i = s + 1; i < e; i++) {
      const t = toks(lines[i]);
      if (/^Area \d$/.test(t[0] ?? '')) pushRow(cells, { table, page, row: t[0], cols: FIVE, values: t.slice(1) });
    }
    checkTable(cells, table, { rows: ['Area 1', 'Area 2', 'Area 3'], cols: FIVE });
  }

  // Add-on: Alternative Transport Top-Up.
  {
    const page = 16;
    const lines = P(page);
    const plans = ['Plan 1', 'Plan 2', 'Plan 3'];
    findLine(lines, /^\s*Alternative Transport Top-Up\s*$/, 0, 'Alternative Transport Top-Up');
    let [s, e] = section(lines, /^\s+SINGLE TRIP PREMIUM\s*$/, /^\s+ANNUAL COVER PREMIUM\*\s*$/, 'ATT single');
    findLine(lines, /^\s+AREA 1\s+AREA 2 & 3\s+AREA 4\s*$/, s, 'ATT single area header');
    const first = findLine(lines, /^\s+Insured(\s|$)/, s, 'ATT first row');
    typeRows(lines, first, e, 'alternative transport top-up single trip', page,
      cross(['AREA 1', 'AREA 2 & 3', 'AREA 4'], plans), ['Insured Only', 'Insured & Spouse', 'Family'], cells);
    const s2 = e;
    const e2 = findLine(lines, /^\s*\* Premiums for Area 4 and Annual Cover are inclusive of 8% Service Tax\.\s*$/, s2, 'ATT tax note');
    findLine(lines, /^\s+AREA 1\s+AREA 2 & 3\s*$/, s2, 'ATT annual area header');
    const first2 = findLine(lines, /^\s+Insured(\s|$)/, s2, 'ATT annual first row');
    typeRows(lines, first2, e2, 'alternative transport top-up annual cover', page,
      cross(['AREA 1', 'AREA 2 & 3'], plans), ['Insured Only'], cells);
  }

  // Add-on: Cruise Benefit (per cruise trip).
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
      // Type label sits on the middle (Area 2) line of each group of three.
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
    const s2 = findLine(lines, /^\s+PREMIUM PER CRUISE TRIP FOR ANNUAL COVER\*\s*$/, s, 'cruise annual');
    const e2 = findLine(lines, /^\s*\* Premiums for Annual Cover is inclusive of 8% Service Tax\.\s*$/, s2, 'cruise tax note');
    areaRows(findLine(lines, /^\s+Area 1\s/, s) , s2, 'cruise benefit per cruise trip', ['Insured Only', 'Insured & Spouse', 'Family']);
    areaRows(findLine(lines, /^\s+Area 1\s/, s2), e2, 'cruise benefit per cruise trip annual cover', ['Insured Only']);
    findLine(lines, /^\s*Golf Benefit\s*$/, e2, 'Golf Benefit heading (owner of page 19 tables)');
  }

  // Add-on: Golf Benefit (premium tables on file page 19).
  {
    const page = 19;
    const lines = P(page);
    const inner = [...cross([B65], ['INSURED ONLY', 'INSURED & SPOUSE', 'FAMILY']), ...cross([A65], ['INSURED ONLY', 'INSURED & SPOUSE'])];
    const s = findLine(lines, /^\s+SINGLE TRIP PREMIUM\s*$/, 0, 'golf single');
    const first = findLine(lines, /^\s+1 - 5 days\s/, s, 'golf first row');
    const e = findLine(lines, /^\s+ANNUAL COVER PREMIUM\*\s*$/, first, 'golf annual');
    areaGrouped(lines, first, e, 'golf benefit single trip', page, inner, ['Area 1-3', 'Area 4*'], cells);
    const e2 = findLine(lines, /^\s*\* Premiums for Area 4 and Annual Cover are inclusive of 8% Service Tax\.\s*$/, e, 'golf tax note');
    // Printed headers are "BELOW 65 YEARS OLD (RM)" and "65 - 80 YEARS OLD (RM)"; the unit is dropped.
    findLine(lines, /^\s*TYPE\s+BELOW 65 YEARS OLD \(RM\)\s+65 - 80 YEARS OLD \(RM\)\s*$/, e, 'golf annual header');
    const cols = [B65, A65];
    for (let i = e + 1; i < e2; i++) {
      const t = toks(lines[i]);
      if (t[0] === 'Insured Only') pushRow(cells, { table: 'golf benefit annual cover', page, row: t[0], cols, values: t.slice(1) });
    }
    checkTable(cells, 'golf benefit annual cover', { rows: ['Insured Only'], cols });
  }
  return { id, method: 'text', cells };
}
