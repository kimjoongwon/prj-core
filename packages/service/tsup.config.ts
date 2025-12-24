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
	shims: true,
	outExtension({ format }) {
		return {
			js: format === "cjs" ? ".cjs" : ".mjs",
		};
	},
	noExternal: [],
	external: [
		// AWS
		"@aws-sdk/client-s3",
		// NestJS
		"@nestjs/common",
		"@nestjs/config",
		"@nestjs/jwt",
		"@nestjs/swagger",
		"@nestjs/core",
		"@nestjs/websockets",
		"@nestjs/microservices",
		// Database
		"@prisma/client",
		"pg",
		"pg-native",
		"pg-pool",
		"pg-cursor",
		// Utilities
		"bcrypt",
		"class-transformer",
		"ioredis",
		"libphonenumber-js",
		"express",
		// Internal packages
		"@cocrepo/constant",
		"@cocrepo/dto",
		"@cocrepo/entity",
		"@cocrepo/prisma",
		"@cocrepo/decorator",
		"@cocrepo/toolkit",
		"@cocrepo/repository",
		"@cocrepo/type",
		"@cocrepo/vo",
	],
}));
