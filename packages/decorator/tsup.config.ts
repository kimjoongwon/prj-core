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
	dts: true,
	treeshake: {
		preset: "recommended",
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
		"@cocrepo/constants",
		"@cocrepo/toolkit",
		"libphonenumber-js",
	],
}));
