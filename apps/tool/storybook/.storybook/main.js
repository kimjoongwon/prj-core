import { dirname, join } from "node:path";

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
    {
      directory: "../../../../packages/fe-ui/src",
      titlePrefix: "",
      files: "**/*.stories.@(js|jsx|mjs|ts|tsx)",
    },
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
    const { default: react } = await import("@vitejs/plugin-react-swc");

    config.plugins = config.plugins || [];
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@cocrepo/toolkit": join(process.cwd(), "../../../packages/common-toolkit/index.ts"),
      "@cocrepo/constant": join(process.cwd(), "../../../packages/common-constant/src/index.ts"),
      "@cocrepo/enum": join(process.cwd(), "../../../packages/common-enum/src/index.ts"),
      "@cocrepo/type": join(process.cwd(), "../../../packages/common-type/index.ts"),
      "@cocrepo/schema": join(process.cwd(), "../../../packages/common-schema/src/index.ts"),
      "@cocrepo/hook": join(process.cwd(), "../../../packages/fe-hook/index.ts"),
      "@cocrepo/store": join(process.cwd(), "../../../packages/fe-store/index.ts"),
      "@cocrepo/ui": join(process.cwd(), "../../../packages/fe-ui/index.ts"),
    };

    try {
      const { default: tailwindcss } = await import("@tailwindcss/vite/dist/index.mjs");
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
