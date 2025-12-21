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
	// CJS에서 import.meta 사용을 위한 shim 추가 (Node.js 24+ 호환)
	shims: true,
	// CJS 출력을 .cjs 확장자로 명시 (Node.js 24+ 호환)
	outExtension({ format }) {
		return {
			js: format === "cjs" ? ".cjs" : ".mjs",
		};
	},
}));
