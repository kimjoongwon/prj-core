import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Docker 배포를 위한 standalone 출력 모드
	output: "standalone",
	transpilePackages: [
		"@cocrepo/ui",
		"@cocrepo/design-system",
		"@cocrepo/api",
		"@cocrepo/store",
		"@cocrepo/toolkit",
	],
	typedRoutes: true,
};

export default nextConfig;
