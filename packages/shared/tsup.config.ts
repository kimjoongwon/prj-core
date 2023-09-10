import { defineConfig } from 'tsup';

export default defineConfig((option) => ({
  entry: ['./index.ts'],
  format: ['esm', 'cjs'],
  outDir: './dist',
  // splitting: true,
  // sourcemap: true,
  clean: true,
  minify: !option.watch,
  // ignoreWatch: [
  //   './node_modules/**/*',
  //   './.git/**/*',
  //   './.turbo/**/*',
  //   './tsup.config.ts',
  //   './dist/**/*',
  //   './src/**/*',
  // ],
  env: {
    NODE_ENV: option.watch ? 'development' : 'production',
  },
  dts: true,
}));
