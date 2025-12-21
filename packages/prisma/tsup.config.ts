import { defineConfig } from "tsup";

export default defineConfig((option) => ({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: !option.watch,
  splitting: !option.watch,
  sourcemap: !!option.watch,
  minify: !option.watch,
  watch: option.watch,
  tsconfig: "./tsconfig.json",
  // CJS에서 import.meta 사용을 위한 shim 추가 (Prisma 7.0+ 호환)
  shims: true,
  // CJS 출력을 .cjs 확장자로 명시 (Node.js 24+ 호환)
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".mjs",
    };
  },
  // @prisma/client를 external로 처리 (re-export만 함)
  external: ["@prisma/client"],
}));
