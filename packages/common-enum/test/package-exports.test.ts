import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("CommonJS 소비는 빌드된 enum과 브라우저 안전 Prisma enum 진입점을 사용한다", () => {
	const loadedEnums = JSON.parse(
		execFileSync(
			process.execPath,
			[
				"--eval",
				'const enums = require("@cocrepo/enum"); console.log(JSON.stringify({entry: require.resolve("@cocrepo/enum"), image: enums.AssetKind.IMAGE, clientLoaded: Object.keys(require.cache).some(path => /generated\\/client\\/(client|internal)\\b/.test(path))}));',
			],
			{ cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8" },
		),
	);
	assert.ok(loadedEnums.entry.endsWith("/dist/index.js"));
	assert.equal(loadedEnums.image, "IMAGE");
	assert.equal(loadedEnums.clientLoaded, false);
});
