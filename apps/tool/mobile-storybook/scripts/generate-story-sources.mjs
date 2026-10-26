import { glob, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "../../../..");
const storyRoot = path.join(repoRoot, "packages/fe-mo-ui/src");
const outputPath = path.join(
	repoRoot,
	"apps/tool/mobile-storybook/.rnstorybook/story-sources.json",
);
const checkOnly = process.argv.includes("--check");
const storyPaths = [];

for await (const storyPath of glob("**/*.stories.tsx", { cwd: storyRoot })) {
	storyPaths.push(path.join(storyRoot, storyPath));
}

storyPaths.sort();
const entries = [];
for (const filePath of storyPaths) {
	const source = await readFile(filePath, "utf8");
	const titleMatch = source.match(/title:\s*["'`]([^"'`]+)["'`]/);
	if (!titleMatch) {
		throw new Error(`Story title is required for source catalog: ${filePath}`);
	}

	entries.push({
		filePath: path.relative(repoRoot, filePath).replaceAll(path.sep, "/"),
		source,
		title: `mo-ui/${titleMatch[1]}`,
	});
}

const catalog = `${JSON.stringify(entries, null, 2)}\n`;
if (checkOnly) {
	const existing = await readFile(outputPath, "utf8").catch(() => "");
	if (existing !== catalog) {
		throw new Error(
			"Mobile Storybook story source catalog is stale. Run pnpm run storybook:generate:sources.",
		);
	}
	process.exit(0);
}

await writeFile(outputPath, catalog, "utf8");
