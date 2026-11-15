// Usage: node scripts/checks/make-baseline.mjs <dist-of-live-build> <commit>
// Writes scripts/checks/baseline-<commit>.json. See docs/checks.md.
import fs from 'node:fs';
import path from 'node:path';
import { snapshot } from './lib.mjs';
const [dist, commit] = process.argv.slice(2);
if (!dist || !commit) { console.error('usage: make-baseline.mjs <dist> <commit>'); process.exit(2); }
const pages = snapshot(dist);
const out = path.join(path.dirname(new URL(import.meta.url).pathname), `baseline-${commit}.json`);
fs.writeFileSync(out, JSON.stringify({ commit, createdAt: new Date().toISOString(), pages }, null, 1));
console.log(`wrote ${out}: ${Object.keys(pages).length} pages, ${Object.values(pages).filter((p) => p.ads).length} load AdSense`);
