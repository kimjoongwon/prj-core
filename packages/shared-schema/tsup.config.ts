import { defineConfig } from 'tsup';

export default defineConfig(option => ({
  entry: ['src/index.ts', 'src/client.ts', 'src/types.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: option.watch ? false : true,
  splitting: option.watch ? false : true,
  sourcemap: option.watch ? true : false,
  minify: !option.watch,
  watch: option.watch,
  external: ['@prisma/client'],
}));
