import path from "node:path";
import type { NextConfig } from "next";

const dolmenApiUrl = process.env.DOLMEN_API_URL ?? "http://localhost:3012";

const nextConfig: NextConfig = {
	output: "standalone",
	basePath: "/dolmen",
	turbopack: {
		root: path.join(__dirname, "../../.."),
	},
	transpilePackages: [
		"@cocrepo/schema",
		"@cocrepo/toolkit",
		"@cocrepo/type",
		"@cocrepo/ui",
	],
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${dolmenApiUrl}/api/:path*`,
			},
		];
	},
};

export default nextConfig;
