import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pop: {
          50: '#fef3f2',
          100: '#fde4df',
          200: '#fbc9bf',
          300: '#f8a99a',
          400: '#f47d6e',
          500: '#f0554a',
          600: '#e83a30',
          700: '#d42522',
          800: '#b11d1c',
          900: '#8e1819',
          950: '#520d0e',
        },
        neon: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '13px' }],
        'sm': ['12px', { lineHeight: '16px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'lg': ['16px', { lineHeight: '24px' }],
        'xl': ['18px', { lineHeight: '28px' }],
        '2xl': ['20px', { lineHeight: '28px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
        '4xl': ['30px', { lineHeight: '36px' }],
        '5xl': ['36px', { lineHeight: '44px' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'pop': '0 4px 24px -4px rgba(240, 85, 74, 0.3)',
        'neon': '0 4px 24px -4px rgba(139, 92, 246, 0.3)',
        'soft': '0 2px 12px -2px rgba(0, 0, 0, 0.08)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'elevated': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
