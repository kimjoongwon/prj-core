import { dirname, join } from "node:path";
import {
  createStorybookAuthPlugin,
  createStorybookProxyConfig,
} from "./storybookAuthDevServer.js";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const chromaticAddonDisabled = process.env.STORYBOOK_DISABLE_CHROMATIC === "true";

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
    ...(chromaticAddonDisabled ? [] : [getAbsolutePath("@chromatic-com/storybook")]),
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
    const authConfig = {
      requireAuth: process.env.STORYBOOK_REQUIRE_AUTH === "true",
      coreApiTarget: process.env.STORYBOOK_CORE_API_TARGET || "http://localhost:3006",
      idpApiTarget: process.env.STORYBOOK_IDP_API_TARGET || "http://localhost:3007",
    };

    config.plugins = config.plugins || [];
    config.resolve = config.resolve || {};
    config.server = config.server || {};
    config.server.proxy = {
      ...(config.server.proxy || {}),
      ...createStorybookProxyConfig(authConfig),
    };
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@cocrepo/api": join(process.cwd(), "../../../packages/fe-api/src"),
      "@cocrepo/toolkit": join(process.cwd(), "../../../packages/common-toolkit/index.ts"),
      "@cocrepo/constant": join(process.cwd(), "../../../packages/common-constant/src/index.ts"),
      "@cocrepo/enum": join(process.cwd(), "../../../packages/common-enum/src/index.ts"),
      "@cocrepo/type": join(process.cwd(), "../../../packages/common-type/index.ts"),
      "@cocrepo/schema": join(process.cwd(), "../../../packages/common-schema/src/index.ts"),
      "@cocrepo/hook": join(process.cwd(), "../../../packages/fe-hook/index.ts"),
      "@cocrepo/store": join(process.cwd(), "../../../packages/fe-store/index.ts"),
      "@cocrepo/ui": join(process.cwd(), "../../../packages/fe-ui/index.ts"),
      "next/navigation": join(process.cwd(), "src/runtime/nextNavigationMock.ts"),
    };
    config.define = {
      ...(config.define || {}),
      __STORYBOOK_REQUIRE_AUTH__: JSON.stringify(authConfig.requireAuth),
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

    config.plugins.push(createStorybookAuthPlugin(authConfig));

    return config;
  },
};
export default config;
