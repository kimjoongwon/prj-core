import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    api: {
      host: 'localhost',
      port: 3004,
    },
    environment: 'jsdom',
  },
});
