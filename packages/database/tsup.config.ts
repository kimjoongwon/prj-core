import { defineConfig } from 'tsup';

export default defineConfig(option => ({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: './dist',
  clean: true,
  minify: !option.watch,
  watch: option.watch,
  env: {
    NODE_ENV: option.watch ? 'development' : 'production',
  },
  dts: true,
}));
