import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const isDevelopment = process.env.NODE_ENV === "development";
const coreApiInternalUrl =
	process.env.CORE_API_INTERNAL_URL ?? "http://localhost:3006";

const nextConfig: NextConfig = {
	// Docker 배포를 위한 standalone 출력 모드
	output: "standalone",
	// 기본 경로 설정 (예: /admin/auth/login)
	basePath: "/admin",
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
	async redirects() {
		return [
			{
				source: "/",
				destination: "/admin",
				permanent: false,
				basePath: false,
			},
		];
	},
	// 개발 환경에서만 로컬 API 서버로 프록시합니다.
	// 배포 환경은 ingress 라우팅으로 같은 경로를 처리합니다.
	async rewrites() {
		if (!isDevelopment) {
			return [];
		}

		return {
			// basePath를 무시하고 /api 경로를 프록시
			// OIDC callback 포함 모든 /api/v1 요청을 백엔드로 프록시
			beforeFiles: [
				// Auth/OIDC 관련 경로 -> core-api
				{
					source: "/oidc/:path*",
					destination: `${coreApiInternalUrl}/oidc/:path*`,
					basePath: false,
				},
				{
					source: "/api/interaction/:path*",
					destination: `${coreApiInternalUrl}/api/interaction/:path*`,
					basePath: false,
				},
				{
					source: "/api/forgot-password",
					destination: `${coreApiInternalUrl}/api/forgot-password`,
					basePath: false,
				},
				{
					source: "/api/password-policy",
					destination: `${coreApiInternalUrl}/api/password-policy`,
					basePath: false,
				},
				{
					source: "/api/reset-password/:path*",
					destination: `${coreApiInternalUrl}/api/reset-password/:path*`,
					basePath: false,
				},
				{
					source: "/api/v1/auth/:path*",
					destination: `${coreApiInternalUrl}/api/v1/auth/:path*`,
					basePath: false,
				},
				{
					source: "/api/v1/idp/:path*",
					destination: `${coreApiInternalUrl}/api/v1/idp/:path*`,
					basePath: false,
				},
				{
					source: "/api/v1/oidc-clients/:path*",
					destination: `${coreApiInternalUrl}/api/v1/oidc-clients/:path*`,
					basePath: false,
				},
				{
					source: "/api/v1/oidc-sessions/:path*",
					destination: `${coreApiInternalUrl}/api/v1/oidc-sessions/:path*`,
					basePath: false,
				},
				// 나머지 → main server (port 3006)
				{
					source: "/api/v1/:path*",
					destination: `${coreApiInternalUrl}/api/v1/:path*`,
					basePath: false,
				},
			],
		};
	},
};

export default withBundleAnalyzer(nextConfig);
