import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	// React Compiler로 자동 메모이제이션(fe-ui의 수동 useMemo 제거 근거)
	reactCompiler: true,
	basePath: "/live",
	// 브라우저 fetch/video src는 basePath가 자동으로 붙지 않으므로 환경변수로 노출한다.
	env: {
		NEXT_PUBLIC_BASE_PATH: "/live",
	},
	turbopack: {
		root: path.join(__dirname, "../../.."),
	},
	transpilePackages: [
		"@cocrepo/schema",
		"@cocrepo/toolkit",
		"@cocrepo/type",
		"@cocrepo/ui",
	],
	async redirects() {
		return [
			{
				source: "/",
				destination: "/live",
				permanent: false,
				basePath: false,
			},
		];
	},
};

export default nextConfig;
