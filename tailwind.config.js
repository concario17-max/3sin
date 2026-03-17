/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'sand-primary': '#F9F7F2',
        'sand-secondary': '#F0EDE4',
        'sand-tertiary': '#E2DAC8',
        'gold-primary': '#A68B5C',
        'gold-dim': '#D6C7A2',
        'gold-deep': '#8C6D45',
        'charcoal-main': '#1A1A1A',
        'charcoal-muted': '#4A4A4A',
        'gold-bg': '#FDFBF7',
        'gold-surface': '#F5EFE6',
        'gold-border': '#E5E0D8',
        'gold-light': '#C5AE87',
        'gold-muted': '#846F4B',
        'dark-bg': '#0A0A0A',
        'dark-surface': '#141414',
        'dark-border': '#2A2A2A',
        'text-primary': '#182229',
        'text-secondary': '#5B636A',
        'dark-text-primary': '#EDE8DB',
        'dark-text-secondary': '#9E9685',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        crimson: ['Crimson Pro', 'Noto Serif', 'serif'],
        noto: ['Noto Serif', 'serif'],
        korean: ['Pretendard Variable', 'Pretendard', 'system-ui', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
