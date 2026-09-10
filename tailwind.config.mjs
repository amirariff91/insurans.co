/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '9999px',
    },
    extend: {
      boxShadow: {
        hard: '8px 8px 0 0 #1c1917',
      },
      colors: {
        hijau: {
          50: '#f0f9f4',
          100: '#daf1e4',
          200: '#b8e3cc',
          300: '#89ceab',
          400: '#57b385',
          500: '#359968',
          600: '#257a52',
          700: '#1e6243',
          800: '#1b4e37',
          900: '#17402e',
          950: '#0b241a',
        },
        emas: {
          50: '#fdf9ef',
          100: '#f9efd3',
          200: '#f2dca5',
          300: '#eac46d',
          400: '#e3ab42',
          500: '#d9922b',
          600: '#c07321',
          700: '#a0551e',
          800: '#83441f',
          900: '#6c391c',
        },
        krim: {
          50: '#FAFAF7',
          100: '#F5F4F0',
          200: '#ECEAE4',
          300: '#DDD9D1',
        },
        verdict: {
          best: {
            bg: '#daf1e4',
            ink: '#1b4e37',
            border: '#1e6243',
          },
          good: {
            bg: '#ECEAE4',
            ink: '#44403c',
            border: '#57534e',
          },
          warn: {
            bg: '#f9efd3',
            ink: '#83441f',
            border: '#83441f',
          },
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'headline-lg': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'headline-mobile': ['2rem', { lineHeight: '1.125', letterSpacing: '-0.02em' }],
        'headline-md': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'headline-sm': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        price: ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        article: '72ch',
      },
    },
  },
  plugins: [],
};
