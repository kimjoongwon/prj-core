import path from "node:path";
import type { NextConfig } from "next";

// /dolmen/api/* → dolmen-api 프록시는 next.config rewrites가 아니라
// src/app/api/[...path]/route.ts 라우트 핸들러가 처리한다.
// rewrites의 destination은 standalone 빌드 시점에 굳어져 환경별 이미지 재빌드가
// 강제되지만, 라우트 핸들러는 요청 시점의 DOLMEN_API_URL env를 읽는다.
const nextConfig: NextConfig = {
	output: "standalone",
	// React Compiler로 자동 메모이제이션(fe-ui의 수동 useMemo 제거 근거)
	reactCompiler: true,
	basePath: "/dolmen",
	turbopack: {
		root: path.join(__dirname, "../../.."),
	},
	transpilePackages: [
		"three",
		"@cocrepo/schema",
		"@cocrepo/toolkit",
		"@cocrepo/type",
		"@cocrepo/ui",
	],
};

export default nextConfig;
