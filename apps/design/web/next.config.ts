import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	// React Compiler로 자동 메모이제이션(fe-ui의 수동 useMemo 제거 근거)
	reactCompiler: true,
	basePath: "/design",
	// @cocrepo/ui는 TS 소스를 그대로 배포하므로 앱 번들에 넣어 함께 트랜스파일합니다.
	transpilePackages: ["@cocrepo/ui"],
	turbopack: {
		root: path.join(__dirname, "../../.."),
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/design",
				permanent: false,
				basePath: false,
			},
		];
	},
};

export default nextConfig;
