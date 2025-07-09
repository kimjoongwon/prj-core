import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry points
  entry: ['src/index.ts', 'src/types.ts'],

  // Output formats
  format: ['cjs', 'esm'],

  // TypeScript declarations
  dts: true,

  // Code splitting for better tree-shaking
  splitting: true,

  // Source maps for debugging
  sourcemap: true,

  // Clean dist folder before build
  clean: true,

  // Minification for production builds
  minify: process.env.NODE_ENV === 'production',

  // Tree shaking
  treeshake: true,

  // Bundle configuration
  bundle: true,

  // External dependencies (peer dependencies)
  external: ['react', 'react-dom', '@tanstack/react-query', 'axios'],

  // Target environment
  target: 'es2022',

  // Output directory
  outDir: 'dist',
});
