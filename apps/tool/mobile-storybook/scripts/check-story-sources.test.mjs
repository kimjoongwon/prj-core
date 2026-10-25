import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { glob, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const appRoot = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(appRoot, "../../..");
const storyRoot = path.join(repoRoot, "packages/fe-mo-ui/src");
const catalogPath = path.join(appRoot, ".rnstorybook/story-sources.json");

test("catalog is current and maps every native story exactly once", async () => {
	const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
	const storyPaths = [];
	for await (const storyPath of glob("**/*.stories.tsx", { cwd: storyRoot })) {
		storyPaths.push(path.join(storyRoot, storyPath));
	}

	assert.equal(catalog.length, storyPaths.length);
	assert.equal(
		new Set(catalog.map((entry) => entry.title)).size,
		catalog.length,
	);
	for (const filePath of storyPaths) {
		const relativePath = path
			.relative(repoRoot, filePath)
			.replaceAll(path.sep, "/");
		assert.equal(
			catalog.filter((entry) => entry.filePath === relativePath).length,
			1,
		);
	}

	execFileSync(process.execPath, [
		path.join(appRoot, "scripts/generate-story-sources.mjs"),
		"--check",
	]);
});
