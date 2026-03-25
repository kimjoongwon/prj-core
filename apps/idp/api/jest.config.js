const path = require("node:path");

module.exports = {
	testEnvironment: "node",
	rootDir: ".",
	testRegex: "\\.spec\\.ts$",
	moduleFileExtensions: ["ts", "js", "json"],
	setupFiles: ["reflect-metadata"],
	moduleNameMapper: {
		"^@cocrepo/app$": "<rootDir>/test/mocks/app.ts",
		"^@cocrepo/be-common$": "<rootDir>/test/mocks/be-common.ts",
		"^@cocrepo/dto$": "<rootDir>/test/mocks/dto.ts",
		"^@cocrepo/integration$": "<rootDir>/test/mocks/integration.ts",
		"^@cocrepo/service$": "<rootDir>/test/mocks/service.ts",
		"^@cocrepo/prisma$": "<rootDir>/test/mocks/prisma.ts",
	},
	transform: {
		"^.+\\.ts$": [
			path.join(__dirname, "node_modules", "ts-jest"),
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
