import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import tailwindcss from "@tailwindcss/vite";

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
	return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const chromaticAddonDisabled =
	process.env.STORYBOOK_DISABLE_CHROMATIC === "true";

const config = {
	stories: ["../../../../packages/fe-ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		// Chromatic: 스토리 스냅샷을 업로드해 시각적 회귀 테스트와 리뷰를 돕는다.
		...(chromaticAddonDisabled
			? []
			: [getAbsolutePath("@chromatic-com/storybook")]),
		// Docs: 스토리와 컴포넌트 메타데이터로 문서 탭을 생성한다.
		getAbsolutePath("@storybook/addon-docs"),
		// A11y: Storybook 안에서 접근성 위반을 검사하고 결과 패널을 제공한다.
		getAbsolutePath("@storybook/addon-a11y"),
		// Vitest: 스토리 기반 테스트 실행 결과를 Storybook UI에서 확인하게 해준다.
		getAbsolutePath("@storybook/addon-vitest"),
	],
	framework: {
		name: getAbsolutePath("@storybook/nextjs-vite"),
	},
	viteFinal(config, { configType }) {
		config.plugins = config.plugins || [];

		if (configType === "PRODUCTION") {
			config.base = "./";
		}

		config.plugins.push(tailwindcss());

		return config;
	},
};
export default config;
