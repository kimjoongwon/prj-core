import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Docker 배포를 위한 standalone 출력 모드
	output: "standalone",
	// 기본 경로 설정 (예: /admin/auth/login)
	basePath: "/admin",
	// Turbopack 모노레포 설정
	turbopack: {
		// 모노레포 루트 디렉토리 설정 (워크스페이스 패키지 해석용)
		root: path.join(__dirname, "../.."),
	},
	transpilePackages: [
		"@cocrepo/ui",
		"@cocrepo/design-system",
		"@cocrepo/api",
		"@cocrepo/store",
		"@cocrepo/toolkit",
		"@cocrepo/hook",
		"@cocrepo/type",
	],
	typedRoutes: true,
	cacheComponents: true,
};

export default nextConfig;
