import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	// React Compiler로 자동 메모이제이션(fe-ui의 수동 useMemo 제거 근거)
	reactCompiler: true,
	basePath: "/proposal",
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
				destination: "/proposal",
				permanent: false,
				basePath: false,
			},
		];
	},
};

export default nextConfig;
