import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

const dirname =
	typeof __dirname !== "undefined"
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	test: {
		projects: [
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({ configDir: path.join(dirname, ".storybook") }),
				],
				test: {
					name: "storybook",
					browser: {
						enabled: true,
						headless: true,
						provider: "playwright",
						instances: [{ browser: "chromium" }],
					},
					setupFiles: [".storybook/vitest.setup.js"],
				},
			},
			{
				plugins: [
					react({
						jsxImportSource: "react",
					}),
				],
				test: {
					name: "ui",
					environment: "jsdom",
					globals: true,
					testTimeout: 30000,
					setupFiles: [path.resolve(dirname, "./test-setup.js")],
					include: [
						".storybook/**/*.test.{js,ts}",
						"src/**/*.test.{ts,tsx}",
						"../../packages/fe-ui/src/**/*.test.{ts,tsx}",
					],
				},
			},
		],
	},
});
