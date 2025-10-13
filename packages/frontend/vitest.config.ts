import * as path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: [path.resolve(__dirname, "./src/test/setup.ts")],
	},
	define: {
		global: "globalThis",
	},
});
