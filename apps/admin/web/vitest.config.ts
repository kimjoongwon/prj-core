import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type ViteUserConfig } from "vitest/config";

// Vitest resolves Vite 7 types internally, while this workspace currently
// wires the React SWC plugin against Vite 6. The runtime plugin is compatible,
// so we narrow the local config type here to avoid a cross-version type clash.
const reactPlugins = [react()] as unknown as NonNullable<
	ViteUserConfig["plugins"]
>;

export default defineConfig({
	plugins: reactPlugins,
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: [path.resolve(__dirname, "./src/test/setup.ts")],
	},
	define: {
		global: "globalThis",
	},
});
