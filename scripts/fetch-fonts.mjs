/**
 * Verifies the web fonts vendored in public/fonts/ and prints their versions. It downloads nothing.
 *
 *   bun scripts/fetch-fonts.mjs
 *
 * Gabarito (display) and Figtree (text) are variable, Latin-subset WOFF2 files, each with its SIL Open Font
 * Licence text beside it. To replace a font, put the new WOFF2 and its OFL.txt in public/fonts/ under the same
 * names (or update the names here and in src/), then run this script.
 *
 * The share-image scripts (generate-og.mjs, generate-brand-assets.mjs --og-default) use their own TTF fonts
 * in .fonts/, fetched by scripts/lib/og-fonts.mjs; they do not read public/fonts/.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliDecompressSync } from 'node:zlib';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(SCRIPT_DIR, '..', 'public', 'fonts');

const FONTS = [
  { family: 'Gabarito', file: 'gabarito-var-latin.woff2', licence: 'OFL-Gabarito.txt' },
  { family: 'Figtree', file: 'figtree-var-latin.woff2', licence: 'OFL-Figtree.txt' },
];

// The WOFF2 known-table list (index = the 6-bit tag index in the table directory).
const KNOWN_TAGS = 'cmap head hhea hmtx maxp name OS/2 post cvt  fpgm glyf loca prep CFF  VORG EBDT EBLC gasp hdmx kern LTSH PCLT VDMX vhea vmtx BASE GDEF GPOS GSUB EBSC JSTF MATH CBDT CBLC COLR CPAL SVG  sbix acnt avar bdat bloc bsln cvar fdsc feat fmtx fvar gvar hsty just lcar mort morx opbd prop trak Zapf Silf Glat Gloc Feat Sill'
  .match(/.{4}\s?/g)
  .map((t) => t.slice(0, 4));

function readBase128(buf, state) {
  let value = 0;
  for (let i = 0; i < 5; i += 1) {
    const byte = buf[state.offset];
    state.offset += 1;
    value = value * 128 + (byte & 0x7f);
    if (!(byte & 0x80)) return value;
  }
  throw new Error('bad UIntBase128');
}

/** Reads name ID 5 (version) from a WOFF2 file; WOFF2 never transforms the name table. */
function woff2Version(buf) {
  if (buf.toString('ascii', 0, 4) !== 'wOF2') throw new Error('not a WOFF2 file');
  const numTables = buf.readUInt16BE(12);
  const compressedLength = buf.readUInt32BE(20);
  const state = { offset: 48 };
  let offset = 0;
  let nameTable = null;
  for (let i = 0; i < numTables; i += 1) {
    const flags = buf[state.offset];
    state.offset += 1;
    let tag = KNOWN_TAGS[flags & 0x3f];
    if ((flags & 0x3f) === 63) {
      tag = buf.toString('ascii', state.offset, state.offset + 4);
      state.offset += 4;
    }
    const transform = (flags >> 6) & 3;
    const origLength = readBase128(buf, state);
    const transformed = tag === 'glyf' || tag === 'loca' ? transform === 0 : transform !== 0;
    const length = transformed ? readBase128(buf, state) : origLength;
    if (tag === 'name') nameTable = { offset, length };
    offset += length;
  }
  if (!nameTable) return 'unknown';
  const data = brotliDecompressSync(buf.subarray(state.offset, state.offset + compressedLength));
  const name = data.subarray(nameTable.offset, nameTable.offset + nameTable.length);
  const count = name.readUInt16BE(2);
  const strings = name.readUInt16BE(4);
  for (let i = 0; i < count; i += 1) {
    const r = 6 + i * 12;
    const [platform, , , nameId, len, off] = [0, 2, 4, 6, 8, 10].map((k) => name.readUInt16BE(r + k));
    if (nameId === 5 && platform === 3) {
      return Buffer.from(name.subarray(strings + off, strings + off + len)).swap16().toString('utf16le');
    }
  }
  return 'unknown';
}

let failed = false;
for (const font of FONTS) {
  try {
    const woff2 = await readFile(path.join(FONT_DIR, font.file));
    const licence = await readFile(path.join(FONT_DIR, font.licence), 'utf8');
    if (!/SIL Open Font License/.test(licence)) throw new Error(`${font.licence} is not an OFL text`);
    const copyright = licence.split('\n')[0];
    console.log(`${font.family}: ${font.file}, ${woff2.length} bytes, ${woff2Version(woff2)}. ${font.licence}: ${copyright}`);
  } catch (error) {
    failed = true;
    console.error(`${font.family}: ${error.message}`);
  }
}
process.exitCode = failed ? 1 : 0;
