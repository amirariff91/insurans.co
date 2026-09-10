import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.resolve(SCRIPT_DIR, '..', '.fonts');

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Source+Sans+3:wght@400;600&display=swap';
const GOOGLE_FONTS_USER_AGENT = 'node';

export const FONT_SPECS = [
  { family: 'Fraunces', weight: 600, file: 'fraunces-600.ttf' },
  { family: 'Source Sans 3', weight: 400, file: 'source-sans-3-400.ttf' },
  { family: 'Source Sans 3', weight: 600, file: 'source-sans-3-600.ttf' },
];

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
    (face) =>
      face.family === spec.family &&
      face.weight === spec.weight &&
      /format\(\s*['"]truetype['"]\s*\)/i.test(face.source),
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

export async function loadFonts() {
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

export function createSatoriFonts(fontBuffers) {
  return FONT_SPECS.map((spec, index) => ({
    name: spec.family,
    data: asArrayBuffer(fontBuffers[index]),
    weight: spec.weight,
    style: 'normal',
  }));
}
