import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import test from "node:test";

const repositoryRoot = resolve(import.meta.dirname, "..");

function runReadiness(...arguments_) {
	return spawnSync(
		process.execPath,
		["scripts/public-release-readiness.mjs", ...arguments_],
		{
			cwd: repositoryRoot,
			encoding: "utf8",
			env: { ...process.env, PUBLIC_RELEASE_ROTATION_CONFIRMED: "false" },
		},
	);
}

test("비파괴 history precheck는 비밀값 없이 ref와 경로 개수만 보고한다", () => {
	const commandResult = runReadiness("precheck");
	assert.equal(commandResult.status, 0, commandResult.stderr);
	assert.match(
		commandResult.stdout,
		/branches=\d+, tags=\d+, 제거 대상 경로=\d+\/\d+/,
	);
	assert.doesNotMatch(commandResult.stdout, /password|secret|token|@/i);
});

test("credential rotation 확인 전 rewrite 준비를 거부한다", () => {
	const commandResult = runReadiness("rewrite-precheck");
	assert.notEqual(commandResult.status, 0);
	assert.match(commandResult.stderr, /폐기·재발급/);
});

test("현재 저장소를 fresh clone으로 오인하지 않는다", () => {
	const commandResult = runReadiness("scan-fresh-clone", repositoryRoot);
	assert.notEqual(commandResult.status, 0);
	assert.match(commandResult.stderr, /현재 작업 저장소/);
});
