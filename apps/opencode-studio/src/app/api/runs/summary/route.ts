import { runManager } from "@/lib/run-manager";
import type { StudioRun } from "@/lib/types";

export const runtime = "nodejs";

const ACTIVE_SUBAGENT_GRACE_MS = 6000;

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
	const callState = new Map<
		string,
		{
			state: "running" | "completed" | "failed";
			changedAt: number;
		}
	>();

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
				callState.set(key, { state: "running", changedAt: event.timestamp });
				continue;
			}

			if (event.type === "subagent.completed") {
				callState.set(key, {
					state: "completed",
					changedAt: event.timestamp,
				});
				continue;
			}

			callState.set(key, { state: "failed", changedAt: event.timestamp });
		}
	}

	const now = Date.now();
	let activeCount = 0;
	for (const entry of callState.values()) {
		if (entry.state === "running") {
			activeCount += 1;
			continue;
		}

		if (now - entry.changedAt <= ACTIVE_SUBAGENT_GRACE_MS) {
			activeCount += 1;
		}
	}

	return activeCount;
}
