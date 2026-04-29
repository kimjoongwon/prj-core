module.exports = {
	rootDir: ".",
	globals: {
		__DEV__: true,
	},
	testEnvironment: "node",
	testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
	setupFilesAfterEnv: ["<rootDir>/test/jestExpoRuntimeSetup.js"],
	transform: {
		"^.+\\.[jt]sx?$": [
			"babel-jest",
			{
				presets: ["@react-native/babel-preset"],
			},
		],
	},
	transformIgnorePatterns: [
		"node_modules/.pnpm/(?!(react-native|@react-native\\+.*|@react-native-community\\+.*)@)",
		"node_modules/(?!\\.pnpm|((jest-)?react-native|@react-native|@react-native-community)/)",
	],
	collectCoverageFrom: [
		"src/**/*.ts",
		"src/**/*.tsx",
		"!src/**/*.test.ts",
		"!src/**/*.test.tsx",
	],
};
