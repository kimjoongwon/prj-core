import { defineConfig } from 'tsup';

export default defineConfig(option => ({
  entry: ['./index.ts'],
  format: ['esm', 'cjs'],
  outDir: './dist',
  clean: true,
  minify: !option.watch,
  env: {
    NODE_ENV: option.watch ? 'development' : 'production',
  },
  external: ['react', 'react-dom'],
  dts: true,
  banner: {},
}));
