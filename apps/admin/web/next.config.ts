import path from "node:path";
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	// Docker 배포를 위한 standalone 출력 모드
	output: "standalone",
	// 기본 경로 설정 (예: /admin/auth/login)
	basePath: "/admin",
	// Turbopack 모노레포 설정
	turbopack: {
		// 모노레포 루트 디렉토리 설정 (워크스페이스 패키지 해석용)
		root: path.join(__dirname, "../../.."),
	},
	transpilePackages: [
		"@cocrepo/api",
		"@cocrepo/constant",
		"@cocrepo/hook",
		"@cocrepo/store",
		"@cocrepo/toolkit",
		"@cocrepo/type",
		"@cocrepo/ui",
	],
	typedRoutes: true,
	// cacheComponents: false - 동적 라우트(/users/[id])에서 AppStoreProvider의
	// useRouter/usePathname 사용으로 인해 비활성화
	// TODO: 추후 Store Provider 아키텍처 개선 후 재활성화 검토
	cacheComponents: false,
	// 개발 환경 프록시 설정
	async rewrites() {
		return {
			// basePath를 무시하고 /api 경로를 프록시
			// OIDC callback 포함 모든 /api/v1 요청을 백엔드로 프록시
			beforeFiles: [
				// IDP 관련 경로 → idp-server (port 3007)
				{
					source: "/api/v1/auth/:path*",
					destination: "http://localhost:3007/api/v1/auth/:path*",
					basePath: false,
				},
				{
					source: "/api/v1/idp/:path*",
					destination: "http://localhost:3007/api/v1/idp/:path*",
					basePath: false,
				},
				{
					source: "/api/v1/oidc-clients/:path*",
					destination: "http://localhost:3007/api/v1/oidc-clients/:path*",
					basePath: false,
				},
				{
					source: "/api/v1/oidc-sessions/:path*",
					destination: "http://localhost:3007/api/v1/oidc-sessions/:path*",
					basePath: false,
				},
				// 나머지 → main server (port 3006)
				{
					source: "/api/v1/:path*",
					destination: "http://localhost:3006/api/v1/:path*",
					basePath: false,
				},
			],
		};
	},
};

export default withBundleAnalyzer(nextConfig);
