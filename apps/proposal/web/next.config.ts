import path from "node:path";
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	output: "standalone",
	turbopack: {
		root: path.join(__dirname, "../../.."),
	},
	transpilePackages: ["@cocrepo/ui", "@cocrepo/toolkit", "@cocrepo/type"],
};

export default withBundleAnalyzer(nextConfig);
