import { defineConfig } from "tsup";

export default defineConfig((option) => ({
  entry: ["./index.ts"],
  format: ["esm", "cjs"],
  outDir: "./dist",
  clean: !option.watch,
  watch: option.watch,
  env: {
    NODE_ENV: option.watch ? "development" : "production",
  },
  sourcemap: true,
  dts: true,
  esbuildOptions(options) {
    options.supported = {
      ...options.supported,
      decorators: false,
    };
  },
}));
