import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { serializeOverviewManifestSourceMaps } from "./.storybook/overviewManifestSources.js";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
const overviewManifestSources = serializeOverviewManifestSourceMaps(
  path.resolve(dirname, "../../.."),
);

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  define: {
    __STORYBOOK_OVERVIEW_MANIFEST_SOURCES__: overviewManifestSources,
  },
  test: {
    projects: [
      {
        extends: true,
        define: {
          __STORYBOOK_OVERVIEW_MANIFEST_SOURCES__: overviewManifestSources,
        },
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
        define: {
          __STORYBOOK_OVERVIEW_MANIFEST_SOURCES__: overviewManifestSources,
        },
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
        resolve: {
          alias: {
            "@cocrepo/frontend": path.resolve(dirname, "../../packages/fe-ui"),
          },
        },
      },
    ],
  },
});
