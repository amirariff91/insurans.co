// Named import: this module ships to the browser, and Vite 8 (Rolldown) does not
// tree-shake unused properties of a default-imported JSON object.
import { rates } from '../data/roadtax-motorcycle.json';

export type MotorcycleRegion = 'semenanjung' | 'sabahSarawak';

export interface MotorcycleBand {
  minCc: number;
  maxCc: number;
  rate: number | null;
}

export interface MotorcycleRoadtaxResult {
  /** Fixed annual rate in RM, or null when JPJ states "kadar sedia ada" (≤150cc). */
  rate: number | null;
  band: MotorcycleBand;
  /** True when the band has no published numeric rate (≤150cc "kadar sedia ada"). */
  kadarSediaAda: boolean;
}

export function calcMotorcycleRoadtax(region: MotorcycleRegion, cc: number): MotorcycleRoadtaxResult {
  if (!Number.isFinite(cc) || cc <= 0) {
    throw new RangeError('Kapasiti enjin mesti lebih daripada 0cc.');
  }

  // Engine capacity is a whole number; floor any fractional input so values
  // between band boundaries (e.g. 150.5) resolve deterministically instead of
  // falling through every band.
  const engineCc = Math.floor(cc);
  const bands = rates[region] as readonly MotorcycleBand[];
  const band = bands.find(
    (candidate) => engineCc >= candidate.minCc && (candidate.maxCc === 99999 || engineCc <= candidate.maxCc),
  );

  if (!band) {
    throw new RangeError(`Tiada band roadtax motosikal untuk ${engineCc}cc.`);
  }

  return {
    rate: band.rate,
    band,
    kadarSediaAda: band.rate === null,
  };
}
