module.exports = {
	rootDir: "..",
	testMatch: ["<rootDir>/e2e/**/*.e2e.js"],
	testEnvironment: "node",
	testRunner: "jest-circus/runner",
	setupFilesAfterEnv: ["<rootDir>/e2e/init.js"],
	testTimeout: 120000,
	maxWorkers: 1,
	reporters: ["default"],
};
