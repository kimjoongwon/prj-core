const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

test("CommonJS root export resolves to the built package entry", () => {
	const packageExports = require("../package.json").exports;
	const rootConstant = require("@cocrepo/constant");
	const authPasswordRules = require("@cocrepo/constant/auth/password-rules");

	assert.deepEqual(packageExports["."], {
		types: "./src/index.ts",
		import: "./src/index.ts",
		require: "./dist/index.js",
		default: "./src/index.ts",
	});
	assert.deepEqual(packageExports["./auth/password-rules"], {
		types: "./src/auth/password-rules.ts",
		import: "./src/auth/password-rules.ts",
		require: "./dist/auth/password-rules.js",
		default: "./src/auth/password-rules.ts",
	});
	assert.equal(
		require.resolve("@cocrepo/constant"),
		path.resolve(__dirname, "..", "dist", "index.js"),
	);
	assert.equal(rootConstant.PASSWORD_RULES, authPasswordRules.PASSWORD_RULES);
});

test("ESM 비밀번호 규칙 진입점은 브라우저가 처리할 소스 모듈을 제공한다", () => {
	const { execFileSync } = require("node:child_process");
	const exportedPasswordRules = JSON.parse(
		execFileSync(
			process.execPath,
			[
				"--input-type=module",
				"--eval",
				'import { DEFAULT_PASSWORD_MIN_LENGTH, DEFAULT_PASSWORD_MAX_LENGTH } from "@cocrepo/constant/auth/password-rules"; console.log(JSON.stringify({minimum: DEFAULT_PASSWORD_MIN_LENGTH, maximum: DEFAULT_PASSWORD_MAX_LENGTH, entry: import.meta.resolve("@cocrepo/constant/auth/password-rules")}));',
			],
			{ cwd: path.resolve(__dirname, ".."), encoding: "utf8" },
		),
	);
	assert.equal(exportedPasswordRules.minimum, 10);
	assert.equal(exportedPasswordRules.maximum, 72);
	assert.ok(
		exportedPasswordRules.entry.endsWith("/src/auth/password-rules.ts"),
	);
});
