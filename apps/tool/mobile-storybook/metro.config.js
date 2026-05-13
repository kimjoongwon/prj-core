const path = require("node:path");
const Module = require("node:module");
const { getDefaultConfig } = require("expo/metro-config");

process.env.NODE_PATH = [
	path.join(__dirname, "node_modules"),
	path.join(__dirname, "../../../node_modules"),
	process.env.NODE_PATH || "",
]
	.filter(Boolean)
	.join(path.delimiter);
Module._initPaths();

const { withStorybook } = require("@storybook/react-native/metro/withStorybook");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

const resolveFromStorybook = (request) => require.resolve(request);
const forcedModules = new Map(
	Object.entries({
		"heroui-native": resolveFromStorybook("heroui-native"),
		mobx: resolveFromStorybook("mobx"),
		"mobx-react-lite": resolveFromStorybook("mobx-react-lite"),
		react: resolveFromStorybook("react"),
		"react-dom": resolveFromStorybook("react-dom"),
		"react/jsx-dev-runtime": resolveFromStorybook("react/jsx-dev-runtime"),
		"react/jsx-runtime": resolveFromStorybook("react/jsx-runtime"),
		"react-native": resolveFromStorybook("react-native"),
		"react-native-gesture-handler": resolveFromStorybook(
			"react-native-gesture-handler",
		),
		"react-native-reanimated": resolveFromStorybook(
			"react-native-reanimated",
		),
		"react-native-safe-area-context": resolveFromStorybook(
			"react-native-safe-area-context",
		),
		"react-native-svg": resolveFromStorybook("react-native-svg"),
		"react-native-worklets": resolveFromStorybook("react-native-worklets"),
		"tailwind-merge": resolveFromStorybook("tailwind-merge"),
		"tailwind-variants": resolveFromStorybook("tailwind-variants"),
		uniwind: resolveFromStorybook("uniwind"),
	}),
);
const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
	const forcedPath = forcedModules.get(moduleName);

	if (forcedPath) {
		return {
			filePath: forcedPath,
			type: "sourceFile",
		};
	}

	if (upstreamResolveRequest) {
		return upstreamResolveRequest(context, moduleName, platform);
	}

	return context.resolveRequest(context, moduleName, platform);
};

const uniwindConfig = withUniwindConfig(config, {
	cssEntryFile: "./src/global.css",
});

module.exports = withStorybook(uniwindConfig, {
	configPath: "./.rnstorybook",
});
