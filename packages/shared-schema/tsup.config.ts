const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  entry: ["src/index.ts", "src/client.ts", "src/types.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: !isProduction,
  minify: isProduction,
  watch: isDevelopment,
  external: ["@prisma/client"],
};
