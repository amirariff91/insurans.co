/**
 * Reader-facing dates on product pages: "10 Okt 2026", the same format as Byline.astro.
 * The ISO value stays in datetime attributes and JSON-LD; only the visible text changes.
 */
export function tarikh(value: string | undefined | null): string {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}

/** Role for a fact in the page answer: premiums and contributions are prices, every other figure is a term. */
export function factRole(label: string): 'price' | 'term' {
  return /premium|sumbangan|harga/i.test(label) ? 'price' : 'term';
}

/**
 * A source link to a Wayback Machine copy (web.archive.org/web/<YYYYMMDDhhmmss>/<original>): the original site and
 * the capture date, so the page can say it is an archived copy and of when. Null for any other link.
 */
export function archivedCopy(url: string): { site: string; captured: string } | null {
  const match = /^https:\/\/web\.archive\.org\/web\/(\d{4})(\d{2})(\d{2})\d*\/(https?:\/\/.+)$/.exec(url);
  if (!match) return null;
  const [, year, month, day, original] = match;
  return { site: new URL(original).hostname.replace(/^www\./, ''), captured: tarikh(`${year}-${month}-${day}`) };
}
