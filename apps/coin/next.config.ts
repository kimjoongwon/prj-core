import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: [
		"@safe-global/protocol-kit",
		"@safe-global/api-kit",
		"@safe-global/types-kit",
		"thread-stream",
		"pino",
		"pino-pretty",
		"pino-elasticsearch",
		"sonic-boom",
		"real-require",
		"on-exit-leak-free",
		"atomic-sleep",
	],
	turbopack: {
		resolveAlias: {
			// 테스트/개발 의존성을 빈 모듈로 대체
			desm: "@vercel/turbopack-ecmascript-runtime/empty.js",
			fastbench: "@vercel/turbopack-ecmascript-runtime/empty.js",
			tap: "@vercel/turbopack-ecmascript-runtime/empty.js",
			tape: "@vercel/turbopack-ecmascript-runtime/empty.js",
			"pino-elasticsearch": "@vercel/turbopack-ecmascript-runtime/empty.js",
		},
	},
};

export default nextConfig;
