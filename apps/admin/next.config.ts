import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: [
		"@cocrepo/ui",
		"@cocrepo/design-system",
		"@cocrepo/api",
		"@cocrepo/store",
		"@cocrepo/toolkit",
	],
};

export default nextConfig;
