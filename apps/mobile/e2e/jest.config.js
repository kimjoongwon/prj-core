module.exports = {
	rootDir: "..",
	testMatch: ["<rootDir>/e2e/**/*.e2e.js"],
	globalSetup: "detox/runners/jest/globalSetup",
	globalTeardown: "detox/runners/jest/globalTeardown",
	testEnvironment: "detox/runners/jest/testEnvironment",
	testTimeout: 120000,
	maxWorkers: 1,
	reporters: ["detox/runners/jest/reporter"],
	verbose: true,
};
