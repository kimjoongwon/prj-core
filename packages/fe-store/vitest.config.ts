import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type ViteUserConfig } from "vitest/config";

const plugins = [react()] as unknown as ViteUserConfig["plugins"];

export default defineConfig({
	plugins,
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
