const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Or if using `src` directory:
    // '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    // './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    // './node_modules/@shared/frontend/dist/**/*.{js,ts,jsx,tsx}',
    // '../../packages/shared-frontend/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // presets: ['@shared/frontend'],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       pretendard: ['var(--font-pretendard)'],
  //     },
  //   },
  // },
  darkMode: 'light',
  plugins: [nextui()],
};
