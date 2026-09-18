import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const esmDirectoryUrl = new URL("../dist/esm/", import.meta.url);

async function findJavaScriptModuleUrls(directoryUrl) {
	const directoryEntries = await readdir(directoryUrl, { withFileTypes: true });
	const moduleUrlGroups = await Promise.all(
		directoryEntries.map((directoryEntry) => {
			const entryUrl = new URL(directoryEntry.name, directoryUrl);
			if (directoryEntry.isDirectory()) {
				return findJavaScriptModuleUrls(new URL(`${entryUrl.href}/`));
			}
			return directoryEntry.isFile() && directoryEntry.name.endsWith(".js")
				? [entryUrl]
				: [];
		}),
	);
	return moduleUrlGroups.flat();
}

function resolveNodeEsmSpecifier(moduleUrl, modulePathSet, moduleSpecifier) {
	if (!moduleSpecifier.startsWith(".") || moduleSpecifier.endsWith(".js")) {
		return moduleSpecifier;
	}

	const fileModuleUrl = new URL(`${moduleSpecifier}.js`, moduleUrl);
	if (modulePathSet.has(fileURLToPath(fileModuleUrl))) {
		return `${moduleSpecifier}.js`;
	}

	const directoryModuleUrl = new URL(`${moduleSpecifier}/index.js`, moduleUrl);
	if (modulePathSet.has(fileURLToPath(directoryModuleUrl))) {
		return `${moduleSpecifier}/index.js`;
	}

	throw new Error(
		`ESM import 대상 파일을 찾을 수 없습니다: ${moduleSpecifier} (${fileURLToPath(moduleUrl)})`,
	);
}

await mkdir(esmDirectoryUrl, { recursive: true });
const javaScriptModuleUrls = await findJavaScriptModuleUrls(esmDirectoryUrl);
const modulePathSet = new Set(javaScriptModuleUrls.map(fileURLToPath));

await Promise.all(
	javaScriptModuleUrls.map(async (moduleUrl) => {
		const moduleSource = await readFile(moduleUrl, "utf8");
		const nodeCompatibleModuleSource = moduleSource.replace(
			/(\b(?:from|import)\s*["'])(\.\.?\/[^"']+)(["'])/g,
			(_match, importPrefix, moduleSpecifier, importSuffix) =>
				`${importPrefix}${resolveNodeEsmSpecifier(moduleUrl, modulePathSet, moduleSpecifier)}${importSuffix}`,
		);
		await writeFile(moduleUrl, nodeCompatibleModuleSource);
	}),
);

await writeFile(new URL("package.json", esmDirectoryUrl), '{"type":"module"}\n');
