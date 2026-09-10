export interface PriceRange {
  min: number;
  max: number;
}

export const NCD_TIERS = [
  { value: 0, label: '0%', yearsShort: '0', years: 'Baru / selepas tuntutan', remaining: '100%' },
  { value: 25, label: '25%', yearsShort: '1', years: '1 tahun tanpa tuntutan', remaining: '75%' },
  { value: 30, label: '30%', yearsShort: '2', years: '2 tahun tanpa tuntutan', remaining: '70%' },
  { value: 38.33, label: '38.33%', yearsShort: '3', years: '3 tahun tanpa tuntutan', remaining: '61.67%' },
  { value: 45, label: '45%', yearsShort: '4', years: '4 tahun tanpa tuntutan', remaining: '55%' },
  { value: 55, label: '55%', yearsShort: '5+', years: '5+ tahun tanpa tuntutan', remaining: '45%' },
] as const;

export type NcdTier = (typeof NCD_TIERS)[number]['value'];

export function isNcdTier(value: number): value is NcdTier {
  return NCD_TIERS.some((tier) => tier.value === value);
}

export function simulate(base0Min: number, base0Max: number, tier: number): PriceRange {
  const remainingFraction = 1 - tier / 100;

  return {
    min: base0Min * remainingFraction,
    max: base0Max * remainingFraction,
  };
}

export function monthly(min: number, max: number): PriceRange {
  return {
    min: Math.round(min / 12),
    max: Math.round(max / 12),
  };
}

export function basePremiumFromCurrent(currentPremium: number, tier: number): number {
  return currentPremium / (1 - tier / 100);
}

export function rm(n: number): string {
  return `RM\u00a0${Math.round(n).toLocaleString('ms-MY')}`;
}
