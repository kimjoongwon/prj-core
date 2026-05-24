import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createStorybookAuthPlugin,
  createStorybookProxyConfig,
} from "./storybookAuthDevServer.js";
import { createStorybookCodexBridgePlugin } from "./storybookCodexBridge.js";
import {
  applyFeUiStoryTitleTransform,
  createFeUiStoryIndexer,
} from "./feUiStoryTitles.js";
import { serializeOverviewManifestSourceMaps } from "./overviewManifestSources.js";

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
const codexBridgeDisabled = process.env.STORYBOOK_DISABLE_CODEX_BRIDGE === "true";
const includePlaceholderStories = process.env.STORYBOOK_INCLUDE_PLACEHOLDER === "true";
const configDir = fileURLToPath(new URL(".", import.meta.url));
const localStoryRoot = join(configDir, "../stories");
const feUiStoryRoot = join(configDir, "../../../../packages/fe-ui/src");
const repositoryRoot = join(configDir, "../../../..");
const overviewManifestSources = serializeOverviewManifestSourceMaps(repositoryRoot);

function isStoryFile(name) {
  return /\.stories\.(js|jsx|mjs|ts|tsx)$/.test(name);
}

function isMdxFile(name) {
  return /\.mdx$/.test(name);
}

function isPlaceholderStory(filePath) {
  const source = readFileSync(filePath, "utf8");
  return (
    source.includes("Story Placeholder") &&
    source.includes("Baseline story generated for coverage.")
  );
}

function toStorybookPath(filePath) {
  return relative(configDir, filePath).split(sep).join("/");
}

function collectStoryFiles(directory, { allowMdx = false, filterPlaceholders = false } = {}) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectStoryFiles(entryPath, { allowMdx, filterPlaceholders });
      }
      const isSupportedStoryFile =
        isStoryFile(entry.name) || (allowMdx && isMdxFile(entry.name));
      if (!isSupportedStoryFile) {
        return [];
      }
      if (
        filterPlaceholders &&
        isStoryFile(entry.name) &&
        !includePlaceholderStories &&
        isPlaceholderStory(entryPath)
      ) {
        return [];
      }
      return [toStorybookPath(entryPath)];
    })
    .sort((left, right) => left.localeCompare(right));
}

const localStories = collectStoryFiles(localStoryRoot, {
  allowMdx: true,
});
const feUiStories = collectStoryFiles(feUiStoryRoot, {
  filterPlaceholders: true,
});

const config = {
  stories: [...localStories, ...feUiStories],
  experimental_indexers: async (existingIndexers) =>
    existingIndexers.map((indexer) =>
      indexer.test?.test("example.stories.tsx")
        ? createFeUiStoryIndexer(feUiStoryRoot, indexer)
        : indexer,
    ),
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
    const authConfig = {
      requireAuth: process.env.STORYBOOK_REQUIRE_AUTH === "true",
      coreApiTarget: process.env.STORYBOOK_CORE_API_TARGET || "http://localhost:3006",
      idpApiTarget: process.env.STORYBOOK_IDP_API_TARGET || "http://localhost:3007",
    };

    config.plugins = config.plugins || [];
    config.resolve = config.resolve || {};
    config.server = config.server || {};
    if (configType === "PRODUCTION") {
      config.base = "./";
    }
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
      "@cocrepo/hook/nuqs": join(process.cwd(), "../../../packages/fe-hook/src/nuqs.ts"),
      "@cocrepo/hook": join(process.cwd(), "../../../packages/fe-hook/index.ts"),
      "@cocrepo/store": join(process.cwd(), "../../../packages/fe-store/index.ts"),
      "@cocrepo/ui/heroui": join(process.cwd(), "../../../packages/fe-ui/src/design-system/heroui.tsx"),
      "@cocrepo/ui": join(process.cwd(), "../../../packages/fe-ui/index.ts"),
    };
    config.define = {
      ...(config.define || {}),
      __STORYBOOK_REQUIRE_AUTH__: JSON.stringify(authConfig.requireAuth),
      __STORYBOOK_OVERVIEW_MANIFEST_SOURCES__: overviewManifestSources,
    };

    try {
      const { default: tailwindcss } = await import("@tailwindcss/vite");
      config.plugins.push(tailwindcss());
    } catch {
      // 테스트 환경에서는 @tailwindcss/vite 미설치일 수 있으므로 스킵
    }
    config.plugins.push({
      name: "fe-ui-story-title-normalizer",
      enforce: "pre",
      async transform(code, id) {
        const transformed = await applyFeUiStoryTitleTransform(
          code,
          id,
          feUiStoryRoot,
        );

        if (!transformed) {
          return null;
        }

        return {
          code: transformed.code,
          map: transformed.map ?? null,
        };
      },
    });
    config.plugins.push(
      react({
        jsxImportSource: "react",
      })
    );

    config.plugins.push(createStorybookAuthPlugin(authConfig));
    if (!codexBridgeDisabled) {
      config.plugins.push(
        createStorybookCodexBridgePlugin({
          repositoryRoot,
        }),
      );
    }

    return config;
  },
};
export default config;
