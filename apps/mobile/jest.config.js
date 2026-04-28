module.exports = {
	preset: "jest-expo",
	rootDir: ".",
	testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"\\.css$": "<rootDir>/test/styleMock.js",
	},
	setupFilesAfterEnv: ["<rootDir>/test/jestExpoRuntimeSetup.js"],
	collectCoverageFrom: [
		"src/**/*.ts",
		"src/**/*.tsx",
		"!src/**/*.test.ts",
		"!src/**/*.test.tsx",
	],
};
