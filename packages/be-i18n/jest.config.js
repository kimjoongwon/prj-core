module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	rootDir: ".",
	testMatch: ["**/*.spec.ts", "**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	moduleNameMapper: {
		"^@cocrepo/constant$": "<rootDir>/../constant/dist",
		"^@cocrepo/prisma$": "<rootDir>/../prisma/dist/src",
		"^@cocrepo/service$": "<rootDir>/../service/dist",
	},
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				tsconfig: {
					module: "commonjs",
					target: "es2022",
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					experimentalDecorators: true,
					emitDecoratorMetadata: true,
					types: ["jest", "node"],
					skipLibCheck: true,
					strict: false,
				},
			},
		],
	},
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/**/*.spec.ts",
		"!src/**/*.test.ts",
		"!src/**/*.d.ts",
		"!src/**/index.ts",
	],
	coverageDirectory: "./coverage",
	coverageReporters: ["text", "lcov", "html"],
	testTimeout: 10000,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};
