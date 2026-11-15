// FAQ for the plan pages (medical cards, critical illness, home, travel, PA, motorcycle).
// An answer earns its place only when it says something the page has not already printed above it:
// an answer made only of sentences that already appear in the body is dropped, and a page left with
// fewer than two questions shows no FAQ block (and so no FAQPage JSON-LD, which mirrors the list).

export type PlanFaq = { q: string; a: string };

const norm = (text: string) => text.replace(/\s+/g, ' ').trim().replace(/[.;:]+$/, '').toLowerCase();

const sentencesOf = (text: string) =>
  text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/)
    .map(norm)
    .filter(Boolean);

export function freshFaqs(candidates: PlanFaq[], printedAbove: Array<string | null | undefined>): PlanFaq[] {
  const printed = new Set(printedAbove.filter((text): text is string => Boolean(text)).flatMap(sentencesOf));
  const printedJoined = [...printed].join(' ');
  const kept = candidates.filter(({ a }) =>
    sentencesOf(a).some((sentence) => !printed.has(sentence) && !printedJoined.includes(sentence)),
  );
  return kept.length >= 2 ? kept : [];
}
