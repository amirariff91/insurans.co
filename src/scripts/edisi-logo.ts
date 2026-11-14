// The masthead's NCD state: one updater shared by the home and model NCD control (edisi-ncd.ts) and the NCD
// calculator, so the logo's knob and its "NCD x%" label always show the step the page has chosen.
// SiteHeader.astro's inline script seats the same state before first paint from localStorage ('edisi.ncd').
// 55% is the resting logo (stop 0); each lower step lifts the knob one stop.
const LOGO_STOPS = ['55', '45', '38', '30', '25', '0'];

/** k: the step key ('0', '25', '30', '38', '45' or '55'). chosen: the reader (or the URL) picked it, so label it. */
export function seatLogo(k: string, chosen: boolean): void {
  const i = LOGO_STOPS.indexOf(k);
  document.documentElement.style.setProperty('--ins-stop', String(Math.max(i, 0)));
  const tag = document.querySelector<HTMLElement>('[data-wm-ncd]');
  if (!tag || !chosen || i < 0) return;
  const p = `${k === '38' ? '38.33' : k}%`;
  const v = tag.querySelector('[data-wm-ncd-v]');
  const sr = tag.querySelector('[data-wm-ncd-sr]');
  if (v) v.textContent = p;
  if (sr) sr.textContent = `NCD pilihan anda: ${p}`;
  tag.hidden = false;
}
