// Edisi NCD control: progressive enhancement only. Prices already switch through CSS :has() on the
// checked radio; this remembers the reader's step, plays a short tick on the changed figures,
// keeps every calculator link on the same step and announces the new price.
const KEY = 'edisi.ncd';
const root = document.querySelector<HTMLElement>('[data-ea]');
const radios = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="ncd"]'));

const valueOf = (el: Element | null, k: string): string => {
  if (!el) return '';
  if (k === '55') return el.querySelector('.pv')?.textContent ?? '';
  return (el as HTMLElement).dataset[`p${k}`] ?? '';
};

// The masthead's knob follows the step: 55% is the resting logo (stop 0); each lower step lifts it one stop.
const LOGO_STOPS = ['55', '45', '38', '30', '25', '0'];
const seatLogo = (k: string, chosen: boolean) => {
  const i = LOGO_STOPS.indexOf(k);
  document.documentElement.style.setProperty('--ins-stop', String(Math.max(i, 0)));
  const tag = document.querySelector<HTMLElement>('[data-wm-ncd]');
  if (!tag || !chosen || i < 0) return;
  const p = `${k === '38' ? '38.33' : k}%`;
  tag.querySelector('[data-wm-ncd-v]')!.textContent = p;
  tag.querySelector('[data-wm-ncd-sr]')!.textContent = `NCD pilihan anda: ${p}`;
  tag.hidden = false;
};

const apply = (r: HTMLInputElement, announce: boolean, chosen = announce) => {
  const k = r.value;
  seatLogo(k, chosen);
  document.querySelectorAll<HTMLAnchorElement>('[data-calculator-link]').forEach((link) => {
    const url = new URL(link.href, location.href);
    url.searchParams.set('ncd', r.dataset.tier ?? k);
    link.setAttribute('href', url.pathname + url.search);
  });
  if (!announce || !root) return;
  root.querySelectorAll<HTMLElement>('[data-tick]').forEach((el) => {
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
  });
  const live = root.querySelector('[data-ncd-announcement]');
  const price = valueOf(root.querySelector('.ea-pnum'), k);
  const total = valueOf(root.querySelector('.ea-sum-t'), k);
  if (live) live.textContent = `NCD ${r.dataset.tier}%: insurans RM${price} setahun${total ? `, dengan roadtax ${total}` : ''}.`;
};

// Without :has() the bars are hidden and a static list of all six steps shows instead: nothing to enhance.
const hasSupport = typeof CSS !== 'undefined' && CSS.supports?.('selector(:has(*))');

if (hasSupport && root && radios.length) {
  let saved: string | null = null;
  try { saved = localStorage.getItem(KEY); } catch { /* storage blocked */ }
  const pre = radios.find((r) => r.checked && !r.defaultChecked) ?? radios.find((r) => r.value === saved);
  if (pre) pre.checked = true;
  // The HTML links carry no ?ncd= (so they are never wrong without JavaScript); add the current step.
  const cur = pre ?? radios.find((r) => r.checked);
  if (cur) apply(cur, false, Boolean(pre));
  radios.forEach((r) => r.addEventListener('change', () => {
    try { localStorage.setItem(KEY, r.value); } catch { /* storage blocked */ }
    apply(r, true);
  }));
}
