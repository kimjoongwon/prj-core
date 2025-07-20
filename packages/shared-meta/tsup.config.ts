import { defineConfig } from 'tsup';

export default defineConfig(option => ({
  entry: ['./index.ts'],
  format: ['cjs'], // Only build CommonJS for legacy support
  outDir: './dist',
  clean: !option.watch,
  watch: option.watch,
  env: {
    NODE_ENV: option.watch ? 'development' : 'production',
  },
  sourcemap: true,
  dts: true,
  external: [
    '@heroui/react',
    '@shared/types',
    '@shared/schema',
  ],
}));