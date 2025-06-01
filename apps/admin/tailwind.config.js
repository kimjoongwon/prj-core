const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    // Or if using `src` directory:
    '../../node_modules/@heroui/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@shared/frontend/dist/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared-frontend/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: ['@shared/frontend'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard'],
      },
    },
  },
  darkMode: 'dark',
  plugins: [heroui()],
};
