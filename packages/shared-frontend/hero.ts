import { heroui } from '@heroui/react';

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
      },
    },
    dark: {
      colors: {
        primary: {
          50: '#172554',
          100: '#1e3a8a',
          200: '#1e40af',
          300: '#1d4ed8',
          400: '#2563eb',
          500: '#3b82f6',
          600: '#60a5fa',
          700: '#93c5fd',
          800: '#bfdbfe',
          900: '#dbeafe',
          950: '#eff6ff',
          DEFAULT: '#60a5fa',
          foreground: '#ffffff',
        },
      },
    },
  },
});