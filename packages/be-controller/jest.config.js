module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	rootDir: ".",
	testMatch: ["**/*.spec.ts", "**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	setupFiles: ["reflect-metadata"],
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
					types: ["jest", "node", "multer"],
					skipLibCheck: true,
					strict: false,
				},
			},
		],
	},
	transformIgnorePatterns: ["node_modules/(?!.*@cocrepo)"],
	maxWorkers: 1,
	testTimeout: 10000,
	forceExit: true,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};
