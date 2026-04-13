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

module.exports = withUniwindConfig(config, {
	cssEntryFile: "./src/global.css",
});
