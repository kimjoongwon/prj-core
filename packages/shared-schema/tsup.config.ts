import { defineConfig } from "tsup";

export default defineConfig((option) => ({
  entry: ["src/index.ts", "src/client.ts", "src/types.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: !option.watch,
  splitting: !option.watch,
  sourcemap: !!option.watch,
  minify: !option.watch,
  watch: option.watch,
  external: ["@prisma/client"],
}));
