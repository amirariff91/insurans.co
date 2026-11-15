// Optimise logo SVGs downloaded from Wikimedia Commons (see src/data/brand-logos.json, company-logos.json):
// strips metadata, editor data and comments, keeps the viewBox, drops fixed width/height so CSS sizes them.
// Usage: node scripts/optimise-logos.mjs <raw-dir> <out-dir>   e.g. public/images/jenama or public/images/syarikat
// svgo comes with Astro (transitive dependency); no new package.
import fs from 'node:fs';
import path from 'node:path';
import { optimize } from 'svgo';
import sharp from 'sharp';

const [inDir, outDir] = process.argv.slice(2);
if (!inDir || !outDir) throw new Error('usage: optimise-logos.mjs <raw-dir> <out-dir>');
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(inDir).filter((x) => x.endsWith('.svg'))) {
  const raw = fs.readFileSync(path.join(inDir, f), 'utf8');
  const { data } = optimize(raw, {
    multipass: true,
    floatPrecision: 2,
    plugins: [
      'preset-default',
      'removeDimensions',
      { name: 'removeAttrs', params: { attrs: ['data-name', 'xml:space'] } },
    ],
  });
  const vb = data.match(/viewBox="([^"]+)"/);
  if (!vb) throw new Error(`${f}: no viewBox after optimisation`);
  const [, , w, h] = vb[1].split(/[\s,]+/).map(Number);
  // A file that wraps an embedded bitmap (Perodua, Tokio Marine on Commons) stays heavy as SVG: render it once to a
  // 64px-tall WebP (2x for the 32px logo box) instead, and remove any old SVG copy.
  if (/<image\b/.test(data) || data.length > 20000) {
    const out = f.replace(/\.svg$/, '.webp');
    await sharp(Buffer.from(data), { density: Math.max(72, Math.ceil((72 * 64) / h)) }).resize({ height: 64 }).webp({ quality: 85, alphaQuality: 90 }).toFile(path.join(outDir, out));
    fs.rmSync(path.join(outDir, f), { force: true });
    console.log(`${f}\t${raw.length} -> ${out} ${fs.statSync(path.join(outDir, out)).size} bytes (embedded bitmap)\tviewBox ${w}x${h}`);
    continue;
  }
  fs.writeFileSync(path.join(outDir, f), data);
  console.log(`${f}\t${raw.length} -> ${data.length} bytes\tviewBox ${w}x${h}`);
}
