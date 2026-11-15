/** @type {import('tailwindcss').Config} */

/*
 * Edisi on fixed tokens (15 Nov 2026). DESIGN.md "Tokens" is the reference.
 *
 * Five colours, one spacing scale, one type scale. Everything a template can ask for resolves to
 * one of them: the old class names (hijau, emas, krim, stone, verdict, edisi.*) are kept as
 * ALIASES so the templates keep working, but no alias has a value of its own.
 * `scripts/design/snap-tokens.py --check` fails if a stylesheet drifts off the scales.
 */
const paper = '#FFFFFF'; // page and every surface
const ink = '#000000'; // text, title bars, strong rules, focus
const mute = '#595959'; // secondary text, borders of controls (7:1 on paper)
const line = '#DADADA'; // hairline dividers and unchosen fills (decoration only, never text)
const magenta = '#D0106F'; // the one action and the chosen state; text on it is paper

const ramp = (map) => Object.fromEntries(Object.entries(map).flatMap(([v, ks]) => ks.map((k) => [k, v])));

// Spacing: 2 (optical nudge) 4 8 12 16 24 32 48 64 96. Tailwind's step names are kept and snapped.
const px = (n) => (n === 0 ? '0px' : n <= 2 ? `${n}px` : `${n / 16}rem`);
const SPACE = [0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96];
const snap = (v) => SPACE.reduce((a, b) => (Math.abs(b - v) <= Math.abs(a - v) ? b : a));
const steps = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32];
const space = { px: '1px', ...Object.fromEntries(steps.map((k) => [k, px(snap(k * 4))])) };

// Type: 14 16 18 22 28 36. The fitted price in the answer block is the only fluid size.
const t = (size, lh, ls = '0') => [`${size / 16}rem`, { lineHeight: lh, letterSpacing: ls }];

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      white: paper,
      black: ink,
      paper, ink, mute, line, magenta,
      edisi: { paper, card: paper, tray: paper, chip: line, ink, 'ink-2': mute, rule: mute, magenta, 'magenta-deep': ink, pink: paper, yellow: paper, sky: paper, red: ink },
      stone: ramp({ [paper]: [50], [line]: [100, 200], [mute]: [300, 400, 500, 600], [ink]: [700, 800, 900, 950] }),
      hijau: ramp({ [paper]: [50, 100], [mute]: [200, 300, 600], [magenta]: [400, 500], [ink]: [700, 800, 900, 950] }),
      emas: ramp({ [paper]: [50, 100], [line]: [200, 300], [mute]: [400, 500, 600], [ink]: [700, 800, 900] }),
      krim: ramp({ [paper]: [50, 100], [line]: [200, 300] }),
      red: ramp({ [paper]: [50], [line]: [200], [ink]: [700] }),
      verdict: {
        best: { bg: paper, ink, border: magenta },
        good: { bg: paper, ink, border: mute },
        warn: { bg: paper, ink, border: ink },
      },
    },
    borderRadius: { none: '0', sm: '4px', DEFAULT: '8px', md: '8px', lg: '8px', xl: '8px', '2xl': '8px', '3xl': '8px', full: '9999px' },
    boxShadow: { none: 'none', sm: 'none', DEFAULT: 'none', md: 'none', lg: 'none', xl: 'none', hard: `0 0 0 1px ${mute}` },
    fontFamily: {
      // `font-serif` keeps its name for the templates; it is the display face, Gabarito.
      serif: ['Gabarito', '"Gabarito Fallback"', '"Gabarito Fallback Android"', 'system-ui', 'sans-serif'],
      display: ['Gabarito', '"Gabarito Fallback"', '"Gabarito Fallback Android"', 'system-ui', 'sans-serif'],
      sans: ['Figtree', '"Figtree Fallback"', '"Figtree Fallback Android"', 'system-ui', '-apple-system', 'sans-serif'],
    },
    fontWeight: { normal: '400', medium: '600', semibold: '600', bold: '600', extrabold: '800', black: '800' },
    fontSize: {
      xs: t(14, '1.25rem'),
      sm: t(14, '1.25rem'),
      base: t(16, '1.5rem'),
      lg: t(18, '1.625rem'),
      xl: t(22, '1.2'),
      '2xl': t(22, '1.2'),
      '3xl': t(28, '1.1', '-0.01em'),
      '4xl': t(36, '1.05', '-0.015em'),
      '5xl': t(36, '1.05', '-0.015em'),
      '6xl': t(36, '1.05', '-0.015em'),
      'headline-sm': t(22, '1.2'),
      'headline-md': t(22, '1.2'),
      'headline-mobile': t(28, '1.1', '-0.01em'),
      'headline-lg': t(36, '1.05', '-0.015em'),
      'headline-xl': t(36, '1.05', '-0.015em'),
      price: t(28, '1.1', '-0.01em'),
    },
    // Width, height and inset keep Tailwind's own steps (icons, columns); only the gaps between things snap.
    padding: space,
    margin: { auto: 'auto', ...space },
    gap: space,
    space,
    extend: {
      maxWidth: { article: '72ch' },
    },
  },
  plugins: [],
};
