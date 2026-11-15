// Named imports: this module ships to the browser (see roadtax.ts on Rolldown and default-imported JSON).
import { car, regions, testCases } from '../data/roadtax-ev.json';

export type EvRegion = 'semenanjung' | 'sabah' | 'sarawak' | 'langkawi' | 'labuan';

export interface EvBand {
  minW: number;
  /** null = the open-ended band above the top of the table ("Melebihi 1,010,001"). */
  maxW: number | null;
  annualRM: number;
}

export interface EvResult {
  band: EvBand;
  /** Semenanjung/Sabah/Sarawak rate for the band. */
  baseRM: number;
  /** Amount for the chosen region (Langkawi and Labuan pay 50%). */
  rate: number;
  factor: number;
}

const bands: EvBand[] = [
  ...(car.bands as EvBand[]),
  { minW: car.above.minW, maxW: null, annualRM: car.above.annualRM },
];

export const EV_BANDS: readonly EvBand[] = bands;

export function regionFactor(region: EvRegion): number {
  const match = regions.find((r) => r.id === region);
  if (!match) throw new RangeError(`Wilayah tidak dikenali: ${region}`);
  return match.factor;
}

/**
 * Band lookup by motor power in kW. A band's upper limit belongs to that band (150 kW pays the
 * 140,001–150,000 W rate; 150.1 kW pays the next one). Decimal kW between two whole-watt limits
 * fall into the higher band, since they exceed the lower band's limit.
 */
export function calcEvRoadtax(kw: number, region: EvRegion): EvResult {
  if (!Number.isFinite(kw) || kw <= 0) throw new RangeError('Kuasa motor mesti lebih daripada 0 kW.');
  // Compare kW directly against each band's limit: every limit is a whole number of kW, so maxW / 1000 is
  // exact, and no rounding can pull a value just above a limit (150.0000001) back onto it.
  const band = bands.find((b) => b.maxW === null || kw <= b.maxW / 1000)!;
  const factor = regionFactor(region);
  return { band, baseRM: band.annualRM, rate: Math.round(band.annualRM * factor * 100) / 100, factor };
}

/** Build-time check: bands start at 1 W, have no gaps or overlaps, never fall, and every test case matches. */
export function checkEvData(): void {
  const errors: string[] = [];
  if (bands[0].minW !== 1) errors.push(`first band starts at ${bands[0].minW} W, expected 1`);
  for (let i = 1; i < bands.length; i += 1) {
    const prev = bands[i - 1];
    const cur = bands[i];
    if (prev.maxW === null) errors.push(`band ${i - 1} is open-ended but is not the last`);
    else if (cur.minW !== prev.maxW + 1) errors.push(`gap or overlap between ${prev.maxW} W and ${cur.minW} W`);
    if (cur.annualRM < prev.annualRM) errors.push(`amount falls at ${cur.minW} W`);
  }
  for (const b of bands) if (b.maxW !== null && b.maxW < b.minW) errors.push(`band ${b.minW}–${b.maxW} W is inverted`);
  for (const t of testCases) {
    const got = calcEvRoadtax(t.kw, t.region as EvRegion).rate;
    if (got !== t.expect) errors.push(`${t.kw} kW ${t.region}: got RM${got}, expected RM${t.expect}`);
  }
  if (errors.length) throw new Error(`roadtax-ev.json is invalid:\n- ${errors.join('\n- ')}`);
}

/**
 * Reads what a reader types: "130", "130kW", "130 kW", "130.5", "130,5", "1,5", "130000 W".
 * Comma groups of exactly three digits ("1,010") are thousands; any other comma is a decimal point.
 * An explicit unit is always honoured ("10000 kW" is 10,000 kW; "130000 W" is 130 kW). Only a unitless
 * value of 10,000 or more is read as watts (the circular's own unit) and converted; asWatts says so.
 */
export function parseKw(raw: string): { kw: number; asWatts: boolean } | null {
  let text = raw.trim().replace(/\s+/g, '');
  let unit: 'kw' | 'w' | null = null;
  if (/kw$/i.test(text)) {
    text = text.slice(0, -2);
    unit = 'kw';
  } else if (/w$/i.test(text)) {
    text = text.slice(0, -1);
    unit = 'w';
  }
  let asWatts = unit === 'w';
  if (text === '') return null;
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(text)) text = text.replace(/,/g, '');
  else if (/^\d+,\d+$/.test(text)) text = text.replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  let value = Number(text);
  if (!Number.isFinite(value) || value <= 0) return null;
  if (unit === null && value >= 10000) asWatts = true;
  if (asWatts) value /= 1000;
  return { kw: value, asWatts };
}
