/** @type {import('tailwindcss').Config} */

/*
 * Edisi, magenta world (light). Source: docs/eeat-revamp-2026-11/round4/concepts/edisi/tokens.css
 * and system.md in the E-E-A-T worktree.
 *
 * The token NAMES are the old Kira Hijau ones (hijau, emas, krim, stone, verdict) so the
 * templates keep working unchanged; their VALUES now follow Edisi's colour roles:
 *   - white paper, black ink; links are ink and underlined;
 *   - magenta #D0106F only for the main button, borders that mark the chosen or focused state,
 *     the logo knob and the chosen bar. Text on magenta is white; magenta is never text on a tint;
 *   - pastel pink = price working and calculators (hijau-50/100), yellow = totals and flags
 *     (emas-50/100), blue = explanation (edisi.sky, used by .info-box).
 * hijau-600..950 and emas-600..900 are TEXT shades (ink and ink-2), because they sit on the tints.
 * New work should use the semantic `edisi.*` names below.
 */
const edisi = {
  paper: '#FFFFFF',
  card: '#FFFFFF',
  tray: '#F3F3F3',
  chip: '#E9E9E9',
  ink: '#000000',
  'ink-2': '#4A4A4A',
  rule: '#767676',
  magenta: '#D0106F',
  'magenta-deep': '#A50C58',
  pink: '#FBD3E4',
  yellow: '#FFF3B0',
  sky: '#CFE8FA',
  red: '#B8291E',
};

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    borderRadius: {
      none: '0',
      sm: '4px',
      DEFAULT: '6px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '20px',
      full: '9999px',
    },
    extend: {
      boxShadow: {
        // Was an 8px hard offset block. Edisi has no block shadow: a lifted pane instead.
        hard: '0 12px 28px -14px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(0 0 0 / 0.16)',
      },
      colors: {
        edisi,
        stone: {
          50: '#F6F6F6',
          100: '#EDEDED',
          200: '#DADADA',
          300: '#949494',
          400: '#6B6B6B',
          500: '#595959',
          600: '#4A4A4A',
          700: '#2B2B2B',
          800: '#1A1A1A',
          900: '#000000',
          950: '#000000',
        },
        hijau: {
          50: '#FDEDF4',
          100: '#FBD3E4',
          200: '#767676',
          300: '#767676',
          400: '#E0559B',
          500: '#D0106F',
          600: '#4A4A4A',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        },
        emas: {
          50: '#FFF3B0',
          100: '#FFEB85',
          200: '#FFE066',
          300: '#F2CC3A',
          400: '#C9A300',
          500: '#8F7400',
          600: '#4A4A4A',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        krim: {
          50: '#FFFFFF',
          100: '#F3F3F3',
          200: '#E9E9E9',
          300: '#DADADA',
        },
        verdict: {
          best: {
            bg: '#FBD3E4',
            ink: '#000000',
            border: '#D0106F',
          },
          good: {
            bg: '#E9E9E9',
            ink: '#000000',
            border: '#767676',
          },
          warn: {
            bg: '#FFF3B0',
            ink: '#000000',
            border: '#000000',
          },
        },
      },
      fontFamily: {
        // `font-serif` keeps its name for the templates; it is now the display face, Gabarito.
        serif: ['Gabarito', '"Gabarito Fallback"', '"Gabarito Fallback Android"', 'system-ui', 'sans-serif'],
        display: ['Gabarito', '"Gabarito Fallback"', '"Gabarito Fallback Android"', 'system-ui', 'sans-serif'],
        sans: ['Figtree', '"Figtree Fallback"', '"Figtree Fallback Android"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Type floor: nothing under 14px (critique 12). text-xs and text-sm both render at 0.875rem.
        xs: ['0.875rem', { lineHeight: '1.25rem' }],
        'headline-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'headline-lg': ['2.5rem', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        'headline-mobile': ['2rem', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        'headline-md': ['1.75rem', { lineHeight: '1.12', letterSpacing: '-0.005em' }],
        'headline-sm': ['1.375rem', { lineHeight: '1.2', letterSpacing: '0' }],
        price: ['2rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        article: '72ch',
      },
    },
  },
  plugins: [],
};
