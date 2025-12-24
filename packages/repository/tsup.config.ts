import { defineConfig } from "tsup";

export default defineConfig((option) => ({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	dts: true,
	clean: !option.watch,
	splitting: !option.watch,
	sourcemap: !!option.watch,
	minify: false,
	watch: option.watch,
	tsconfig: "./tsconfig.json",
	shims: true,
	outExtension({ format }) {
		return {
			js: format === "cjs" ? ".cjs" : ".mjs",
		};
	},
	external: [
		"@cocrepo/prisma",
		"@cocrepo/entity",
		"@nestjs/common",
		"class-transformer",
	],
}));
