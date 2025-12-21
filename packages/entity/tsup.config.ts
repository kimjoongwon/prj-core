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
	external: [
		"@prisma/client",
		"class-transformer",
		"@cocrepo/types",
	],
}));
