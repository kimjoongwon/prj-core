import { join, dirname } from "node:path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.mdx", 
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/shared-frontend/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  async viteFinal(config) {
    const { default: tailwindcss } = await import("@tailwindcss/vite");

    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    // JSX 자동 변환 설정
    config.esbuild = {
      jsx: "automatic",
    };

    return config;
  },
};
export default config;
