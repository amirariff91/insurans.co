// Brand and insurer logos for identification only (src/data/brand-logos.json, company-logos.json; sources and
// licence status are listed on /kredit-foto/#tanda-dagangan). Each file comes from Wikimedia Commons or from the
// company's own Malaysian website (source, sourceUrl). A record without a file is a wordmark: LogoTile.astro shows it
// only where the tile is the only label (opt-in `wordmark`).
import brandLogos from '../data/brand-logos.json';
import companyLogos from '../data/company-logos.json';

export interface LogoRecord {
  name: string;
  kind: 'logo' | 'wordmark';
  path: string | null;
  commonsFile: string | null;
  commonsPage: string | null;
  licence: string;
  retrieved: string | null;
  source?: 'Wikimedia Commons' | 'official site';
  /** The exact file that was downloaded (Commons file page or the official site's own URL). */
  sourceUrl?: string | null;
  brand?: string;
  company?: string;
  match?: string[];
  /** Optical size correction for a logo that looks heavier than the others at the same box (0.5 to 1). */
  scale?: number;
  /** A very wide logo (about 5:1 or wider): LogoTile trims the side padding so its type stays readable. */
  wide?: boolean;
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
