import { runManager } from "@/lib/run-manager";
import type { StudioRun } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
	const runs = runManager.listRuns();

	return Response.json({
		totalRuns: runs.length,
		runningRuns: runs.filter((run) => run.status === "running").length,
		failedRuns: runs.filter((run) => run.status === "failed").length,
		activeSubagentCalls: countActiveSubagentCalls(runs),
		updatedAt: Date.now(),
	});
}

function countActiveSubagentCalls(runs: StudioRun[]) {
	const callState = new Map<string, "running" | "completed" | "failed">();

	for (const run of runs) {
		for (const event of run.events) {
			if (
				event.type !== "subagent.started" &&
				event.type !== "subagent.completed" &&
				event.type !== "subagent.failed"
			) {
				continue;
			}

			const callId = String(event.payload.callId ?? "").trim();
			if (!callId) {
				continue;
			}

			const key = `${run.id}:${callId}`;
			if (event.type === "subagent.started") {
				callState.set(key, "running");
				continue;
			}

			if (event.type === "subagent.completed") {
				callState.set(key, "completed");
				continue;
			}

			callState.set(key, "failed");
		}
	}

	let activeCount = 0;
	for (const state of callState.values()) {
		if (state === "running") {
			activeCount += 1;
		}
	}

	return activeCount;
}
