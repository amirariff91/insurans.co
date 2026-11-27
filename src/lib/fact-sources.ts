// Source markers for figures the plan pages repeat outside the fact list ("Manfaat, had dan syarat").
// Each marker points at a source the data already attaches to a fact; nothing here adds a source.
// The number is the URL's position in the page's own source list, exactly as the fact-list marker counts it.

export type SourceMark = { n: number; href: string };
type SourceList = ReadonlyArray<string | { url: string }>;
type SourcedFact = { value: string; source?: string };

const urlOf = (entry: string | { url: string }) => (typeof entry === 'string' ? entry : entry.url);

/** The marker for one fact's source URL, or undefined when the URL is not in the page's list. */
export function sourceMark(list: SourceList, url?: string): SourceMark | undefined {
  if (!url) return undefined;
  const index = list.findIndex((entry) => urlOf(entry) === url);
  return index < 0 ? undefined : { n: index + 1, href: url };
}

function uniqueSorted(marks: Array<SourceMark | undefined>): SourceMark[] {
  const byN = new Map<number, SourceMark>();
  for (const mark of marks) if (mark) byN.set(mark.n, mark);
  return [...byN.values()].sort((a, b) => a.n - b.n);
}

/** Markers for every fact whose full value appears inside a text built from facts (an FAQ answer). */
export function containedMarks(text: string, facts: ReadonlyArray<SourcedFact>, list: SourceList): SourceMark[] {
  return uniqueSorted(
    facts.filter((fact) => fact.value && text.includes(fact.value)).map((fact) => sourceMark(list, fact.source)),
  );
}

// A figure: an RM amount (optionally "juta"), a percentage, or a count of days, months or years.
const FIGURE = /RM\s?\d[\d,]*(?:\.\d+)?(?:\s?juta)?|\d+(?:[.,]\d+)?\s?%|\d+\s?(?:hari|bulan|tahun)\b/giu;
const figuresOf = (text: string) =>
  new Set([...text.matchAll(FIGURE)].map((m) => m[0].replace(/\s+/g, '').replace(/[.,]$/, '').toLowerCase()));

/**
 * Markers for prose that repeats figures: the source of every fact (of `facts`) that states one of the prose's
 * figures. A figure no fact states gets no marker; `unmatched` lists those. `inSibling` is true when one of those
 * unmatched figures is stated by the comparison plan's facts (its sources live on that plan's page).
 */
export function proseMarks(
  text: string | ReadonlyArray<string>,
  facts: ReadonlyArray<SourcedFact>,
  list: SourceList,
  siblingFacts: ReadonlyArray<SourcedFact> = [],
): { marks: SourceMark[]; figures: number; unmatched: string[]; inSibling: boolean } {
  const figures = figuresOf(typeof text === 'string' ? text : text.join(' '));
  const factFigures = facts.map((fact) => ({ fact, figures: figuresOf(fact.value ?? '') }));
  const siblingFigures = new Set(siblingFacts.flatMap((fact) => [...figuresOf(fact.value ?? '')]));
  const marks: Array<SourceMark | undefined> = [];
  const unmatched: string[] = [];
  let inSibling = false;
  for (const figure of figures) {
    const stating = factFigures.filter((entry) => entry.figures.has(figure));
    if (stating.length === 0) {
      if (siblingFigures.has(figure)) inSibling = true;
      else unmatched.push(figure);
    }
    for (const entry of stating) marks.push(sourceMark(list, entry.fact.source));
  }
  return { marks: uniqueSorted(marks), figures: figures.size, unmatched, inSibling };
}
