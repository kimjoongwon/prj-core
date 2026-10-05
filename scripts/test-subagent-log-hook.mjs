import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";

const tempDirectory = mkdtempSync(join(tmpdir(), "subagent-log-hook-"));
const logger = resolve("scripts/log-subagent-event.mjs");
const sessionId = "thr_test";

try {
	const cases = [
		{
			event: "PreToolUse",
			payload: {
				session_id: sessionId,
				tool_name: "Agent",
				tool_use_id: "call_1",
				tool_input: { message: "worker task", agent_type: "fe-form-agent" },
			},
		},
		{
			event: "SubagentStop",
			payload: {
				session_id: sessionId,
				agent_id: "agent_1",
				agent_type: "fe-form-agent",
				last_assistant_message: "## 작업 결과\n완료",
			},
		},
	];

	for (const testCase of cases) {
		const result = spawnSync(process.execPath, [logger, testCase.event], {
			input: JSON.stringify(testCase.payload),
			encoding: "utf8",
			env: { ...process.env, CODEX_AGENT_LOG_DIR: tempDirectory },
		});
		assert.equal(result.status, 0, result.stderr);
		assert.deepEqual(JSON.parse(result.stdout), {});
	}

	const logPath = join(tempDirectory, `${sessionId}.jsonl`);
	const records = readFileSync(logPath, "utf8")
		.trim()
		.split("\n")
		.map((line) => JSON.parse(line));

	assert.equal(records.length, cases.length);
	assert.deepEqual(
		records.map((record) => record.event),
		cases.map((testCase) => testCase.event),
	);
	assert.deepEqual(records[0].payload.tool_input, cases[0].payload.tool_input);
	assert.equal(records[1].payload.last_assistant_message, cases[1].payload.last_assistant_message);
	assert.equal(statSync(tempDirectory).mode & 0o777, 0o700);
	assert.equal(statSync(logPath).mode & 0o777, 0o600);

	console.log("Subagent logging Hook test passed.");
} finally {
	rmSync(tempDirectory, { recursive: true, force: true });
}
