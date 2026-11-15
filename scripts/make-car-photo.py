# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow>=10", "numpy>=1.26", "onnxruntime>=1.17", "scipy>=1.11"]
# ///
"""Make a car cut-out for insurans.co from a Commons source photo.

Background removed with the isnet-general-use model (~/.rembg/models/isnet-general-use/isnet-general-use.onnx),
matte cleaned (largest shape only, holes such as windows filled, 1 px edge choke so no fringe), black and white,
legible number plates covered with a dark block, trimmed to the car, written as
public/images/kereta/<slug>-800.webp and -400.webp. Prints the width/height for src/data/car-photos.json.

  uv run scripts/make-car-photo.py SOURCE.jpg SLUG [--crop x0,y0,x1,y1] [--plate x0,y0,x1,y1 ...]
                                   [--mask-out x0,y0,x1,y1 ...] [--out DIR]

Boxes are in source-image pixels. --crop cuts the source first (all other boxes are then relative to the crop).
--plate paints a dark block over a plate. --mask-out drops something the model kept (a person, a sign, a stand).
"""
import argparse
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageDraw, ImageFilter, ImageOps
from scipy import ndimage

REPO = Path(__file__).resolve().parent.parent
MODEL = Path.home() / ".rembg/models/isnet-general-use/isnet-general-use.onnx"
MAX_BYTES_800 = 62_000  # the set sits around 35-60 KB at 800w


def box(s):
    v = [int(float(x)) for x in s.split(",")]
    if len(v) != 4:
        raise argparse.ArgumentTypeError("box is x0,y0,x1,y1")
    return v


def matte(img: Image.Image) -> np.ndarray:
    sess = ort.InferenceSession(str(MODEL), providers=["CPUExecutionProvider"])
    x = np.asarray(img.convert("RGB").resize((1024, 1024), Image.LANCZOS), dtype=np.float32) / 255.0
    x = (x - 0.5) / 1.0  # rembg's isnet normalisation (mean 0.5, std 1)
    x = x.transpose(2, 0, 1)[None]
    out = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
    out = (out - out.min()) / (out.max() - out.min() + 1e-8)
    m = Image.fromarray((out * 255).astype(np.uint8)).resize(img.size, Image.LANCZOS)
    return np.asarray(m, dtype=np.float32) / 255.0


def clean(a: np.ndarray, mask_out) -> np.ndarray:
    for x0, y0, x1, y1 in mask_out:
        a[y0:y1, x0:x1] = 0
    solid = a > 0.5
    lab, n = ndimage.label(solid)
    if n > 1:  # keep only the car: the largest connected shape
        sizes = ndimage.sum(solid, lab, range(1, n + 1))
        solid = lab == (int(np.argmax(sizes)) + 1)
    solid = ndimage.binary_fill_holes(solid)  # glass the model let through becomes car again
    solid = ndimage.binary_opening(solid, iterations=2)  # strip thin stray fringes
    solid = ndimage.binary_erosion(solid, iterations=1)  # choke 1 px of background halo
    soft = np.clip((a - 0.25) / 0.5, 0, 1)  # keep the model's soft edge only where the shape is solid nearby
    near = ndimage.binary_dilation(solid, iterations=2)
    alpha = np.where(solid, 1.0, np.where(near, soft * 0.6, 0.0))
    return np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("source")
    p.add_argument("slug")
    p.add_argument("--crop", type=box)
    p.add_argument("--plate", type=box, action="append", default=[])
    p.add_argument("--mask-out", type=box, action="append", default=[])
    p.add_argument("--out", default=str(REPO / "public/images/kereta"))
    args = p.parse_args()

    img = ImageOps.exif_transpose(Image.open(args.source)).convert("RGB")
    if args.crop:
        img = img.crop(args.crop)
    a = matte(img)
    alpha = clean(a, args.mask_out)

    grey = ImageOps.autocontrast(img.convert("L"), cutoff=0.5)
    d = ImageDraw.Draw(grey)
    for x0, y0, x1, y1 in args.plate:
        d.rounded_rectangle([x0, y0, x1, y1], radius=max(2, (y1 - y0) // 6), fill=28)
    car = Image.merge("RGBA", (grey, grey, grey, Image.fromarray(alpha)))
    bbox = Image.fromarray(alpha).point(lambda v: 255 if v > 8 else 0).getbbox()
    car = car.crop(bbox)
    print(f"car box in source: {','.join(map(str, bbox))}")

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    for w in (800, 400):
        h = round(car.height * w / car.width)
        im = car.resize((w, h), Image.LANCZOS)
        f = out / f"{args.slug}-{w}.webp"
        for q in (80, 76, 72, 68, 64, 60):
            im.save(f, "WEBP", quality=q, alpha_quality=80, method=6)
            if w == 400 or f.stat().st_size <= MAX_BYTES_800:
                break
        print(f"{f.relative_to(REPO) if f.is_relative_to(REPO) else f}: {w}x{h}, {f.stat().st_size} bytes, q{q}")


if __name__ == "__main__":
    sys.exit(main())
