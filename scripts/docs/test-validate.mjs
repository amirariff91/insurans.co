#!/usr/bin/env node
// Broken-copy test for validate-register.mjs: each case breaks one field in a copy of the
// register (written under ~/.cache/insurans-docs/validate-test, outside the repo) and
// requires the validator to fail with the expected message. The untouched register must pass.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const validator = join(here, 'validate-register.mjs');
const original = JSON.parse(readFileSync(join(here, '..', '..', 'src', 'data', 'documents.json'), 'utf8'));
const dir = join(homedir(), '.cache', 'insurans-docs', 'validate-test');
mkdirSync(dir, { recursive: true });

const CASES = [
  ['id is a number', (r) => { r.documents[0].id = 42; }, /id must be a lower-case slug string/],
  ['id is not a slug', (r) => { r.documents[0].id = 'Kaotim MediKad'; }, /id must be a lower-case slug string/],
  ['id is an array', (r) => { r.documents[0].id = ['a']; }, /id must be a lower-case slug string/],
  ['full row with empty page list', (r) => { r.documents[0].priceTablePages = { file: [], printed: null }; }, /must not be an empty list|needs at least one page/],
  ['printed label is a number', (r) => { r.documents[0].priceTablePages.printed[1] = 6; }, /priceTablePages\.printed\[1\] must be a non-empty string/],
  ['printed label is empty', (r) => { r.documents[0].priceTablePages.printed[0] = ' '; }, /priceTablePages\.printed\[0\] must be a non-empty string/],
  ['printed list too short', (r) => { r.documents[0].priceTablePages.printed.pop(); }, /must be null or a list as long as/],
  ['page beyond document', (r) => { r.documents[1].priceTablePages.file = [3]; }, /beyond the document's 2 pages/],
  ['duplicate id', (r) => { r.documents[1].id = r.documents[0].id; }, /duplicate id/],
];

function run(path) {
  try {
    return { code: 0, out: execFileSync('node', [validator, path], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    return { code: e.status, out: `${e.stdout}${e.stderr}` };
  }
}

let failed = 0;
const base = join(dir, 'unchanged.json');
writeFileSync(base, JSON.stringify(original));
const ok = run(base);
if (ok.code !== 0) {
  failed++;
  console.log(`FAIL unchanged register does not pass:\n${ok.out}`);
} else console.log('ok   unchanged register passes');
CASES.forEach(([name, breakIt, want], k) => {
  const copy = structuredClone(original);
  breakIt(copy);
  const p = join(dir, `case-${k + 1}.json`);
  writeFileSync(p, JSON.stringify(copy));
  const r = run(p);
  if (r.code === 1 && want.test(r.out)) console.log(`ok   ${name}`);
  else {
    failed++;
    console.log(`FAIL ${name}: exit ${r.code}\n${r.out}`);
  }
});
console.log(failed ? `${failed} case(s) failed` : `all ${CASES.length} broken copies rejected`);
process.exit(failed ? 1 : 0);
