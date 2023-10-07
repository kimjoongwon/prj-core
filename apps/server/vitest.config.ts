import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
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
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
