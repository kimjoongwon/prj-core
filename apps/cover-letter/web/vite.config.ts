import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/cover-letter/",
	plugins: [react()],
	build: {
		outDir: "dist",
	},
});
