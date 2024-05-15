import { defineConfig } from 'tsup';

export default defineConfig(option => ({
  entry: ['./index.ts'],
  format: ['cjs', 'esm'],
  outDir: './dist',
  clean: true,
  minify: true,
  watch: option.watch,
  env: {
    NODE_ENV: option.watch ? 'development' : 'production',
  },
  dts: true,
}));
