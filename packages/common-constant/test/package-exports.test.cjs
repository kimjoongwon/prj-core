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
		types: "./dist/auth/password-rules.d.ts",
		require: "./dist/auth/password-rules.js",
		default: "./dist/auth/password-rules.js",
	});
	assert.equal(
		require.resolve("@cocrepo/constant"),
		path.resolve(__dirname, "..", "dist", "index.js"),
	);
	assert.equal(rootConstant.PASSWORD_RULES, authPasswordRules.PASSWORD_RULES);
});
