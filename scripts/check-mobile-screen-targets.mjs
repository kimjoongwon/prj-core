import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const appDir = path.join(rootDir, "apps/mobile/src/app");
const screenIndexPath = path.join(
	rootDir,
	"packages/fe-mo-ui/src/screen/index.ts",
);
const rootUiIndexPath = path.join(rootDir, "packages/fe-mo-ui/src/index.ts");
const screenTargetPattern =
	/packages\/fe-mo-ui\/src\/screen\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)\.tsx/g;

const errors = [];

const walkFiles = (dir, predicate) => {
	const entries = fs.existsSync(dir)
		? fs.readdirSync(dir, { withFileTypes: true })
		: [];
	const files = [];

	for (const entry of entries) {
		const entryPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...walkFiles(entryPath, predicate));
			continue;
		}

		if (predicate(entryPath)) {
			files.push(entryPath);
		}
	}

	return files;
};

const readFile = (filePath) => fs.readFileSync(filePath, "utf8");

const routeSpecPaths = walkFiles(appDir, (filePath) =>
	filePath.endsWith("index.spec.md"),
);
const targets = new Map();

for (const specPath of routeSpecPaths) {
	const source = readFile(specPath);
	const matches = source.matchAll(screenTargetPattern);

	for (const match of matches) {
		const [, folderName, fileName] = match;
		const targetPath = match[0];

		if (folderName !== fileName) {
			errors.push(
				`${specPath}: screen folder/file mismatch for ${targetPath}`,
			);
		}

		targets.set(targetPath, {
			screenName: fileName,
			specPath,
			targetPath,
		});
	}
}

if (targets.size === 0) {
	errors.push(
		"apps/mobile/src/app/**/*.spec.md does not declare any packages/fe-mo-ui/src/screen/** target",
	);
}

const screenIndex = fs.existsSync(screenIndexPath)
	? readFile(screenIndexPath)
	: "";
const rootUiIndex = fs.existsSync(rootUiIndexPath) ? readFile(rootUiIndexPath) : "";

if (!fs.existsSync(screenIndexPath)) {
	errors.push("packages/fe-mo-ui/src/screen/index.ts is missing");
}

if (!rootUiIndex.includes('export * from "./screen"')) {
	errors.push("packages/fe-mo-ui/src/index.ts does not export ./screen");
}

for (const target of targets.values()) {
	const absoluteTargetPath = path.join(rootDir, target.targetPath);
	const siblingSpecPath = absoluteTargetPath.replace(/\.tsx$/, ".spec.md");
	const expectedExport = `./${target.screenName}/${target.screenName}`;

	if (!fs.existsSync(absoluteTargetPath)) {
		errors.push(`${target.targetPath} is missing`);
	}

	if (!fs.existsSync(siblingSpecPath)) {
		errors.push(
			`${path.relative(rootDir, siblingSpecPath)} is missing for ${target.targetPath}`,
		);
	} else {
		const siblingSpec = readFile(siblingSpecPath);

		if (!/##\s+화면 스케치/.test(siblingSpec)) {
			errors.push(
				`${path.relative(
					rootDir,
					siblingSpecPath,
				)} does not include required "## 화면 스케치" section`,
			);
		}

		if (!siblingSpec.includes("```text")) {
			errors.push(
				`${path.relative(
					rootDir,
					siblingSpecPath,
				)} does not include a fenced text wireframe`,
			);
		}
	}

	if (!screenIndex.includes(expectedExport)) {
		errors.push(
			`packages/fe-mo-ui/src/screen/index.ts does not export ${expectedExport}`,
		);
	}
}

if (errors.length) {
	console.error("Mobile screen target check failed:");
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exit(1);
}

console.log(`Mobile screen target check passed (${targets.size} target(s)).`);
