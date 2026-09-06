import ts from "typescript";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		{
			name: "field-decorator-metadata",
			enforce: "pre",
			transform(source, moduleId) {
				if (!moduleId.endsWith(".ts") || moduleId.includes("/node_modules/"))
					return;
				// 런타임 Field 계약을 실제 TypeScript legacy decorator 설정으로 검사합니다.
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
	test: { environment: "node", include: ["src/**/*.spec.ts"] },
});
