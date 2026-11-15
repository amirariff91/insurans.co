// List thumbnails for car models: a crop of each credited cut-out photo (public/images/kereta/<slug>-800.webp),
// trimmed to the car and fitted into a 3:2 transparent canvas (144x96, 2x for a 72x48 box), so the sky plate
// behind it is CSS and no car is cut off. Writes public/images/kereta/kecil/<slug>-144.webp and -96.webp and src/data/car-thumbs.json
// (slug -> thumb path + the source photo it was made from; check 5 maps each thumb back to its credit).
// Run: node scripts/make-car-thumbs.mjs   (sharp comes with Astro's image service; no new dependency)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const photos = JSON.parse(fs.readFileSync(path.join(repo, 'src/data/car-photos.json'), 'utf8'));
const SIZES = [[144, 96], [96, 64]]; // 2x and 1x of the largest list box (72x48 CSS px); srcset picks one
const outDir = path.join(repo, 'public/images/kereta/kecil');
fs.mkdirSync(outDir, { recursive: true });
const records = [];
for (const p of photos) {
  if (!p.hasPhoto) continue;
  const trimmed = await sharp(path.join(repo, 'public', p.src800)).trim({ threshold: 1 }).toBuffer();
  const rec = { slug: p.slug, from: p.src800 };
  for (const [W, H] of SIZES) {
    const padX = Math.round(W / 18), padY = Math.round(H / 9.6);
    const car = await sharp(trimmed).resize({ width: W - 2 * padX, height: H - 2 * padY, fit: 'inside' }).toBuffer({ resolveWithObject: true });
    const left = Math.round((W - car.info.width) / 2);
    // Sit the car slightly low on the plate, like a car on a road line.
    const top = Math.round((H - car.info.height) * 0.62);
    const file = `${p.slug}-${W}.webp`;
    await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: car.data, left, top }])
      .webp({ quality: 72, alphaQuality: 80, effort: 6 })
      .toFile(path.join(outDir, file));
    rec[`src${W}`] = `/images/kereta/kecil/${file}`;
    rec[`bytes${W}`] = fs.statSync(path.join(outDir, file)).size;
  }
  Object.assign(rec, { width: SIZES[0][0], height: SIZES[0][1] });
  records.push(rec);
}
fs.writeFileSync(path.join(repo, 'src/data/car-thumbs.json'), JSON.stringify(records, null, 2) + '\n');
console.log(`${records.length} models; 144w ${records.reduce((a, r) => a + r.bytes144, 0)} bytes, 96w ${records.reduce((a, r) => a + r.bytes96, 0)} bytes`);
