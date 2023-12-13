import { defineConfig } from 'tsup';

export default defineConfig(option => ({
  entry: ['./index.ts'],
  format: ['esm'],
  outDir: './dist',
  clean: option.watch ? false : true,
  minify: !option.watch,
  watch: option.watch,
  env: {
    NODE_ENV: option.watch ? 'development' : 'production',
  },
  external: ['react', 'react-dom'],
  dts: true,
  esbuildOptions(options, context) {
    options.inject?.push('./inject.js');
  },
}));
