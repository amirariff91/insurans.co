/**
 * The six NCD steps of a model page, all from car-models.json (premiumByNCD, the same table the
 * NCD 0% and 55% fields come from) and the helpers in lib/ncd. Nothing is computed that main does not
 * already compute: a step's yearly total is that step's premium plus roadtax, rounded with rm(); the
 * saving is within one car (the same base premium), never between two cars.
 */
import { monthly, rm, simulate } from '../../lib/ncd';

export type StepKey = '0' | '25' | '30' | '38' | '45' | '55';

export const STEPS: { k: StepKey; tier: number; years: string; pct: string; pay: number; aria: string; long: string }[] = [
  { k: '0', tier: 0, years: '0', pct: '0%', pay: 100, aria: 'Tahun pertama atau selepas claim, NCD 0%', long: 'tahun pertama atau selepas claim' },
  { k: '25', tier: 25, years: '1', pct: '25%', pay: 75, aria: '1 tahun tanpa claim, NCD 25%', long: '1 tahun tanpa claim' },
  { k: '30', tier: 30, years: '2', pct: '30%', pay: 70, aria: '2 tahun tanpa claim, NCD 30%', long: '2 tahun tanpa claim' },
  { k: '38', tier: 38.33, years: '3', pct: '38.33%', pay: 61.67, aria: '3 tahun tanpa claim, NCD 38.33%', long: '3 tahun tanpa claim' },
  { k: '45', tier: 45, years: '4', pct: '45%', pay: 55, aria: '4 tahun tanpa claim, NCD 45%', long: '4 tahun tanpa claim' },
  { k: '55', tier: 55, years: '5+', pct: '55%', pay: 45, aria: '5 tahun ke atas tanpa claim, NCD 55%', long: '5+ tahun tanpa claim' },
];

export type Values = Record<StepKey, string>;

/** "1,480" from 1480: the digits of rm() without the currency. */
export const num = (n: number) => rm(n).replace(/^RM\s/, '');
/** "330–670", or one value when both ends round the same. */
export const span = (min: number, max: number) => (num(min) === num(max) ? num(min) : `${num(min)}–${num(max)}`);
/**
 * The one range format on car pages: "RM330–670" (RM once, en dash, no spaces), or one value when both ends
 * print the same. `f` is any RM formatter (rm, an exact-sen one); only its "RM" prefix is dropped.
 */
export const rmRange = (min: number, max: number, f: (n: number) => string = rm) => {
  const a = f(min).replace(/^RM\s?/, ''), b = f(max).replace(/^RM\s?/, '');
  return a === b ? `RM${a}` : `RM${a}–${b}`;
};
/**
 * Special-perils (flood) estimate for a model: 0.2% of the lowest to 0.5% of the highest market value, each end
 * rounded to RM10, in the rmRange format. Empty when the model has no structured market value. One implementation
 * for the model page and the site checks (scripts/checks/site-helpers.mjs).
 */
export const specialPerilsRange = (model: any) => {
  if (!(Number.isFinite(model.marketValueMin) && Number.isFinite(model.marketValueMax) && model.marketValueRange)) return '';
  const roundRm10 = (n: number) => Math.round(n / 10) * 10;
  return rmRange(roundRm10(model.marketValueMin * 0.002), roundRm10(model.marketValueMax * 0.005));
};
/** JPJ roadtax can carry sen (RM793.60): exact, as on main. */
export const rtNum = (n: number) => {
  const hasSen = Math.round(n * 100) % 100 !== 0;
  return n.toLocaleString('ms-MY', { minimumFractionDigits: hasSen ? 2 : 0, maximumFractionDigits: 2 });
};

// Gabarito Black, tabular figures: advance widths in em (from the concept's build.py), to fit the big price to its column.
const ADV: Record<string, number> = { d: 0.576, ',': 0.3, '.': 0.291, '–': 0.576 };
const RM_W = (0.585 + 0.853) * 0.5 + 0.06;
export const units = (txt: string) =>
  Math.round((RM_W + [...txt].reduce((s, c) => s + (/\d/.test(c) ? ADV.d : ADV[c] ?? 0.3) - 0.03, 0)) * 1000) / 1000;

export function carSteps(model: any) {
  const by = model.premiumByNCD ?? {};
  const range = (k: StepKey) => {
    if (k === '55') return { min: model.premiumNCD55Min, max: model.premiumNCD55Max };
    if (k === '0') return { min: model.premiumNCD0Min, max: model.premiumNCD0Max };
    const r = by[`ncd${k}`];
    if (Array.isArray(r)) return { min: r[0], max: r[1] };
    return simulate(model.premiumNCD0Min, model.premiumNCD0Max, STEPS.find((s) => s.k === k)!.tier);
  };
  const hasRt = Number.isFinite(model.roadtaxMin) && Number.isFinite(model.roadtaxMax);
  const rtSen = hasRt && [model.roadtaxMin, model.roadtaxMax].some((n: number) => Math.round(n * 100) % 100 !== 0);
  const out = { price: {} as Values, ins: {} as Values, total: {} as Values, saving: {} as Values, monthly: {} as Values,
    pct: {} as Values, pay: {} as Values, long: {} as Values, units: {} as Values, title: {} as Values };
  const titles: Values = {
    '0': 'Tiada diskaun: anda bayar harga penuh', '25': 'Diskaun 25% potong suku harga', '30': 'Diskaun 30% potong hampir sepertiga harga',
    '38': 'Diskaun 38.33% potong lebih sepertiga harga', '45': 'Diskaun 45% potong hampir separuh harga', '55': 'Diskaun 55% potong lebih separuh harga',
  };
  const full = range('0');
  for (const s of STEPS) {
    const r = range(s.k);
    const p = span(r.min, r.max);
    out.price[s.k] = p;
    out.units[s.k] = String(units(p));
    out.ins[s.k] = `RM${p}`;
    out.total[s.k] = hasRt ? `RM${span(r.min + model.roadtaxMin, r.max + model.roadtaxMax)}` : '';
    const sMin = full.min - r.min, sMax = full.max - r.max;
    out.saving[s.k] = s.k === '0' ? 'Tiada diskaun pada tahap ini' : `Jimat RM${span(Math.min(sMin, sMax), Math.max(sMin, sMax))} setahun berbanding tanpa NCD`;
    const m = monthly(r.min, r.max);
    out.monthly[s.k] = `≈ RM${span(m.min, m.max)} sebulan`;
    out.pct[s.k] = s.pct;
    out.pay[s.k] = `${s.pay}%`;
    out.long[s.k] = s.long;
    out.title[s.k] = titles[s.k];
  }
  const roadtaxText = hasRt ? (model.roadtaxMin === model.roadtaxMax ? `RM${rtNum(model.roadtaxMin)}` : `RM${rtNum(model.roadtaxMin)}–${rtNum(model.roadtaxMax)}`) : '';
  return { ...out, full, range, hasRt, rtSen, roadtaxText, umin: Math.min(...Object.values(out.units).map(Number)) };
}
