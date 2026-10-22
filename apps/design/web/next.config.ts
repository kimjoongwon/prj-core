import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	basePath: "/design",
	turbopack: {
		root: path.join(__dirname, "../../.."),
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/design",
				permanent: false,
				basePath: false,
			},
		];
	},
};

export default nextConfig;
