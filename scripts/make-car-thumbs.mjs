// List thumbnails for car models: a crop of each credited cut-out photo (public/images/kereta/<slug>-800.webp),
// trimmed to the car and fitted into a 3:2 transparent canvas (144x96, 2x for a 72x48 box), so the sky plate
// behind it is CSS and no car is cut off. Writes public/images/kereta/kecil/<slug>.webp and src/data/car-thumbs.json
// (slug -> thumb path + the source photo it was made from; check 5 maps each thumb back to its credit).
// Run: node scripts/make-car-thumbs.mjs   (sharp comes with Astro's image service; no new dependency)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const photos = JSON.parse(fs.readFileSync(path.join(repo, 'src/data/car-photos.json'), 'utf8'));
const W = 144, H = 96, PAD_X = 8, PAD_Y = 10;
const outDir = path.join(repo, 'public/images/kereta/kecil');
fs.mkdirSync(outDir, { recursive: true });
const records = [];
for (const p of photos) {
  if (!p.hasPhoto) continue;
  const src = path.join(repo, 'public', p.src800);
  const trimmed = await sharp(src).trim({ threshold: 1 }).toBuffer();
  const car = await sharp(trimmed)
    .resize({ width: W - 2 * PAD_X, height: H - 2 * PAD_Y, fit: 'inside' })
    .toBuffer({ resolveWithObject: true });
  const left = Math.round((W - car.info.width) / 2);
  // Sit the car slightly low on the plate, like a car on a road line.
  const top = Math.round((H - car.info.height) * 0.62);
  const file = `${p.slug}.webp`;
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: car.data, left, top }])
    .webp({ quality: 72, alphaQuality: 80, effort: 6 })
    .toFile(path.join(outDir, file));
  const bytes = fs.statSync(path.join(outDir, file)).size;
  records.push({ slug: p.slug, src: `/images/kereta/kecil/${file}`, width: W, height: H, from: p.src800, bytes });
}
fs.writeFileSync(path.join(repo, 'src/data/car-thumbs.json'), JSON.stringify(records, null, 2) + '\n');
console.log(`${records.length} thumbnails, ${records.reduce((a, r) => a + r.bytes, 0)} bytes total`);
