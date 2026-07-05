import path from "node:path";
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	output: "standalone",
	basePath: "/proposal",
	turbopack: {
		root: path.join(__dirname, "../../.."),
	},
	transpilePackages: [
		"@cocrepo/schema",
		"@cocrepo/toolkit",
		"@cocrepo/type",
		"@cocrepo/ui",
	],
	async redirects() {
		return [
			{
				source: "/",
				destination: "/proposal",
				permanent: false,
				basePath: false,
			},
		];
	},
};

export default withBundleAnalyzer(nextConfig);
