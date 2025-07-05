export default {
  entry: ["src/index.ts", "src/client.ts", "src/types.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: ["@prisma/client"],
};
