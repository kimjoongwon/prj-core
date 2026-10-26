const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { existsSync, mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const packageDirectory = path.resolve(__dirname, "..");
const repositoryDirectory = path.resolve(packageDirectory, "..", "..");
const commonTypeDirectory = path.join(
	repositoryDirectory,
	"packages",
	"common-type",
);

function packWorkspacePackage(workspacePackageDirectory, destinationDirectory) {
	const packOutput = execFileSync(
		"pnpm",
		["pack", "--pack-destination", destinationDirectory, "--json"],
		{ cwd: workspacePackageDirectory, encoding: "utf8" },
	);
	const { filename } = JSON.parse(packOutput);
	return path.isAbsolute(filename)
		? filename
		: path.join(destinationDirectory, filename);
}

test("CommonJS와 ESM export는 각각의 dist 산출물을 가리킨다", () => {
	const packageExports = require("../package.json").exports;

	assert.deepEqual(packageExports["."], {
		types: "./dist/index.d.ts",
		require: "./dist/index.js",
		import: "./dist/esm/index.js",
		default: "./dist/esm/index.js",
	});
	assert.deepEqual(packageExports["./auth/password-rules"], {
		types: "./dist/auth/password-rules.d.ts",
		require: "./dist/auth/password-rules.js",
		import: "./dist/esm/auth/password-rules.js",
		default: "./dist/esm/auth/password-rules.js",
	});
	assert.equal(
		existsSync(path.join(packageDirectory, "dist", "index.js")),
		true,
	);
	assert.equal(
		existsSync(path.join(packageDirectory, "dist", "esm", "package.json")),
		true,
	);
});

test("packed package는 CommonJS와 Node ESM 소비자에서 root와 브라우저 서브패스를 제공한다", () => {
	const temporaryDirectory = mkdtempSync(
		path.join(os.tmpdir(), "cocrepo-constant-package-"),
	);
	try {
		const commonTypeTarball = packWorkspacePackage(
			commonTypeDirectory,
			temporaryDirectory,
		);
		const constantTarball = packWorkspacePackage(
			packageDirectory,
			temporaryDirectory,
		);
		writeFileSync(
			path.join(temporaryDirectory, "package.json"),
			JSON.stringify({ private: true }),
		);
		execFileSync(
			"npm",
			[
				"install",
				"--ignore-scripts",
				"--no-audit",
				"--no-fund",
				"--no-package-lock",
				commonTypeTarball,
				constantTarball,
			],
			{ cwd: temporaryDirectory, stdio: "pipe" },
		);
		writeFileSync(
			path.join(temporaryDirectory, "consumer.cjs"),
			`
			const constant = require("@cocrepo/constant");
			const passwordRules = require("@cocrepo/constant/auth/password-rules");
			if (constant.PASSWORD_RULES !== passwordRules.PASSWORD_RULES) process.exit(1);
		`,
		);
		writeFileSync(
			path.join(temporaryDirectory, "consumer.mjs"),
			`
			import { PASSWORD_RULES } from "@cocrepo/constant";
			import { DEFAULT_PASSWORD_MIN_LENGTH } from "@cocrepo/constant/auth/password-rules";
			if (!PASSWORD_RULES.some(({ rule, label }) => rule === "minLength" && label.startsWith(String(DEFAULT_PASSWORD_MIN_LENGTH)))) process.exit(1);
		`,
		);

		execFileSync(process.execPath, ["consumer.cjs"], {
			cwd: temporaryDirectory,
			stdio: "pipe",
		});
		execFileSync(process.execPath, ["consumer.mjs"], {
			cwd: temporaryDirectory,
			stdio: "pipe",
		});
	} finally {
		rmSync(temporaryDirectory, { recursive: true, force: true });
	}
});

test("정리된 Admin 메뉴와 접근 제어는 유지한 화면만 노출한다", () => {
	const {
		ADMIN_NAV_ITEMS,
		ADMIN_PAGE_ACCESS_ITEMS,
		ADMIN_CRUD_BUNDLES,
		matchAdminPageAccessItem,
	} = require("../dist/index.js");
	assert.deepEqual(
		ADMIN_NAV_ITEMS.map(({ id }) => id),
		["dashboard", "users", "roles"],
	);
	assert.equal(ADMIN_PAGE_ACCESS_ITEMS.length, 7);
	assert.equal(matchAdminPageAccessItem("/roles/new")?.pageId, "roles:new");
	assert.equal(
		matchAdminPageAccessItem("/roles/role-id/edit")?.pageId,
		"roles:edit",
	);
	assert.equal(
		matchAdminPageAccessItem("/users/user-id")?.pageId,
		"users:detail",
	);
	for (const deletedPath of [
		"/abilities",
		"/actions",
		"/assets",
		"/inquiries",
		"/email-verifications",
		"/policies",
		"/routines",
		"/settings/auth",
		"/spaces",
		"/subjects",
		"/tasks",
		"/templates",
		"/tenant-access-requests",
		"/terms",
		"/timelines",
		"/translations",
		"/settings/auth/oidc-clients/client-id/edit",
		"/timelines/timeline-id/sessions/session-id/programs/program-id",
	]) {
		assert.equal(matchAdminPageAccessItem(deletedPath), undefined, deletedPath);
	}
	assert.ok(
		ADMIN_CRUD_BUNDLES.some(({ subject }) => subject === "entity:Ability"),
	);
});
