module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	rootDir: ".",
	testRegex: "\\.(spec|e2e-spec)\\.ts$",
	moduleFileExtensions: ["ts", "js", "json"],
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
	maxWorkers: 1,
	testTimeout: 30000,
	forceExit: true,
	detectOpenHandles: true,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};
