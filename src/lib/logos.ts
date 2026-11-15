// Brand and insurer logos for identification only (src/data/brand-logos.json, company-logos.json; sources and
// licence status are listed on /kredit-foto/#tanda-dagangan). A record without a reusable Commons file is a
// wordmark: LogoTile.astro prints the short name in the site's type in the same box.
import brandLogos from '../data/brand-logos.json';
import companyLogos from '../data/company-logos.json';

export interface LogoRecord {
  name: string;
  kind: 'logo' | 'wordmark';
  path: string | null;
  commonsFile: string | null;
  commonsPage: string | null;
  licence: string;
  retrieved: string;
  brand?: string;
  company?: string;
  match?: string[];
  /** Optical size correction for a logo that looks heavier than the others at the same box (0.5 to 1). */
  scale?: number;
}

export const BRAND_LOGOS = brandLogos.records as LogoRecord[];
export const COMPANY_LOGOS = companyLogos.records as LogoRecord[];

const norm = (s: string) => s.toLowerCase().trim();

/** The logo record for a car brand name ("Mercedes-Benz") or key ("mercedes-benz"). */
export const brandLogo = (brand: string) =>
  BRAND_LOGOS.find((r) => r.brand === norm(brand) || norm(r.name) === norm(brand));

// companies.json slugs that differ from the logo keys.
const SLUG_ALIAS: Record<string, string> = { rhi: 'rhb' };

/** The logo record for an insurer slug (companies.json) or a company name as written in the data files. */
export const companyLogo = (nameOrSlug: string | null | undefined) => {
  if (!nameOrSlug) return undefined;
  const n = norm(nameOrSlug);
  // A government scheme run with an insurer is not the insurer's product.
  if (n.startsWith('kerajaan')) return undefined;
  const key = SLUG_ALIAS[n] ?? n;
  return (
    COMPANY_LOGOS.find((r) => r.company === key) ??
    COMPANY_LOGOS.find((r) => (r.match ?? []).some((m) => new RegExp(m).test(n)))
  );
};
