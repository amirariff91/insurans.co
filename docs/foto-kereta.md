# Car photos (foto kereta)

Each car model page shows a black-and-white cut-out of the car: `public/images/kereta/<slug>-800.webp` and `-400.webp`, credited in `src/data/car-photos.json` and listed on `/kredit-foto/`.

## Sourcing a photo

- Wikimedia Commons only. Licence must be CC BY, CC BY-SA, CC0 or public domain. Never NC (non-commercial) or ND (no derivatives): we remove the background, so it is a derivative.
- Same generation as the page covers (check `yearRange` in `src/data/car-models.json`).
- Front three-quarter view, whole car in frame with some margin, daylight, no people, nothing parked in front of it. Avoid showroom shots (glare, signs, floor reflections) and head-on or side-on shots.
- Read the file's Commons page for author, licence and any required attribution text. Download the original (one request at a time, generic User-Agent).

## Making the cut-out

```
uv run scripts/make-car-photo.py SOURCE.jpg <slug> [--plate x0,y0,x1,y1] [--mask-out x0,y0,x1,y1] [--crop x0,y0,x1,y1]
node scripts/make-car-thumbs.mjs
```

The script removes the background with the `isnet-general-use` model in `~/.rembg/models/` (onnxruntime, run by `uv`, nothing added to `package.json`), keeps only the car, fills holes in the glass, chokes the edge by 1 px, turns it black and white, trims it to the car and writes the 800w and 400w WebP files (it lowers quality until the 800w file is under about 60 KB). Boxes are in source pixels; the script prints the car's box in the source to help place them.

- `--plate` paints a dark block over a legible private number plate. Blank, dealer or foreign plates with no readable number can stay.
- `--mask-out` drops something the model kept: the edge of a car behind, a kerb, a sign or post on the roof line.
- Run it into a scratch folder with `--out DIR` first, look at the result on a light background at full size, then run it for real.

`make-car-thumbs.mjs` regenerates every list thumbnail (`public/images/kereta/kecil/`, `src/data/car-thumbs.json`) from the 800w files.

## The record

In `src/data/car-photos.json`, per slug: `width`/`height` of the 800w file, `alt`, and `credit` with `title` (file name without extension), `author`, `licence`, `licenceUrl`, `source` (the Commons file page), `sourceSite`, `retrieved` (date downloaded) and `line` (the credit sentence shown on the page). Also `modifications` (what was changed, in Malay, ending "nombor plat ditutup." when a plate was covered), `platesCovered`, `processing` (the exact command, with `SRC` for the source file) and `aiRetouched: false`.

## Checks

`bun run build`, then `bun run check:site`: check 5 fails if a used photo or thumbnail has no author, licence and source, if a model page does not link the licence, or if `/kredit-foto/` does not list the source.
