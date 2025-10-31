import { defineConfig } from "tsup";

export default defineConfig((option) => ({
	entry: ["./index.ts"],
	format: ["esm", "cjs"],
	outDir: "./dist",
	clean: !option.watch,
	watch: option.watch,
	env: {
		NODE_ENV: option.watch ? "development" : "production",
	},
	sourcemap: option.watch,
	dts: true,
	// Tree-shaking 최적화
	treeshake: {
		preset: "recommended", // 권장 설정 사용
	},
	// package.json 기반 전략: dependencies의 모든 패키지를 자동으로 external 처리
	// → 사용자 프로젝트에서 tree-shaking 가능
	// → 번들 크기 최소화 및 중복 방지
}));
