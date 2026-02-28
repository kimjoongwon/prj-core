import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			// @cocrepo/toolkit package.json points to dist/*, but workspace uses root build artifacts.
			"@cocrepo/toolkit": path.resolve(__dirname, "../common-toolkit/index.js"),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: [],
	},
});
