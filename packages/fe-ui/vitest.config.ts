import * as path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type ViteUserConfig } from "vitest/config";

const plugins = [react()] as unknown as ViteUserConfig["plugins"];

export default defineConfig({
	plugins,
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: [path.resolve(__dirname, "./src/test/setup.ts")],
	},
	define: {
		global: "globalThis",
	},
});
