module.exports = {
	preset: "jest-expo",
	rootDir: ".",
	globals: {
		__DEV__: true,
	},
	testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
	moduleNameMapper: {
		// MobX 7의 react-native 조건은 ESM 산출물을 가리켜 jest(CJS)가 해석하지 못한다.
		// 앱 번들은 metro가 ESM을 처리하므로 테스트에서만 이 패키지 의존성 트리의 CJS로 고정한다.
		// react 매핑은 워크스페이스 카탈로그 react와의 이중 로딩(useReducer null)을 막는다.
		"^mobx$": "<rootDir>/node_modules/mobx/dist/index.js",
		"^mobx-react-lite$": "<rootDir>/node_modules/mobx-react-lite/dist/index.js",
		"^react$": "<rootDir>/node_modules/react/index.js",
	},
	setupFilesAfterEnv: ["<rootDir>/test/jestExpoRuntimeSetup.js"],
	transformIgnorePatterns: [
		"node_modules/(?!.*(@cocrepo|(jest-)?react-native|@react-native|expo|@expo|heroui-native|react-native-reanimated|react-native-worklets|react-native-svg|uniwind))",
	],
	collectCoverageFrom: [
		"src/**/*.ts",
		"src/**/*.tsx",
		"!src/**/*.test.ts",
		"!src/**/*.test.tsx",
	],
};
