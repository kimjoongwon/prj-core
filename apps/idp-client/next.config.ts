import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Docker 배포를 위한 standalone 출력 모드
	output: "standalone",
	// Turbopack 모노레포 설정
	turbopack: {
		// 모노레포 루트 디렉토리 설정 (워크스페이스 패키지 해석용)
		root: path.join(__dirname, "../.."),
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
	// API 프록시
	async rewrites() {
		return {
			beforeFiles: [
				// IDP 서버 API 프록시 (인증 플로우)
				{
					source: "/api/interaction/:path*",
					destination: "http://localhost:3007/api/interaction/:path*",
				},
				{
					source: "/api/forgot-password",
					destination: "http://localhost:3007/api/forgot-password",
				},
				{
					source: "/api/password-policy",
					destination: "http://localhost:3007/api/password-policy",
				},
				{
					source: "/api/reset-password/:path*",
					destination: "http://localhost:3007/api/reset-password/:path*",
				},
				// Main 서버 API 프록시 (관리 콘솔)
				{
					source: "/api/v1/:path*",
					destination: "http://localhost:3006/api/v1/:path*",
				},
			],
		};
	},
};

export default nextConfig;
