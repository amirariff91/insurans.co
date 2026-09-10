import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const FONT_DIR = path.join(ROOT_DIR, 'public', 'fonts');

const assets = [
  {
    filename: 'fraunces-500-latin.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-500-normal.woff2',
  },
  {
    filename: 'fraunces-600-latin.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-600-normal.woff2',
  },
  {
    filename: 'source-sans-3-400-latin.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/source-sans-3@latest/latin-400-normal.woff2',
  },
  {
    filename: 'source-sans-3-500-latin.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/source-sans-3@latest/latin-500-normal.woff2',
  },
  {
    filename: 'source-sans-3-600-latin.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/source-sans-3@latest/latin-600-normal.woff2',
  },
  {
    filename: 'source-sans-3-700-latin.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/source-sans-3@latest/latin-700-normal.woff2',
  },
  {
    filename: 'OFL-Fraunces.txt',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/OFL.txt',
  },
  {
    filename: 'OFL-Source-Sans-3.txt',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/sourcesans3/OFL.txt',
  },
];

async function fetchAsset({ filename, url }) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'insurans.co font asset fetcher',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  const body = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(FONT_DIR, filename), body);
  console.log(`${filename} ${body.byteLength} bytes`);
}

await mkdir(FONT_DIR, { recursive: true });
await Promise.all(assets.map(fetchAsset));
