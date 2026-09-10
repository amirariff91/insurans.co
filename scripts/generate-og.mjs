import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from '@shuding/opentype.js';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { createSatoriFonts, loadFonts } from './lib/og-fonts.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const WIDTH = 1200;
const HEIGHT = 630;
const CONTENT_X = 64;
const CONTENT_WIDTH = 1072;
const TITLE_TOP = 148;
const FOOTER_RULE_TOP = 522;
const TITLE_SIZES = [64, 56, 48];
const FOOTER_TEXT = 'insurans.co · Bukan ejen. Bukan broker.';
const NUMBER_FORMAT = new Intl.NumberFormat('ms-MY', { maximumFractionDigits: 0 });

const COLORS = {
  krim50: '#FAFAF7',
  stone900: '#1c1917',
  stone700: '#44403c',
  hijau700: '#1e6243',
  hijau800: '#1b4e37',
};

function element(type, style, children) {
  return { type, props: { style, children } };
}

function asArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(ROOT_DIR, relativePath), 'utf8'));
}

function measureText(font, text, fontSize) {
  return font.getAdvanceWidth(text, fontSize, { kerning: true });
}

function splitWord(word, font, fontSize, maxWidth) {
  const chunks = [];
  let chunk = '';

  for (const character of word) {
    const candidate = chunk + character;
    if (chunk && measureText(font, candidate, fontSize) > maxWidth) {
      chunks.push(chunk);
      chunk = character;
    } else {
      chunk = candidate;
    }
  }

  if (chunk) chunks.push(chunk);
  return chunks;
}

function wrapMeasuredText(text, font, fontSize, maxWidth) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let line = '';

  for (const word of words) {
    if (measureText(font, word, fontSize) > maxWidth) {
      if (line) {
        lines.push(line);
        line = '';
      }
      const chunks = splitWord(word, font, fontSize, maxWidth);
      lines.push(...chunks.slice(0, -1));
      line = chunks.at(-1) ?? '';
      continue;
    }

    const candidate = line ? `${line} ${word}` : word;
    if (line && measureText(font, candidate, fontSize) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function fitMeasuredText(text, font, sizes, maxWidth, maxLines) {
  for (const fontSize of sizes) {
    const lines = wrapMeasuredText(text, font, fontSize, maxWidth);
    if (lines.length <= maxLines) return { fontSize, lines };
  }

  throw new Error(`Text does not fit in ${maxLines} lines: ${text}`);
}

function lineHeight(layout, multiplier = 1) {
  return layout.lines.length * layout.fontSize * multiplier;
}

function linesNode(layout, { top, fontFamily, fontWeight, color, lineHeightMultiplier = 1, letterSpacing = '0px' }) {
  return element(
    'div',
    {
      position: 'absolute',
      top,
      left: CONTENT_X,
      width: CONTENT_WIDTH,
      display: 'flex',
      flexDirection: 'column',
    },
    layout.lines.map((line) =>
      element(
        'div',
        {
          fontFamily,
          fontSize: layout.fontSize,
          fontWeight,
          color,
          lineHeight: lineHeightMultiplier,
          letterSpacing,
          whiteSpace: 'nowrap',
        },
        line,
      ),
    ),
  );
}

function rule(top) {
  return element('div', {
    position: 'absolute',
    top,
    left: CONTENT_X,
    width: CONTENT_WIDTH,
    height: 2,
    backgroundColor: COLORS.stone900,
  });
}

function logoMark() {
  const scale = 40 / 32;
  return element(
    'div',
    {
      position: 'absolute',
      top: 48,
      left: CONTENT_X,
      width: 40,
      height: 40,
      display: 'flex',
    },
    [
      element('div', {
        position: 'absolute',
        top: 1 * scale,
        left: 1 * scale,
        width: 30 * scale,
        height: 30 * scale,
        boxSizing: 'border-box',
        borderWidth: 2 * scale,
        borderStyle: 'solid',
        borderColor: COLORS.stone900,
        backgroundColor: COLORS.krim50,
      }),
      element('div', {
        position: 'absolute',
        top: 14 * scale,
        left: 14 * scale,
        width: 4 * scale,
        height: 11 * scale,
        backgroundColor: COLORS.stone900,
      }),
      element('div', {
        position: 'absolute',
        top: 24 * scale,
        left: 10 * scale,
        width: 12 * scale,
        height: 2 * scale,
        backgroundColor: COLORS.stone900,
      }),
      element('div', {
        position: 'absolute',
        top: 7 * scale,
        left: 14 * scale,
        width: 4 * scale,
        height: 4 * scale,
        backgroundColor: COLORS.hijau700,
      }),
    ],
  );
}

function wordmark() {
  return element(
    'div',
    {
      position: 'absolute',
      top: 53,
      left: 120,
      display: 'flex',
      alignItems: 'baseline',
      fontFamily: 'Fraunces',
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 1,
    },
    [
      element('span', { color: COLORS.stone900 }, 'insurans'),
      element('span', { color: COLORS.hijau700 }, '.co'),
    ],
  );
}

function frame(category, status, content) {
  return element(
    'div',
    {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      position: 'relative',
      backgroundColor: COLORS.krim50,
    },
    [
      logoMark(),
      wordmark(),
      element(
        'div',
        {
          position: 'absolute',
          top: 58,
          right: CONTENT_X,
          width: 600,
          fontFamily: 'Source Sans 3',
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1,
          color: COLORS.stone700,
          textAlign: 'right',
          whiteSpace: 'nowrap',
        },
        category,
      ),
      rule(112),
      ...content,
      rule(FOOTER_RULE_TOP),
      element(
        'div',
        {
          position: 'absolute',
          top: 535,
          left: CONTENT_X,
          right: CONTENT_X,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        [
          element(
            'div',
            {
              fontFamily: 'Source Sans 3',
              fontSize: 24,
              fontWeight: 400,
              lineHeight: 1,
              color: COLORS.stone700,
              whiteSpace: 'nowrap',
            },
            FOOTER_TEXT,
          ),
          element(
            'div',
            {
              fontFamily: 'Source Sans 3',
              fontSize: 24,
              fontWeight: 600,
              lineHeight: 1,
              color: COLORS.stone700,
              textAlign: 'right',
              whiteSpace: 'nowrap',
            },
            status,
          ),
        ],
      ),
    ],
  );
}

function titleNode(layout) {
  return linesNode(layout, {
    top: TITLE_TOP,
    fontFamily: 'Fraunces',
    fontWeight: 600,
    color: COLORS.stone900,
    lineHeightMultiplier: 1,
    letterSpacing: '-1px',
  });
}

function moneyRange(min, max) {
  return `RM${NUMBER_FORMAT.format(min)}–RM${NUMBER_FORMAT.format(max)}`;
}

function modelCard(model, titleFont) {
  const title = fitMeasuredText(model.fullName, titleFont, TITLE_SIZES, CONTENT_WIDTH, 3);
  const titleHeight = lineHeight(title);
  const amountTop = TITLE_TOP + titleHeight + 24;
  const amountHeight = 72;
  const captionTop = amountTop + amountHeight + 8;
  const captionHeight = 32;
  const secondaryTop = captionTop + captionHeight + 10;
  const secondaryHeight = 32;
  const disclaimerTop = secondaryTop + secondaryHeight + 10;

  const status = model.premiumReviewed
    ? `Semakan harga: ${model.premiumReviewed}`
    : 'Semakan harga belum direkodkan';

  return frame('INSURANS KERETA', status, [
    titleNode(title),
    element(
      'div',
      {
        position: 'absolute',
        top: amountTop,
        left: CONTENT_X,
        width: CONTENT_WIDTH,
        fontFamily: 'Fraunces',
        fontSize: 72,
        fontWeight: 600,
        lineHeight: 1,
        color: COLORS.hijau800,
        whiteSpace: 'nowrap',
      },
      moneyRange(model.premiumNCD55Min, model.premiumNCD55Max),
    ),
    element(
      'div',
      {
        position: 'absolute',
        top: captionTop,
        left: CONTENT_X,
        width: CONTENT_WIDTH,
        fontFamily: 'Source Sans 3',
        fontSize: 28,
        fontWeight: 600,
        lineHeight: 1,
        color: COLORS.hijau800,
        whiteSpace: 'nowrap',
      },
      'NCD 55% · Anggaran setahun',
    ),
    element(
      'div',
      {
        position: 'absolute',
        top: secondaryTop,
        left: CONTENT_X,
        width: CONTENT_WIDTH,
        fontFamily: 'Source Sans 3',
        fontSize: 28,
        fontWeight: 400,
        lineHeight: 1,
        color: COLORS.stone700,
        whiteSpace: 'nowrap',
      },
      `Tanpa NCD: ${moneyRange(model.premiumNCD0Min, model.premiumNCD0Max)}`,
    ),
    element(
      'div',
      {
        position: 'absolute',
        top: disclaimerTop,
        left: CONTENT_X,
        width: CONTENT_WIDTH,
        fontFamily: 'Source Sans 3',
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 1,
        color: COLORS.stone700,
        whiteSpace: 'nowrap',
      },
      'Bukan quotation',
    ),
  ]);
}

function companyCard(company, titleFont, sourceFont) {
  const title = fitMeasuredText(company.name, titleFont, TITLE_SIZES, CONTENT_WIDTH, 3);
  const titleHeight = lineHeight(title);
  const fullName = company.fullName && company.fullName !== company.name
    ? fitMeasuredText(company.fullName, sourceFont, [32, 30, 28, 24], CONTENT_WIDTH, 2)
    : null;
  const fullNameTop = TITLE_TOP + titleHeight + 26;
  const fullNameHeight = fullName ? lineHeight(fullName, 1.15) : 0;
  const supportTop = fullNameTop + fullNameHeight + 28;

  return frame('SYARIKAT INSURANS', 'Profil syarikat', [
    titleNode(title),
    ...(fullName
      ? [
          linesNode(fullName, {
            top: fullNameTop,
            fontFamily: 'Source Sans 3',
            fontWeight: 400,
            color: COLORS.stone700,
            lineHeightMultiplier: 1.15,
          }),
        ]
      : []),
    element(
      'div',
      {
        position: 'absolute',
        top: supportTop,
        left: CONTENT_X,
        width: CONTENT_WIDTH,
        fontFamily: 'Source Sans 3',
        fontSize: 36,
        fontWeight: 600,
        lineHeight: 1.1,
        color: COLORS.stone700,
        whiteSpace: 'nowrap',
      },
      'Produk, kelebihan & cara claim',
    ),
  ]);
}

function comparisonCard(companyA, companyB, titleFont) {
  const title = fitMeasuredText(`${companyA.name} vs ${companyB.name}`, titleFont, TITLE_SIZES, CONTENT_WIDTH, 3);
  const titleHeight = lineHeight(title);
  const supportTop = TITLE_TOP + titleHeight + 30;

  return frame('PERBANDINGAN', 'Perbandingan neutral', [
    titleNode(title),
    element(
      'div',
      {
        position: 'absolute',
        top: supportTop,
        left: CONTENT_X,
        width: CONTENT_WIDTH,
        fontFamily: 'Source Sans 3',
        fontSize: 36,
        fontWeight: 600,
        lineHeight: 1.1,
        color: COLORS.stone700,
        whiteSpace: 'nowrap',
      },
      'Perbandingan harga, perlindungan & claim',
    ),
  ]);
}

async function writePublicFile(relativePath, data) {
  const outputPath = path.join(PUBLIC_DIR, relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, data);
  await chmod(outputPath, 0o644);
}

async function renderPng(tree, relativePath, fonts) {
  const svg = await satori(tree, { width: WIDTH, height: HEIGHT, fonts });
  const png = new Resvg(svg).render().asPng();
  await writePublicFile(relativePath, png);
  return png.length;
}

async function main() {
  const [models, companies, comparisons] = await Promise.all([
    readJson('src/data/car-models.json'),
    readJson('src/data/companies.json'),
    readJson('src/data/comparisons.json'),
  ]);
  const fontBuffers = await loadFonts();
  const fonts = createSatoriFonts(fontBuffers);
  const titleFont = opentype.parse(asArrayBuffer(fontBuffers[0]));
  const sourceFont = opentype.parse(asArrayBuffer(fontBuffers[1]));
  const companyBySlug = new Map(companies.map((company) => [company.slug, company]));

  let largestBytes = 0;
  for (const model of models) {
    largestBytes = Math.max(largestBytes, await renderPng(modelCard(model, titleFont), `og/car-insurance/${model.slug}.png`, fonts));
  }
  for (const company of companies) {
    largestBytes = Math.max(largestBytes, await renderPng(companyCard(company, titleFont, sourceFont), `og/companies/${company.slug}.png`, fonts));
  }
  for (const comparison of comparisons) {
    const companyA = companyBySlug.get(comparison.company1);
    const companyB = companyBySlug.get(comparison.company2);
    if (!companyA || !companyB) {
      throw new Error(`Unknown company in comparison ${comparison.slug}`);
    }
    largestBytes = Math.max(
      largestBytes,
      await renderPng(
        comparisonCard(companyA, companyB, titleFont),
        `og/perbandingan/${comparison.slug}.png`,
        fonts,
      ),
    );
  }

  console.log(
    `Generated ${models.length} model, ${companies.length} company and ${comparisons.length} comparison OG cards (largest ${largestBytes} bytes).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
