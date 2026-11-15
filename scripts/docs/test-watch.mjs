#!/usr/bin/env node
// Offline tests for the watch helpers (no network): repo-write guard, PDF links with
// fragments, and percent-encoded display URLs.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { insideRepo, norm, pdfLinks } from './watch-lib.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
let failed = 0;
const check = (name, cond) => {
  if (cond) console.log(`ok   ${name}`);
  else {
    failed++;
    console.log(`FAIL ${name}`);
  }
};

// (a) guard
const scratch = join(homedir(), '.cache', 'insurans-docs', 'watch-test');
mkdirSync(scratch, { recursive: true });
const link = join(scratch, 'repo-link');
rmSync(link, { force: true });
symlinkSync(root, link);
check('..reports/x.md inside the checkout is inside', insideRepo(join(root, '..reports', 'x.md'), root));
check('a new nested folder inside the checkout is inside', insideRepo(join(root, 'no', 'such', 'dir', 'x.md'), root));
check('the checkout itself is inside', insideRepo(root, root));
check('a sibling folder is outside', !insideRepo(join(root, '..', 'elsewhere', 'x.md'), root));
check('the scratch folder is outside', !insideRepo(join(scratch, 'x.md'), root));
check('a symlink from outside into the checkout is inside', insideRepo(join(link, 'reports', 'x.md'), root));
let code = 0;
try {
  execFileSync('node', [join(here, 'watch.mjs'), '--out', join(root, '..reports', 'x.md')], { stdio: 'ignore' });
} catch (e) {
  code = e.status;
}
check('watch.mjs refuses --out <repo>/..reports/x.md before any request (exit 2)', code === 2);
rmSync(link, { force: true });

// (b) fragments and (c) display encoding
const base = 'https://example.com/products/plan/';
const html = `
  <a href="/docs/rates.pdf#page=2">rates</a>
  <a href="/docs/My%20Plan%20Brochure.pdf">brochure</a>
  <a href='https://example.com/docs/q.pdf?v=3#x'>q</a>
  <script>var u = "https://example.com/docs/plain.pdf";</script>`;
const links = pdfLinks(html, base);
check('link with a fragment is found, fragment stripped', links.get('https://example.com/docs/rates.pdf') === 'https://example.com/docs/rates.pdf');
check('query kept, fragment stripped', links.get('https://example.com/docs/q.pdf?v=3') === 'https://example.com/docs/q.pdf?v=3');
check('display URL keeps %20', links.get('https://example.com/docs/My Plan Brochure.pdf') === 'https://example.com/docs/My%20Plan%20Brochure.pdf');
check('bare URL in a script is found', links.has('https://example.com/docs/plain.pdf'));
check('comparison key matches encoded and decoded forms', norm('https://example.com/docs/My%20Plan%20Brochure.pdf') === norm('https://example.com/docs/My Plan Brochure.pdf'));
check('four links found', links.size === 4);

console.log(failed ? `${failed} check(s) failed` : 'all watch checks passed');
process.exit(failed ? 1 : 0);
