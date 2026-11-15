/**
 * Brand assets for public/: the Edisi slider-i icons and the web manifest.
 *
 *   bun run assets:brand             favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png,
 *                                    icon-512.png, icon-maskable-512.png, site.webmanifest
 *   bun run assets:brand --og-default  also og-default.png (still the pre-Edisi design; off by default)
 *
 * Sources in scripts/brand/ are verbatim copies of the Edisi logo artwork (redesign worktree:
 * docs/eeat-revamp-2026-11/round4/concepts/edisi/logo/, written by round4/logo-slider/tools/build.py).
 * The PNGs are rasterised here with resvg. The committed PNGs were rasterised with another renderer, so a
 * run reproduces the same pixels except for anti-aliased edge pixels; git will show the PNGs as changed.
 */
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BRAND_DIR = path.join(SCRIPT_DIR, 'brand');
const ASSET_V = '?v=edisi-2026-11'; // bump with the artwork; also in src/layouts/Base.astro's icon links

/** Paper white: the Edisi page ground, also the manifest theme and background colour. */
const PAPER = '#FFFFFF';

/** Pre-Edisi palette, used only by the optional og-default.png below. */
const COLORS = {
  krim50: '#FAFAF7',
  stone900: '#1c1917',
  stone700: '#44403c',
  stone500: '#78716c',
  hijau600: '#257a52',
  emas500: '#d9922b',
};

/** The pre-Edisi default share image, kept behind --og-default. */
function element(type, style, children) {
  return { type, props: { style, children } };
}

function ogImage() {
  return element(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      position: 'relative',
      backgroundColor: COLORS.krim50,
    },
    [
      element('div', {
        position: 'absolute',
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
        borderWidth: 4,
        borderStyle: 'solid',
        borderColor: COLORS.stone900,
      }),
      element(
        'div',
        {
          position: 'absolute',
          top: 164,
          left: 100,
          display: 'flex',
          flexDirection: 'column',
        },
        [
          element(
            'div',
            {
              display: 'flex',
              alignItems: 'baseline',
              lineHeight: 1,
            },
            [
              element(
                'span',
                {
                  fontFamily: 'Fraunces',
                  fontSize: 120,
                  fontWeight: 600,
                  color: COLORS.stone900,
                  letterSpacing: '-3px',
                  lineHeight: 1,
                },
                'insurans',
              ),
              element(
                'span',
                {
                  fontFamily: 'Fraunces',
                  fontSize: 120,
                  fontWeight: 600,
                  color: COLORS.hijau600,
                  letterSpacing: '-3px',
                  lineHeight: 1,
                },
                '.co',
              ),
            ],
          ),
          element(
            'div',
            {
              marginTop: 22,
              width: 1000,
              fontFamily: 'Source Sans 3',
              fontSize: 40,
              fontWeight: 400,
              color: COLORS.stone700,
              lineHeight: 1.15,
            },
            'Panduan insurans untuk rakyat Malaysia biasa.',
          ),
        ],
      ),
      element(
        'div',
        {
          position: 'absolute',
          right: 100,
          bottom: 82,
          left: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        [
          element(
            'div',
            {
              fontFamily: 'Source Sans 3',
              fontSize: 22,
              fontWeight: 600,
              color: COLORS.stone500,
              letterSpacing: '3px',
              lineHeight: 1,
            },
            'BUKAN EJEN · BUKAN BROKER · 2026',
          ),
          element('div', {
            width: 24,
            height: 24,
            backgroundColor: COLORS.emas500,
          }),
        ],
      ),
    ],
  );
}

async function writePublicFile(filename, data) {
  const outputPath = path.join(PUBLIC_DIR, filename);
  await writeFile(outputPath, data);
  await chmod(outputPath, 0o644);
}

async function readBrandSvg(name) {
  return readFile(path.join(BRAND_DIR, name), 'utf8');
}

function rasterise(svg, size) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

/** A one-image ICO that wraps a PNG (Vista+ format, as the committed favicon.ico). */
function icoFromPng(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size >= 256 ? 0 : size, 6);
  header.writeUInt8(size >= 256 ? 0 : size, 7);
  header.writeUInt8(0, 8); // no palette
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // image offset
  return Buffer.concat([header, png]);
}

/** favicon.svg is favicon-32.svg without its accessible title (a tab icon is decorative). */
function faviconSvg(source) {
  return source.replace(' role="img" aria-labelledby="t"', '').replace(/\n\s*<title[^>]*>[^<]*<\/title>/, '');
}

async function writeManifest() {
  const manifest = {
    name: 'Insurans.co',
    short_name: 'Insurans',
    theme_color: PAPER,
    background_color: PAPER,
    display: 'standalone',
    icons: [
      // ?v= versions the URLs: the artwork changed at the same filenames, which live served as immutable for a year.
      { src: `/icon-192.png${ASSET_V}`, sizes: '192x192', type: 'image/png' },
      { src: `/icon-512.png${ASSET_V}`, sizes: '512x512', type: 'image/png' },
      { src: `/icon-maskable-512.png${ASSET_V}`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  await writePublicFile('site.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`);
}

async function writeOgDefault() {
  const [{ default: satori }, { createSatoriFonts, loadFonts }] = await Promise.all([
    import('satori'),
    import('./lib/og-fonts.mjs'),
  ]);
  const fonts = createSatoriFonts(await loadFonts());
  const svg = await satori(ogImage(), { width: 1200, height: 630, fonts });
  await writePublicFile('og-default.png', new Resvg(svg).render().asPng());
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });
  const appIcon = await readBrandSvg('app-icon.svg');
  const maskable = await readBrandSvg('maskable-icon.svg');
  const favicon32 = await readBrandSvg('favicon-32.svg');

  await writePublicFile('favicon.svg', faviconSvg(favicon32));
  await writePublicFile('favicon.ico', icoFromPng(rasterise(favicon32, 32), 32));
  // iOS masks the apple-touch icon itself, so it takes the full-bleed (maskable) artwork.
  await writePublicFile('apple-touch-icon.png', rasterise(maskable, 180));
  await writePublicFile('icon-192.png', rasterise(appIcon, 192));
  await writePublicFile('icon-512.png', rasterise(appIcon, 512));
  await writePublicFile('icon-maskable-512.png', rasterise(maskable, 512));
  await writeManifest();

  if (process.argv.includes('--og-default')) {
    await writeOgDefault();
    console.log('Generated og-default.png (pre-Edisi design).');
  }
  console.log('Generated Edisi brand icons and site.webmanifest in public/.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
