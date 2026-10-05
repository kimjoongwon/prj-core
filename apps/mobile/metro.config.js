const path = require("node:path");
const Module = require("node:module");
const { getDefaultConfig } = require("expo/metro-config");

process.env.NODE_PATH = [
	path.join(__dirname, "node_modules"),
	process.env.NODE_PATH || "",
]
	.filter(Boolean)
	.join(path.delimiter);
Module._initPaths();

const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

// Workspace packages must share the mobile app's React and React Query context.
const resolveFromMobile = (moduleName) =>
	require.resolve(moduleName, { paths: [__dirname] });
const forcedModules = new Map(
	Object.entries({
		"@tanstack/react-query": resolveFromMobile("@tanstack/react-query"),
		"@tanstack/query-core": resolveFromMobile("@tanstack/query-core"),
		"pretty-format": resolveFromMobile("pretty-format"),
		react: resolveFromMobile("react"),
		"react/jsx-dev-runtime": resolveFromMobile("react/jsx-dev-runtime"),
		"react/jsx-runtime": resolveFromMobile("react/jsx-runtime"),
	}),
);
const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
	const forcedModule = forcedModules.get(moduleName);

	if (forcedModule) {
		return context.resolveRequest(context, forcedModule, platform);
	}

	if (upstreamResolveRequest) {
		return upstreamResolveRequest(context, moduleName, platform);
	}

	return context.resolveRequest(context, moduleName, platform);
};

module.exports = withUniwindConfig(config, {
	cssEntryFile: "./src/global.css",
});
