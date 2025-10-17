import { defineConfig } from "tsup";

export default defineConfig((option) => ({
	entry: ["src/index.ts"], // Build main export and custom types
	format: ["cjs", "esm"],
	dts: true,
	clean: !option.watch,
	splitting: !option.watch,
	sourcemap: !!option.watch,
	minify: !option.watch,
	watch: option.watch,
	// Enable path resolution for tsconfig paths
	tsconfig: "./tsconfig.json",
	external: [
		"@prisma/client",
		"@nestjs/common",
		"@nestjs/swagger",
		"@nestjs/platform-express",
		"class-transformer",
		"class-transformer/storage",
		"class-validator",
		"@nestjs/websockets/socket-module",
		"@nestjs/microservices",
		"@nestjs/microservices/microservices-module",
		"@nestjs/websockets",
		"@nestjs/platform-socket.io",
		"@nestjs/platform-ws",
	],
}));
