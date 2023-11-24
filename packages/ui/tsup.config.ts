import { defineConfig } from 'tsup';

export default defineConfig(option => ({
  entry: ['./index.ts'],
  format: ['esm'],
  outDir: './dist',
  clean: false,
  minify: !option.watch,
  watch: option.watch,
  env: {
    NODE_ENV: option.watch ? 'development' : 'production',
  },
  splitting: false,
  treeshake: false,
  external: ['react', 'react-dom'],
  dts: true,
  esbuildOptions(options) {
    options.inject?.push('./inject.js');
  },
  onSuccess: './scripts/post-build.sh',
}));
