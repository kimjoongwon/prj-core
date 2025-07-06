const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const isDevelopment = nodeEnv === 'development';

export default {
  entry: ['src/index.ts', 'src/client.ts', 'src/types.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: false,
  splitting: false,
  sourcemap: !isProduction,
  minify: isProduction,
  watch: isDevelopment,
  external: ['@prisma/client'],
};
