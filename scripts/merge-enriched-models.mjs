import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const ENRICHED_PATH = path.join(ROOT_DIR, 'docs/content/enriched-models.json');
const CAR_MODELS_PATH = path.join(ROOT_DIR, 'src/data/car-models.json');

const ENRICHED_FIELDS = [
  'premiumByNCD',
  'premiumByRegion',
  'premiumMethodology',
  'premiumReviewed',
  'claimFrequencyNote',
  'theftRiskDetail',
  'floodRiskNote',
  'modelYearNotes',
  'windscreenPrice',
  'addOnsDetail',
  'modelFAQs',
  'sources',
  'factChecked',
  'factCheckNotes',
];

function stripSemakMarkers(value) {
  if (typeof value === 'string') {
    return value.replace(/\s*\[semak\]/g, '');
  }

  if (Array.isArray(value)) {
    return value.map(stripSemakMarkers);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, stripSemakMarkers(nestedValue)]),
    );
  }

  return value;
}

function sameValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function main() {
  const [enrichedText, carModelsText] = await Promise.all([
    readFile(ENRICHED_PATH, 'utf8'),
    readFile(CAR_MODELS_PATH, 'utf8'),
  ]);
  const enriched = JSON.parse(enrichedText);
  const carModels = JSON.parse(carModelsText);

  if (!Array.isArray(enriched.records) || !Array.isArray(carModels)) {
    throw new Error('Expected records and car models to be arrays');
  }

  const modelsBySlug = new Map(carModels.map((model) => [model.slug, model]));
  const factCheckedRecords = enriched.records.filter((record) => record.factChecked);

  for (const record of factCheckedRecords) {
    const model = modelsBySlug.get(record.slug);
    if (!model) {
      throw new Error(`No car model found for enriched slug: ${record.slug}`);
    }

    for (const field of ENRICHED_FIELDS) {
      if (!Object.hasOwn(record, field)) {
        throw new Error(`Missing ${field} for enriched slug: ${record.slug}`);
      }

      const value = stripSemakMarkers(record[field]);
      if (Object.hasOwn(model, field)) {
        if (!sameValue(model[field], value)) {
          throw new Error(`Refusing to overwrite ${field} for car model: ${record.slug}`);
        }
      } else {
        model[field] = value;
      }
    }

    if (Object.hasOwn(model, 'enriched')) {
      if (model.enriched !== true) {
        throw new Error(`Refusing to overwrite enriched for car model: ${record.slug}`);
      }
    } else {
      model.enriched = true;
    }
  }

  const output = `${JSON.stringify(carModels, null, 2)}\n`;
  if (output !== carModelsText) {
    await writeFile(CAR_MODELS_PATH, output, 'utf8');
  }

  console.log(`Merged ${factCheckedRecords.length} fact-checked car models.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
