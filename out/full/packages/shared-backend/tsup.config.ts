import { defineConfig } from 'tsup';

export default defineConfig(option => ({
  entry: ['./index.ts'],
  format: ['cjs', 'esm'],
  outDir: './dist',
  clean: !option.watch,
  minify: !option.watch,
  watch: option.watch,
  env: {
    NODE_ENV: option.watch ? 'development' : 'production',
  },
  dts: true,
}));
