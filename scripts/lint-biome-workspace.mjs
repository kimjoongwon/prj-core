#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const CODE_FILE_PATTERN = /\.(?:cjs|mjs|jsx?|tsx?)$/;
const IGNORED_DIRS = new Set([
	".expo",
	".next",
	".turbo",
	"build",
	"coverage",
	"dist",
	"generated",
	"node_modules",
	"storybook-static",
]);

const PROD_IGNORED_DIRS = new Set([
	"__tests__",
	".rnstorybook",
	".storybook",
	"e2e",
	"test",
	"tests",
]);

const PROD_IGNORED_FILE_PATTERNS = [
	/(^|[./])jest\.config\.[cm]?js$/,
	/(^|[./])playwright\.config\.ts$/,
	/(^|[./])vitest\.config\.ts$/,
	/(^|[./])vitest\.setup\.ts$/,
	/(^|[./])test-setup\.[cm]?js$/,
	/(^|[./])storybook\.requires\.tsx?$/,
	/\.(?:e2e|spec|stories|test)\.[cm]?(?:jsx?|tsx?)$/,
	/\.setup\.[cm]?(?:jsx?|tsx?)$/,
];

const args = new Set(process.argv.slice(2));
const shouldFix = args.has("--fix");
const shouldUseProdTargets = args.has("--prod");
const command = shouldFix ? "check" : "lint";
const commandArgs = [command];

if (shouldFix) {
	commandArgs.push("--write");
}

/**
 * Returns true when a relative file path should be skipped for production lint.
 *
 * @param {string} relativePath Repository-relative path inside the current workspace.
 * @returns {boolean} Whether this file belongs only to test, story, e2e, or tool config lint.
 */
function isProdIgnoredFile(relativePath) {
	const segments = relativePath.split("/");
	if (segments.some((segment) => PROD_IGNORED_DIRS.has(segment))) {
		return true;
	}

	return PROD_IGNORED_FILE_PATTERNS.some((pattern) => pattern.test(relativePath));
}

/**
 * Recursively collects lintable source files from the current workspace.
 *
 * @param {string} directory Absolute directory to scan.
 * @param {string[]} result Accumulator of relative file paths.
 * @returns {string[]} Lintable file paths relative to process.cwd().
 */
function collectCodeFiles(directory, result = []) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		if (entry.isDirectory()) {
			if (IGNORED_DIRS.has(entry.name)) {
				continue;
			}

			collectCodeFiles(join(directory, entry.name), result);
			continue;
		}

		if (!entry.isFile() || !CODE_FILE_PATTERN.test(entry.name)) {
			continue;
		}

		const absolutePath = join(directory, entry.name);
		const relativePath = relative(process.cwd(), absolutePath).split("\\").join("/");
		if (shouldUseProdTargets && isProdIgnoredFile(relativePath)) {
			continue;
		}

		result.push(relativePath);
	}

	return result;
}

const files = collectCodeFiles(process.cwd()).filter((file) => {
	try {
		return statSync(file).size > 0;
	} catch {
		return false;
	}
});

if (files.length === 0) {
	console.log(
		`No ${shouldUseProdTargets ? "production " : ""}Biome lint targets found.`,
	);
	process.exit(0);
}

const chunkSize = 150;
for (let index = 0; index < files.length; index += chunkSize) {
	const chunk = files.slice(index, index + chunkSize);
	const result = spawnSync(
		"pnpm",
		[
			"exec",
			"biome",
			...commandArgs,
			...chunk,
			"--no-errors-on-unmatched",
			"--files-ignore-unknown=true",
		],
		{ stdio: "inherit" },
	);

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}
