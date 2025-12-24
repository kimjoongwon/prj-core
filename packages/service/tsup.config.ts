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
	shims: true,
	outExtension({ format }) {
		return {
			js: format === "cjs" ? ".cjs" : ".mjs",
		};
	},
	external: [
		"@aws-sdk/client-s3",
		"@nestjs/common",
		"@nestjs/config",
		"@nestjs/jwt",
		"@nestjs/swagger",
		"@nestjs/core",
		"@nestjs/websockets",
		"@nestjs/microservices",
		"bcrypt",
		"class-transformer",
		"ioredis",
		"express",
		"@cocrepo/constant",
		"@cocrepo/dto",
		"@cocrepo/entity",
		"@cocrepo/prisma",
		"@cocrepo/decorator",
		"@cocrepo/toolkit",
		"@cocrepo/repository",
		"@cocrepo/type",
	],
}));
