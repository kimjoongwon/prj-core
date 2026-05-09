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
const uniwindConfig = withUniwindConfig(config, {
	cssEntryFile: "./src/global.css",
});

module.exports = withStorybook(uniwindConfig, {
	configPath: "./.rnstorybook",
});
