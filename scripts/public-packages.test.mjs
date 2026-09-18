import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import test from "node:test";

const repositoryRoot = resolve(import.meta.dirname, "..");

function runBoundaryCommand(...arguments_) {
	return spawnSync(
		process.execPath,
		["scripts/public-packages.mjs", ...arguments_],
		{
			cwd: repositoryRoot,
			encoding: "utf8",
		},
	);
}

test("allowlist 패키지는 공개 릴리즈 대상으로 승인한다", () => {
	const commandResult = runBoundaryCommand("assert-name", "@cocrepo/schema");
	assert.equal(commandResult.status, 0, commandResult.stderr);
});

test("allowlist 외 패키지는 공개 릴리즈를 거부한다", () => {
	const commandResult = runBoundaryCommand("assert-name", "@cocrepo/prisma");
	assert.notEqual(commandResult.status, 0);
	assert.match(commandResult.stderr, /allowlist 외 패키지/);
});

test("manifest와 tarball 및 Jenkins 공개 경계를 검증한다", () => {
	const commandResult = runBoundaryCommand("check");
	assert.equal(
		commandResult.status,
		0,
		`${commandResult.stdout}\n${commandResult.stderr}`,
	);
	assert.match(commandResult.stdout, /10개/);
});
