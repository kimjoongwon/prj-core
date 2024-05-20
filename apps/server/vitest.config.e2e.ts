import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
    },
    root: './',
  },
  resolve: {
    alias: {
      '@shared': './src/shared/index',
    },
  },
  plugins: [swc.vite(), tsconfigPaths()],
});
