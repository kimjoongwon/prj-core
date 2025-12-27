import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Docker 배포를 위한 standalone 출력 모드
	output: "standalone",
	// 기본 경로 설정 (예: /admin/auth/login)
	basePath: "/admin",
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
