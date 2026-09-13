import home from '../data/home-insurance.json';

const tariff = home.tariff;

export type PropertyType = 'landed' | 'flat';
export type ConstructionClass = '1A' | '1B';

export interface FireInput {
  propertyType: PropertyType;
  constructionClass: ConstructionClass;
  buildingSumInsured: number;
  contentsSumInsured: number;
}

export interface FireResult {
  houseownerRate: number;
  householderRate: number;
  houseownerPremium: number;
  householderPremium: number;
  grossPremium: number;
  minApplied: boolean;
  netPremium: number;
  stamp: number;
  total: number;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function houseownerRate(propertyType: PropertyType, constructionClass: ConstructionClass): number {
  if (constructionClass === '1A') {
    return propertyType === 'landed' ? tariff.ho_landed_1A : tariff.ho_flat_1A;
  }
  return propertyType === 'landed' ? tariff.ho_landed_1B : tariff.ho_flat_1B;
}

function householderRate(constructionClass: ConstructionClass): number {
  return constructionClass === '1A' ? tariff.hh_1A : tariff.hh_1B;
}

export function calcFirePremium(input: FireInput): FireResult {
  const buildingSI = Number(input.buildingSumInsured) || 0;
  const contentsSI = Number(input.contentsSumInsured) || 0;

  if (buildingSI < 0 || contentsSI < 0) {
    throw new RangeError('Jumlah diinsuranskan tidak boleh negatif.');
  }
  if (buildingSI === 0 && contentsSI === 0) {
    throw new RangeError('Masukkan sekurang-kurangnya satu jumlah diinsuranskan (bangunan atau isi rumah).');
  }

  const hoRate = houseownerRate(input.propertyType, input.constructionClass);
  const hhRate = householderRate(input.constructionClass);

  const houseownerPremium = round2((buildingSI * hoRate) / 100);
  const householderPremium = round2((contentsSI * hhRate) / 100);
  const grossPremium = round2(houseownerPremium + householderPremium);
  const minApplied = grossPremium < tariff.minPremium;
  const netPremium = minApplied ? tariff.minPremium : grossPremium;
  const stamp = tariff.stamp;
  const total = round2(netPremium + stamp);

  return {
    houseownerRate: hoRate,
    householderRate: hhRate,
    houseownerPremium,
    householderPremium,
    grossPremium,
    minApplied,
    netPremium,
    stamp,
    total,
  };
}
