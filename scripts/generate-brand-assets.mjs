import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const FONT_DIR = path.join(SCRIPT_DIR, '.fonts');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Source+Sans+3:wght@400;600&display=swap';
const GOOGLE_FONTS_USER_AGENT = 'node';

const COLORS = {
  krim50: '#FAFAF7',
  stone900: '#1c1917',
  stone700: '#44403c',
  stone500: '#78716c',
  hijau600: '#257a52',
  emas500: '#d9922b',
};

const FONT_SPECS = [
  { family: 'Fraunces', weight: 600, file: 'fraunces-600.ttf' },
  { family: 'Source Sans 3', weight: 400, file: 'source-sans-3-400.ttf' },
  { family: 'Source Sans 3', weight: 600, file: 'source-sans-3-600.ttf' },
];

function element(type, style, children) {
  return { type, props: { style, children } };
}

function cssProperty(block, property) {
  const match = block.match(new RegExp(`${property}\\s*:\\s*([^;]+)`, 'i'));
  return match?.[1].trim() ?? '';
}

function parseFontFaces(css) {
  return [...css.matchAll(/@font-face\s*{([\s\S]*?)}/g)].map((match) => {
    const block = match[1];
    return {
      family: cssProperty(block, 'font-family').replace(/^['"]|['"]$/g, ''),
      weight: Number.parseInt(cssProperty(block, 'font-weight'), 10),
      source: cssProperty(block, 'src'),
      unicodeRange: cssProperty(block, 'unicode-range'),
    };
  });
}

function findTtfUrl(css, spec) {
  const candidates = parseFontFaces(css).filter(
    (face) => face.family === spec.family && face.weight === spec.weight && /format\(\s*['"]truetype['"]\s*\)/i.test(face.source),
  );
  const face = candidates.find((candidate) => /u\+0000-00ff/i.test(candidate.unicodeRange)) ?? candidates[0];

  if (!face) {
    throw new Error(`No TTF source found for ${spec.family} ${spec.weight}`);
  }

  const match = face.source.match(
    /url\(\s*(?:'([^']+)'|"([^"]+)"|([^\)\s]+))\s*\)\s*format\(\s*['"]truetype['"]\s*\)/i,
  );
  const url = match?.[1] ?? match?.[2] ?? match?.[3];

  if (!url) {
    throw new Error(`Could not parse TTF URL for ${spec.family} ${spec.weight}`);
  }

  return url;
}

async function loadFonts() {
  await mkdir(FONT_DIR, { recursive: true });
  const cached = await Promise.all(
    FONT_SPECS.map(async (spec) => {
      try {
        return await readFile(path.join(FONT_DIR, spec.file));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        return null;
      }
    }),
  );

  if (cached.every(Boolean)) return cached;

  const cssResponse = await fetch(GOOGLE_FONTS_URL, {
    headers: { 'User-Agent': GOOGLE_FONTS_USER_AGENT },
  });
  if (!cssResponse.ok) {
    throw new Error(`Google Fonts CSS request failed: ${cssResponse.status} ${cssResponse.statusText}`);
  }
  const css = await cssResponse.text();

  return Promise.all(
    FONT_SPECS.map(async (spec, index) => {
      if (cached[index]) return cached[index];

      const fontResponse = await fetch(findTtfUrl(css, spec), {
        headers: { 'User-Agent': GOOGLE_FONTS_USER_AGENT },
      });
      if (!fontResponse.ok) {
        throw new Error(`Font request failed for ${spec.file}: ${fontResponse.status} ${fontResponse.statusText}`);
      }

      const data = Buffer.from(await fontResponse.arrayBuffer());
      await writeFile(path.join(FONT_DIR, spec.file), data);
      return data;
    }),
  );
}

function asArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function createSatoriFonts(fontBuffers) {
  return FONT_SPECS.map((spec, index) => ({
    name: spec.family,
    data: asArrayBuffer(fontBuffers[index]),
    weight: spec.weight,
    style: 'normal',
  }));
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

function icon(size) {
  const borderWidth = Math.max(4, Math.round(size * 0.022));
  return element(
    'div',
    {
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      backgroundColor: COLORS.krim50,
      borderWidth,
      borderStyle: 'solid',
      borderColor: COLORS.stone900,
    },
    element(
      'div',
      {
        fontFamily: 'Fraunces',
        fontSize: Math.round(size * 0.68),
        fontWeight: 600,
        lineHeight: 1,
        color: COLORS.hijau600,
      },
      'i',
    ),
  );
}

async function writePublicFile(filename, data) {
  const outputPath = path.join(PUBLIC_DIR, filename);
  await writeFile(outputPath, data);
  await chmod(outputPath, 0o644);
}

async function renderPng(tree, width, height, filename, fonts) {
  const svg = await satori(tree, { width, height, fonts });
  const png = new Resvg(svg).render().asPng();
  await writePublicFile(filename, png);
}

async function writeManifest() {
  const manifest = {
    name: 'Insurans.co',
    short_name: 'Insurans',
    theme_color: COLORS.krim50,
    background_color: COLORS.krim50,
    display: 'standalone',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
  await writePublicFile('site.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`);
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });
  const fonts = createSatoriFonts(await loadFonts());

  await renderPng(ogImage(), 1200, 630, 'og-default.png', fonts);
  await renderPng(icon(180), 180, 180, 'apple-touch-icon.png', fonts);
  await renderPng(icon(192), 192, 192, 'icon-192.png', fonts);
  await renderPng(icon(512), 512, 512, 'icon-512.png', fonts);
  await writeManifest();

  console.log('Generated brand assets in public/.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
