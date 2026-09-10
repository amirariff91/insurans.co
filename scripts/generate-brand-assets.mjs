import { chmod, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { createSatoriFonts, loadFonts } from './lib/og-fonts.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const COLORS = {
  krim50: '#FAFAF7',
  stone900: '#1c1917',
  stone700: '#44403c',
  stone500: '#78716c',
  hijau600: '#257a52',
  emas500: '#d9922b',
};

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
