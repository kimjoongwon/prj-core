import { fileURLToPath } from "node:url";
import ts from "typescript";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		{
			name: "dto-typescript-decorator-metadata",
			enforce: "pre",
			transform(source, moduleId) {
				if (
					!moduleId.endsWith(".ts") ||
					!moduleId.includes("/packages/") ||
					moduleId.includes("/node_modules/")
				) {
					return;
				}
				// Nest의 실제 tsc 빌드처럼 Swagger가 사용할 design:type을 생성합니다.
				const compiledModule = ts.transpileModule(source, {
					fileName: moduleId,
					compilerOptions: {
						target: ts.ScriptTarget.ES2022,
						module: ts.ModuleKind.ESNext,
						experimentalDecorators: true,
						emitDecoratorMetadata: true,
						useDefineForClassFields: false,
						sourceMap: true,
					},
				});
				return {
					code: compiledModule.outputText,
					map: compiledModule.sourceMapText,
				};
			},
		},
	],
	ssr: {
		noExternal: [/@cocrepo\//],
	},
	resolve: {
		alias: [
			{
				find: /^@cocrepo\/entity$/,
				replacement: fileURLToPath(
					new URL("../be-entity/src/index.ts", import.meta.url),
				),
			},
			{
				find: fileURLToPath(
					new URL("../common-constant/src/index.ts", import.meta.url),
				),
				replacement: fileURLToPath(
					new URL("../common-constant/dist/index.js", import.meta.url),
				),
			},
			{
				find: /^@cocrepo\/constant$/,
				replacement: fileURLToPath(
					new URL("../common-constant/dist/index.js", import.meta.url),
				),
			},
		],
	},
	test: {
		alias: {
			"@cocrepo/constant": fileURLToPath(
				new URL("../common-constant/dist/index.js", import.meta.url),
			),
		},
		environment: "node",
		server: {
			deps: {
				inline: [/@cocrepo\//],
			},
		},
	},
});
