import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(() => {
	return {
		plugins: [
			react(),
			tanstackRouter({
				routesDirectory: "./src/routes",
				generatedRouteTree: "./src/routeTree.gen.ts",
			}),
			tailwindcss(),
		],
		server: {
			port: 3000,
			host: true,
			hmr: {
				overlay: true,
			},
		},
		build: {
			sourcemap: true,
		},
	};
});
