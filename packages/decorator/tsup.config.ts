import { defineConfig } from "tsup";

export default defineConfig((option) => ({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  outDir: "./dist",
  clean: !option.watch,
  watch: option.watch,
  env: {
    NODE_ENV: option.watch ? "development" : "production",
  },
  sourcemap: !!option.watch,
  dts: false,
  onSuccess: "tsc --emitDeclarationOnly --declaration",
  treeshake: {
    preset: "recommended",
  },
  // CJS에서 import.meta 사용을 위한 shim 추가 (Node.js 24+ 호환)
  shims: true,
  // CJS 출력을 .cjs 확장자로 명시 (Node.js 24+ 호환)
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".mjs",
    };
  },
  // 외부 패키지로 처리 (번들에 포함하지 않음)
  external: [
    "@nestjs/common",
    "@nestjs/swagger",
    "@nestjs/core",
    "@nestjs/microservices",
    "@nestjs/websockets",
    "class-transformer",
    "class-validator",
    "@cocrepo/constant",
    "@cocrepo/toolkit",
    "@cocrepo/prisma",
    "libphonenumber-js",
  ],
}));
