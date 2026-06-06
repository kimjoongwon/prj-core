import { dirname, join } from "node:path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const chromaticAddonDisabled = process.env.STORYBOOK_DISABLE_CHROMATIC === "true";
const vitestAddonDisabled = process.env.STORYBOOK_DISABLE_VITEST_ADDON === "true";

const config = {
  stories: [
    "../../../../packages/fe-ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    ...(chromaticAddonDisabled ? [] : [getAbsolutePath("@chromatic-com/storybook")]),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    ...(vitestAddonDisabled ? [] : [getAbsolutePath("@storybook/addon-vitest")]),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
  async viteFinal(config, { configType }) {
    const { default: react } = await import("@vitejs/plugin-react-swc");

    config.plugins = config.plugins || [];
    if (configType === "PRODUCTION") {
      config.base = "./";
    }

    try {
      const { default: tailwindcss } = await import("@tailwindcss/vite");
      config.plugins.push(tailwindcss());
    } catch {
      // 테스트 환경에서는 @tailwindcss/vite 미설치일 수 있으므로 스킵
    }
    config.plugins.push(
      react({
        jsxImportSource: "react",
      })
    );

    return config;
  },
};
export default config;
