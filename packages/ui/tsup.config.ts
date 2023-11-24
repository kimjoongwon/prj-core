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
  treeshake: option.watch ? false : true,
  external: ['react', 'react-dom'],
  dts: true,
}));
