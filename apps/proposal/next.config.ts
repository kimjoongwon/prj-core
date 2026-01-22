import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// 정적 HTML 생성
	output: "export",
	// static export 시 이미지 최적화 비활성화
	images: { unoptimized: true },
	// Turbopack 모노레포 설정
	turbopack: {
		// 모노레포 루트 디렉토리 설정 (워크스페이스 패키지 해석용)
		root: path.join(__dirname, "../.."),
	},
	transpilePackages: [
		"@cocrepo/ui",
		"@cocrepo/design-system",
		"@heroui/react",
	],
	typedRoutes: true,
};

export default nextConfig;
