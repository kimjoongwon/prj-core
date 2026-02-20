import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: { unoptimized: true },
	output: "standalone",
	outputFileTracingRoot: path.join(__dirname, "../.."),
	turbopack: {
		root: path.join(__dirname, "../.."),
	},
	typedRoutes: true,
};

export default nextConfig;
