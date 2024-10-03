import { THEME_CONFIG } from './config/themeConfig';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    themes: [...THEME_CONFIG.themes, { procyon: THEME_CONFIG.customTheme }],
  },
};
