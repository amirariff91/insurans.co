import rates from '../data/roadtax-rates.json';

export type RoadtaxRegion = 'semenanjung' | 'sabahSarawak';
export type RoadtaxBody = 'saloon' | 'nonSaloon';

export interface RoadtaxBand {
  minCc: number;
  maxCc: number;
  base: number;
  perCc: number;
}

export interface RoadtaxResult {
  rate: number;
  band: RoadtaxBand;
}

export function calcRoadtax(region: RoadtaxRegion, body: RoadtaxBody, cc: number): RoadtaxResult {
  if (!Number.isFinite(cc) || cc <= 0) {
    throw new RangeError('Kapasiti enjin mesti lebih daripada 0cc.');
  }

  const bands = rates.rates[region][body] as readonly RoadtaxBand[];
  const band = bands.find(
    (candidate) =>
      cc >= candidate.minCc && (candidate.maxCc === 99999 || cc <= candidate.maxCc),
  );

  if (!band) {
    throw new RangeError(`Tiada band roadtax untuk ${cc}cc.`);
  }

  const rawRate = band.base + band.perCc * (cc - (band.minCc - 1));
  return {
    // Keep the published sen while removing binary floating-point noise.
    rate: Math.round(rawRate * 100) / 100,
    band,
  };
}

// Self-check: every rates.testCases entry should match calcRoadtax exactly.
export { rm } from './ncd';
