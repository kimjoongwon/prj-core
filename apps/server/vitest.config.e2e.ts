import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    alias: {
      '@guards': 'src/common/guards/index.ts',
      '@filters': 'src/common/filters/index.ts',
      '@providers': 'src/common/providers/index.ts',
      '@decorators': 'src/common/decorators/index.ts',
      '@interceptors': 'src/common/interceptors/index.ts',
      '@configs': 'src/configs/index.ts',
      '@modules': 'src/modules/index.ts',
      '@common': 'src/common/index.ts',
    },
    root: './',
  },
  resolve: {
    alias: {
      '@guards': 'src/common/guards/index.ts',
      '@filters': 'src/common/filters/index.ts',
      '@providers': 'src/common/providers/index.ts',
      '@decorators': 'src/common/decorators/index.ts',
      '@interceptors': 'src/common/interceptors/index.ts',
      '@configs': 'src/configs/index.ts',
      '@modules': 'src/modules/index.ts',
      '@common': 'src/common/index.ts',
    },
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
});
