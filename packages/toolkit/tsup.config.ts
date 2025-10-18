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
	external: [
		"class-transformer",
		"class-validator",
		"dayjs",
		"remeda",
		"reflect-metadata",
		"path-parser",
	],
	noExternal: ["tslib"], // tslib을 번들에 포함
}));
