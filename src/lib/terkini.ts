/**
 * Terkini: dated changes that affect what a reader pays or is covered for.
 * Every item names an official source and links to the evergreen page it changed.
 * The checks below run at build time; a bad item fails the build instead of publishing.
 */
import raw from '../data/terkini.json';

export type TerkiniKind = 'peraturan' | 'harga' | 'produk' | 'pembetulan';

export interface TerkiniItem {
  slug: string;
  date: string;
  title: string;
  summary: string;
  body: string[];
  kind: TerkiniKind;
  sources: { label: string; url: string }[];
  updates: { label: string; href: string }[];
  effectiveDate?: string;
}

export const KIND_LABEL: Record<TerkiniKind, string> = {
  peraturan: 'Peraturan',
  harga: 'Harga',
  produk: 'Produk',
  pembetulan: 'Pembetulan',
};

export const TERKINI_URL = 'https://insurans.co/terkini/';

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
/** A real calendar date: YYYY-MM-DD that survives a round trip through Date (rejects 2026-02-30, 2025-13-01). */
function isRealDate(value: unknown): value is string {
  if (typeof value !== 'string' || !isoDate.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Today in Malaysia (the site's dates are Malaysian dates). */
function todayMY(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function validate(items: TerkiniItem[]): TerkiniItem[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  const today = todayMY();
  for (const [i, item] of items.entries()) {
    const at = `terkini.json[${i}] (${item.slug ?? 'no slug'})`;
    if (!item.slug || !slugRe.test(item.slug)) errors.push(`${at}: slug missing or not kebab-case`);
    if (seen.has(item.slug)) errors.push(`${at}: duplicate slug`);
    seen.add(item.slug);
    if (!isRealDate(item.date)) errors.push(`${at}: date "${item.date}" must be a real calendar date, YYYY-MM-DD`);
    else if (item.date > today) errors.push(`${at}: date ${item.date} is in the future (today ${today}, Malaysia)`);
    if (item.effectiveDate !== undefined && !isRealDate(item.effectiveDate)) errors.push(`${at}: effectiveDate "${item.effectiveDate}" must be a real calendar date, YYYY-MM-DD`);
    if (!(item.kind in KIND_LABEL)) errors.push(`${at}: unknown kind "${item.kind}"`);
    if (!item.title || item.title.length >= 70) errors.push(`${at}: title missing or 70+ characters`);
    if (!item.summary) errors.push(`${at}: summary missing`);
    if (!Array.isArray(item.body) || item.body.length === 0) errors.push(`${at}: body missing`);
    const sources = (item.sources ?? []).filter((s) => s.label && /^https:\/\//.test(s.url ?? ''));
    if (sources.length === 0 || sources.length !== (item.sources ?? []).length) errors.push(`${at}: needs at least one source, each with a label and an https URL`);
    const updates = (item.updates ?? []).filter((u) => u.label && /^\/(?!\/)/.test(u.href ?? ''));
    if (updates.length === 0 || updates.length !== (item.updates ?? []).length) errors.push(`${at}: needs at least one internal "updates" link, each starting with /`);
  }
  if (errors.length) throw new Error(`Terkini data is invalid:\n- ${errors.join('\n- ')}`);
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** All items, newest first. */
export const terkini: TerkiniItem[] = validate(raw as TerkiniItem[]);

export function formatTarikh(value: string): string {
  return new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

/** Body text allows one inline form only: [label](/internal-path or https URL). */
export function bodySegments(text: string): ({ text: string } | { text: string; href: string })[] {
  const out: ({ text: string } | { text: string; href: string })[] = [];
  const re = /\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[1], href: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/**
 * Entries whose own text (mainWordCount below) is under this many words are
 * noindex, follow: too short to stand alone in search (AdSense "low-value content" review, November 2026).
 * The /terkini/ index stays indexed and lists and links every entry with its date. The sitemap filter in
 * astro.config.mjs drops these pages by reading their built robots meta.
 */
export const TERKINI_INDEX_MIN_WORDS = 300;

/**
 * Words in the entry's own text: the summary plus every body paragraph, with each link counted by its label text
 * (the URL is not counted). The title, `sources` and `updates` are not counted. Words are runs of
 * non-whitespace, so "RM20" or "1,000cc" count as one word.
 */
export function mainWordCount(item: TerkiniItem): number {
  const text = [item.summary, ...item.body.map((para) => bodySegments(para).map((seg) => seg.text).join(''))].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}
