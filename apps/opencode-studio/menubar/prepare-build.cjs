const fs = require("node:fs");
const path = require("node:path");

const appRoot = path.resolve(__dirname, "..");
const buildRoot = path.join(appRoot, "dist-electron-app");

const sourcePaths = {
	main: path.join(appRoot, "menubar", "main.cjs"),
	standalone: path.join(appRoot, ".next", "standalone"),
	static: path.join(appRoot, ".next", "static"),
	public: path.join(appRoot, "public"),
};

run();

function run() {
	assertRequiredSource(sourcePaths.main, "menubar/main.cjs");
	assertRequiredSource(sourcePaths.standalone, ".next/standalone");
	assertRequiredSource(sourcePaths.static, ".next/static");

	fs.rmSync(buildRoot, { recursive: true, force: true });
	fs.mkdirSync(buildRoot, { recursive: true });

	copyFile(sourcePaths.main, path.join(buildRoot, "main.cjs"));
	copyDirectory(sourcePaths.standalone, path.join(buildRoot, ".next", "standalone"));
	copyDirectory(sourcePaths.static, path.join(buildRoot, ".next", "static"));

	if (fs.existsSync(sourcePaths.public)) {
		copyDirectory(sourcePaths.public, path.join(buildRoot, "public"));
	}

	repairBrokenTopLevelPackageLinks(
		path.join(buildRoot, ".next", "standalone", "node_modules"),
	);

	writeAppPackageJson();

	process.stdout.write(
		`Prepared Electron app directory: ${path.relative(appRoot, buildRoot)}\n`,
	);
}

function assertRequiredSource(targetPath, label) {
	if (fs.existsSync(targetPath)) {
		return;
	}

	throw new Error(`${label} is missing. Run \`pnpm --filter=opencode-studio build\` first.`);
}

function copyDirectory(from, to) {
	fs.mkdirSync(path.dirname(to), { recursive: true });
	fs.cpSync(from, to, { recursive: true });
}

function copyFile(from, to) {
	fs.mkdirSync(path.dirname(to), { recursive: true });
	fs.copyFileSync(from, to);
}

function writeAppPackageJson() {
	const packageJsonPath = path.join(buildRoot, "package.json");
	const packageJson = {
		name: "opencode-studio-menubar",
		private: true,
		version: "0.0.0",
		main: "main.cjs",
		description: "OpenCode Studio menu bar app",
		author: "cocrepo",
	};

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");
}

function repairBrokenTopLevelPackageLinks(nodeModulesPath) {
	if (!fs.existsSync(nodeModulesPath)) {
		return;
	}

	const entries = fs.readdirSync(nodeModulesPath, { withFileTypes: true });
	for (const entry of entries) {
		if (entry.name.startsWith(".")) {
			continue;
		}

		const entryPath = path.join(nodeModulesPath, entry.name);
		const stats = fs.lstatSync(entryPath);
		if (!stats.isSymbolicLink()) {
			continue;
		}

		const targetPath = fs.readlinkSync(entryPath);
		const absoluteTargetPath = path.resolve(nodeModulesPath, targetPath);
		if (fs.existsSync(absoluteTargetPath)) {
			continue;
		}

		const replacementPath = findStorePackagePath(nodeModulesPath, entry.name);
		if (!replacementPath) {
			continue;
		}

		const existingStats = fs.lstatSync(entryPath);
		if (existingStats.isSymbolicLink() || existingStats.isFile()) {
			fs.unlinkSync(entryPath);
		} else {
			fs.rmSync(entryPath, { recursive: true, force: true });
		}

		const relativeTarget = path.relative(path.dirname(entryPath), replacementPath);
		fs.symlinkSync(relativeTarget, entryPath, "dir");
	}
}

function findStorePackagePath(nodeModulesPath, packageName) {
	const storePath = path.join(nodeModulesPath, ".pnpm");
	if (!fs.existsSync(storePath)) {
		return "";
	}

	const packagePrefix = `${packageName}@`;
	const storeEntries = fs
		.readdirSync(storePath, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && entry.name.startsWith(packagePrefix))
		.map((entry) => entry.name)
		.sort((a, b) => b.localeCompare(a));

	for (const storeEntry of storeEntries) {
		const candidate = path.join(
			storePath,
			storeEntry,
			"node_modules",
			packageName,
		);
		if (fs.existsSync(candidate)) {
			return candidate;
		}
	}

	return "";
}
