const baseTitleSuffix = ' | Insurans.co';

function truncateAtWordBoundary(text: string, max: number): string {
  const value = text.trim();
  if (max <= 0) return '';
  if (value.length <= max) return value;
  if (max === 1) return '…';

  const candidate = value.slice(0, max - 1).trimEnd();
  const boundary = Math.max(candidate.lastIndexOf(' '), candidate.lastIndexOf('\n'), candidate.lastIndexOf('\t'));
  if (boundary < 0) return '…';
  const prefix = candidate.slice(0, boundary).trimEnd();
  return `${prefix}…`;
}

export function buildTitle(
  primary: string,
  opts: { suffix?: string; max?: number } = {},
): string {
  const suffix = opts.suffix ?? baseTitleSuffix;
  const max = opts.max ?? 60;
  return truncateAtWordBoundary(primary, max - suffix.length);
}

export function buildDescription(text: string, max = 155): string {
  return truncateAtWordBoundary(text, max);
}
