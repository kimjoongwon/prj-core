import path from "node:path";
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const isDevelopment = process.env.NODE_ENV === "development";
const idpApiInternalUrl =
	process.env.IDP_API_INTERNAL_URL ?? "http://localhost:3007";

const nextConfig: NextConfig = {
	// Docker 배포를 위한 standalone 출력 모드
	output: "standalone",
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
		"@cocrepo/ui",
		"@cocrepo/toolkit",
		"@cocrepo/type",
	],
	// 개발 환경에서만 로컬 IDP API로 프록시합니다.
	// 배포 환경은 ingress 라우팅으로 같은 경로를 처리합니다.
	async rewrites() {
		if (!isDevelopment) {
			return [];
		}

		return {
			beforeFiles: [
				// IDP 서버 API 프록시 (인증 플로우)
				//
				// 로컬 인증 origin은 idp-web(이 origin)이다 — 발급자(issuer)와
				// interaction UI가 같은 origin이어야 oidc-provider의 세션 쿠키가
				// interaction 제출 XHR에 실려가 로그인이 완료된다. 그래서 /oidc도
				// 이 프록시를 통과한다(prod는 ingress가 같은 경로 계약을 담당).
				{
					source: "/oidc/:path*",
					destination: `${idpApiInternalUrl}/oidc/:path*`,
				},
				{
					source: "/api/interaction/:path*",
					destination: `${idpApiInternalUrl}/api/interaction/:path*`,
				},
				{
					source: "/api/forgot-password",
					destination: `${idpApiInternalUrl}/api/forgot-password`,
				},
				{
					source: "/api/password-policy",
					destination: `${idpApiInternalUrl}/api/password-policy`,
				},
				{
					source: "/api/reset-password/:path*",
					destination: `${idpApiInternalUrl}/api/reset-password/:path*`,
				},
				{
					source: "/api/v1/:path*",
					destination: `${idpApiInternalUrl}/api/v1/:path*`,
				},
			],
		};
	},
};

export default withBundleAnalyzer(nextConfig);
