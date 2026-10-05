import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		exclude: ["dist/**"],
		globals: true,
		include: ["src/**/*.{test,spec}.ts", "scripts/**/*.{test,spec}.ts"],
		setupFiles: ["./vitest.setup.ts"],
	},
});
