#!/usr/bin/env node
// Run the text-layer parsers and write one cell file per document.
//   node scripts/docs/extract/run.mjs [--src <pdf folder>] [--out <folder>] [doc-id ...]
// --src defaults to $INSURANS_DOCS_SRC, then ~/.cache/insurans-docs/pilot-2026-11-15
// --out defaults to $INSURANS_DOCS_OUT, then ~/.cache/insurans-docs/extract-a
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as tune from './tune-protect-pa-shield.mjs';
import * as allianz from './allianz-travel-easy.mjs';
import * as etiqa from './etiqa-onemedical.mjs';
import * as kaotim from './kaotim-medikad.mjs';
import * as zurich from './zurich-z-travel.mjs';
import * as msig from './msig-travel-safeguard.mjs';

const PARSERS = [tune, allianz, etiqa, kaotim, zurich, msig]; // order of work
const base = join(homedir(), '.cache', 'insurans-docs');
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const src = resolve(opt('--src') ?? process.env.INSURANS_DOCS_SRC ?? join(base, 'pilot-2026-11-15'));
const out = resolve(opt('--out') ?? process.env.INSURANS_DOCS_OUT ?? join(base, 'extract-a'));
const only = new Set(args);

const here = dirname(fileURLToPath(import.meta.url));
const register = JSON.parse(readFileSync(join(here, '..', '..', '..', 'src', 'data', 'documents.json'), 'utf8'));
const regById = new Map(register.documents.map((d) => [d.id, d]));

/** Every page the register lists as a price page must yield cells, or be skipped for a stated reason. */
function completeness(doc, skip = {}) {
  const reg = regById.get(doc.id);
  if (!reg) throw new Error(`${doc.id} is not in the register`);
  const got = new Set(doc.cells.map((c) => c.page));
  const missing = reg.priceTablePages.file.filter((p) => !got.has(p) && !skip[p]);
  if (missing.length) throw new Error(`${doc.id}: register price pages ${missing.join(', ')} yielded no table`);
  const extra = [...got].filter((p) => !reg.priceTablePages.file.includes(p));
  if (extra.length) throw new Error(`${doc.id}: cells on pages ${extra.join(', ')} that the register does not list`);
}

mkdirSync(out, { recursive: true });
let failed = 0;
for (const p of PARSERS) {
  const ids = p.docs ? p.docs.map((d) => d.id) : [p.id];
  if (only.size && !ids.some((x) => only.has(x))) continue;
  try {
    const result = p.extract(src);
    for (const doc of Array.isArray(result) ? result : [result]) {
      if (only.size && !only.has(doc.id)) continue;
      completeness(doc, p.skipPages);
      writeFileSync(join(out, `${doc.id}.json`), JSON.stringify(doc, null, 1) + '\n');
      const tables = [...new Set(doc.cells.map((c) => c.table))];
      console.log(`ok   ${doc.id}: ${doc.cells.length} cells in ${tables.length} tables`);
      for (const t of tables) console.log(`       ${t}: ${doc.cells.filter((c) => c.table === t).length}`);
    }
  } catch (err) {
    failed++;
    console.error(`FAIL ${ids.join(', ')}: ${err.message}`);
  }
}
console.log(`wrote to ${out}`);
process.exit(failed ? 1 : 0);
