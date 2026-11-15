#!/usr/bin/env node
// Header self-check test: for each parser, swap two printed headers in a copy of the
// real page text and require the parser to fail with "header differs".
//   node scripts/docs/extract/test-headers.mjs [--src <pdf folder>]
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { realPageLines, setPageSource } from './lib.mjs';
import * as tune from './tune-protect-pa-shield.mjs';
import * as allianz from './allianz-travel-easy.mjs';
import * as etiqa from './etiqa-onemedical.mjs';
import * as kaotim from './kaotim-medikad.mjs';
import * as zurich from './zurich-z-travel.mjs';
import * as msig from './msig-travel-safeguard.mjs';

const i = process.argv.indexOf('--src');
const src = resolve(i > 0 ? process.argv[i + 1] : process.env.INSURANS_DOCS_SRC ?? join(homedir(), '.cache', 'insurans-docs', 'pilot-2026-11-15'));

// [name, parser, page, line must contain, a, b, after?]: swap the texts a and b on the first such
// header line (searching from the first line containing `after`, when given).
const CASES = [
  ['tune plan 1 / plan 2', tune, 6, 'Premium Rates', 'Plan 1', 'plan 2'],
  ['allianz asia / worldwide', allianz, 1, 'Worldwide', 'Asia', 'Worldwide', 'Premium Rates'],
  ['allianz mountaineering age / per trip', allianz, 1, 'Asia/Worldwide (per trip)', 'Age', 'Asia/Worldwide (per trip)'],
  ['etiqa deductible halves', etiqa, 1, 'RM1,000 Deductible', 'No Deductible', 'RM1,000 Deductible'],
  ['etiqa plan 1 / plan 3', etiqa, 1, 'Plan 1', 'Plan 1', 'Plan 3'],
  ['kaotim male / female (p8)', kaotim, 8, 'FEMALE', 'MALE', 'FEMALE'],
  ['kaotim standard / max (p10)', kaotim, 10, 'Standard', 'Standard', 'Max'],
  ['kaotim male / female (p11)', kaotim, 11, 'FEMALE', 'MALE', 'FEMALE'],
  ['zurich silver / gold', zurich, 1, 'Diamond Plan', 'Silver Plan', 'Gold Plan'],
  ['zurich family / senior (p2)', zurich, 2, 'Senior', 'Family', 'Senior'],
  ['msig age bands (p12)', msig, 12, 'BELOW 65', 'BELOW 65 YEARS OLD', '65 - 80 YEARS OLD'],
  ['msig family shield / max (p14)', msig, 14, 'TRAVEL SHIELD', 'TRAVEL SHIELD', 'TRAVEL MAX'],
  ['msig annual shield / golden (p15)', msig, 15, 'GOLDEN', 'TRAVEL', 'GOLDEN'],
  ['msig transport areas (p16)', msig, 16, 'AREA 4', 'AREA 1', 'AREA 4'],
  ['msig cruise plans (p18)', msig, 18, 'TYPE', 'PLAN 1', 'PLAN 2'],
  ['msig golf only / spouse (p19)', msig, 19, 'DURATION', 'ONLY', 'SPOUSE'],
  ['msig pet areas (p20)', msig, 20, 'AREA 4', 'AREA 1', 'AREA 4'],
];

function swap(line, a, b) {
  const ia = line.indexOf(a);
  const ib = line.indexOf(b, ia + a.length);
  if (ia < 0 || ib < 0) throw new Error(`fixture: cannot find ${JSON.stringify(a)} then ${JSON.stringify(b)} in ${JSON.stringify(line)}`);
  return line.slice(0, ia) + b + line.slice(ia + a.length, ib) + a + line.slice(ib + b.length);
}

let failed = 0;
// Baseline: every parser passes on the untouched text.
setPageSource(null);
for (const p of [tune, allianz, etiqa, kaotim, zurich, msig]) p.extract(src);

for (const [name, parser, page, marker, a, b, after] of CASES) {
  let done = false;
  setPageSource((pdfPath, pg) => {
    const lines = realPageLines(pdfPath, pg);
    if (pg !== page || done) return lines;
    const from = after ? Math.max(0, lines.findIndex((l) => l.includes(after))) : 0;
    const k = lines.findIndex((l, n) => n >= from && l.includes(marker) && l.includes(a) && l.indexOf(b, l.indexOf(a) + a.length) >= 0);
    if (k < 0) throw new Error(`fixture: no header line with ${JSON.stringify(marker)} on page ${page}`);
    lines[k] = swap(lines[k], a, b);
    done = true;
    return lines;
  });
  try {
    parser.extract(src);
    failed++;
    console.log(`FAIL ${name}: parser accepted swapped headers`);
  } catch (e) {
    if (/header differs/.test(e.message) && done) console.log(`ok   ${name}: ${e.message.slice(0, 110)}`);
    else {
      failed++;
      console.log(`FAIL ${name}: wrong error: ${e.message}`);
    }
  }
}
setPageSource(null);
console.log(failed ? `${failed} case(s) failed` : `all ${CASES.length} swapped-header cases rejected`);
process.exit(failed ? 1 : 0);
