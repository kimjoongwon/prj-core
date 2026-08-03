import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	ssr: {
		noExternal: [/@cocrepo\//],
	},
	resolve: {
		alias: [
			{
				find: fileURLToPath(
					new URL("../common-constant/src/index.ts", import.meta.url),
				),
				replacement: fileURLToPath(
					new URL("../common-constant/dist/index.js", import.meta.url),
				),
			},
			{
				find: /^@cocrepo\/constant$/,
				replacement: fileURLToPath(
					new URL("../common-constant/dist/index.js", import.meta.url),
				),
			},
		],
	},
	test: {
		alias: {
			"@cocrepo/constant": fileURLToPath(
				new URL("../common-constant/dist/index.js", import.meta.url),
			),
		},
		environment: "node",
		server: {
			deps: {
				inline: [/@cocrepo\//],
			},
		},
	},
});
