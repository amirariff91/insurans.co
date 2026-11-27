/**
 * Multi-value table cells ("RM1,000,000 / 1,650,000 / 2,000,000 (bergantung plan)") made scannable without
 * changing meaning. A cell is summarised as "min–max, n pilihan" only when every `;`-separated part is a plain
 * slash list of amounts followed by an optional unit/qualifier and an optional (note), or a range already
 * written with a hyphen (shown as written). The amounts are the cell's own strings (no rounding); the full list
 * is kept for a disclosure in the same cell. Anything else that still holds a " / " run is returned as a stacked
 * list of its parts, verbatim. Single values pass through.
 */
export type RangeLine = { min: string; max: string; count: number; tail: string; note: string; values: string[] };
export type MultiValue =
  | { kind: 'single'; text: string }
  | { kind: 'range'; lines: (RangeLine | { verbatim: string })[] }
  | { kind: 'list'; items: string[] };

/** Split on `sep` only outside parentheses. */
function splitTop(text: string, sep: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of text) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === sep && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const AMOUNT = String.raw`(?:RM)?\d[\d,]*`;
const SLASH_LIST = new RegExp(`^(${AMOUNT}(?:\\s*/\\s*${AMOUNT})+)(?:\\s+([^()]*?))?\\s*(?:\\(([^()]*)\\))?$`);
const HYPHEN_RANGE = new RegExp(`^${AMOUNT}-\\d[\\d,]*\\b`);
const num = (v: string) => Number(v.replace(/[^\d]/g, ''));

export function multiValue(text: string): MultiValue {
  const parts = splitTop(text, ';');
  const lines: (RangeLine | { verbatim: string })[] = [];
  let ok = true;
  let anyList = false;
  for (const part of parts) {
    const m = part.match(SLASH_LIST);
    if (m) {
      // Every amount in a list that starts with "RM" is in ringgit: "RM1,000,000 / 1,650,000" means RM1,650,000.
      const values = m[1].split('/').map((v) => v.trim()).map((v) => (v.startsWith('RM') ? v : `RM${v}`));
      const sorted = [...values].sort((a, b) => num(a) - num(b));
      lines.push({ min: sorted[0], max: sorted[sorted.length - 1], count: values.length, tail: (m[2] ?? '').trim(), note: (m[3] ?? '').trim(), values });
      anyList = true;
    } else if (HYPHEN_RANGE.test(part)) {
      lines.push({ verbatim: part });
    } else {
      ok = false;
    }
  }
  if (ok && anyList && text.trim().startsWith('RM')) return { kind: 'range', lines };
  if (parts.length > 1) return { kind: 'list', items: parts };
  if (/\s\/\s/.test(text)) return { kind: 'list', items: text.split(/\s\/\s/).map((s) => s.trim()) };
  return { kind: 'single', text };
}
