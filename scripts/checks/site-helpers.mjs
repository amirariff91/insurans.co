// The site's own figure helpers (src/lib/ncd.ts, src/components/edisi/steps.ts), loaded into Node so the checks
// compute expected figures exactly as the pages do, not with a second implementation. The two TypeScript files
// are transpiled with the project's `typescript` devDependency into a temporary directory and imported.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

let cached;
export async function siteHelpers(repo) {
  if (cached) return cached;
  const ts = createRequire(path.join(repo, 'package.json'))('typescript');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'insurans-checks-'));
  const out = (src, name, rewrite = (s) => s) => {
    const code = fs.readFileSync(path.join(repo, src), 'utf8');
    const js = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    fs.writeFileSync(path.join(dir, name), rewrite(js));
  };
  out('src/lib/ncd.ts', 'ncd.mjs');
  out('src/components/edisi/steps.ts', 'steps.mjs', (s) => s.replace(/from ['"]\.\.\/\.\.\/lib\/ncd['"]/g, "from './ncd.mjs'"));
  const ncd = await import(pathToFileURL(path.join(dir, 'ncd.mjs')).href);
  const steps = await import(pathToFileURL(path.join(dir, 'steps.mjs')).href);
  fs.rmSync(dir, { recursive: true, force: true });
  cached = { ...ncd, ...steps };
  return cached;
}

/** Every figure the NCD control and its derived displays can print for one model, as text. */
export function derivedTexts(h, m) {
  const s = h.carSteps(m);
  const parts = [];
  for (const k of Object.keys(s.price)) parts.push(s.ins[k], s.total[k], s.saving[k], s.monthly[k]);
  parts.push(h.specialPerilsRange(m), s.roadtaxText);
  return parts.filter(Boolean).join(' ; ');
}
