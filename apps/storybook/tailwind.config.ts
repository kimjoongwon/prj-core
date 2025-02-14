import type { Config } from 'tailwindcss';
const { heroui } = require('@heroui/react');

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared-frontend/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {},
  darkMode: 'class',
  plugins: [heroui()],
} satisfies Config;
