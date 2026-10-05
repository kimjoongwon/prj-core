module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	rootDir: ".",
	testMatch: ["**/*.spec.ts", "**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	setupFiles: ["reflect-metadata"],
	moduleNameMapper: {
		"^@cocrepo/repository$": "<rootDir>/../be-repository/dist",
		"^@cocrepo/prisma$": "<rootDir>/src/__tests__/mocks/prisma.ts",
		"^@cocrepo/entity$": "<rootDir>/../be-entity/dist",
		"^@cocrepo/vo$": "<rootDir>/../be-vo/dist",
		"^@cocrepo/dto$": "<rootDir>/../be-dto/dist",
		"^@cocrepo/toolkit$": "<rootDir>/../common-toolkit/dist",
		"^@cocrepo/constant$": "<rootDir>/../common-constant/dist",
		"^@cocrepo/type$": "<rootDir>/../common-type/index.ts",
		"^@cocrepo/type/(.*)$": "<rootDir>/../common-type/dist/src/$1.js",
		"^@cocrepo/decorator$": "<rootDir>/../be-decorator/dist",
		"^@cocrepo/decorator/field/password$":
			"<rootDir>/../be-decorator/dist/field/specialized/password.field.js",
		"^@cocrepo/decorator/transform$":
			"<rootDir>/../be-decorator/dist/transform.decorators.js",
		"^@cocrepo/decorator/(.*)$": "<rootDir>/../be-decorator/dist/$1",
		"^@cocrepo/service$": "<rootDir>/../be-service/dist",
	},
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				tsconfig: {
					module: "commonjs",
					baseUrl: ".",
					paths: {
						"@cocrepo/type/bigint-json": [
							"../common-type/dist/src/bigint-json.d.ts",
						],
						"@cocrepo/decorator/field": [
							"../be-decorator/dist/field/index.d.ts",
						],
					},
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
	maxWorkers: 1,
	testTimeout: 10000,
	forceExit: true,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};
