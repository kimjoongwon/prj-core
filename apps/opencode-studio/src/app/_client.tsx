"use client";

import { observer } from "mobx-react-lite";
import { type ChangeEvent, useEffect } from "react";
import type { StudioRun } from "@/lib/types";
import { studioStore } from "@/stores/StudioStore";

export const StudioClient = observer(() => {
	useEffect(() => {
		studioStore.connectStream();
		return () => {
			studioStore.disconnectStream();
		};
	}, []);

	const filteredRuns = studioStore.filteredRuns;

	const handleTerminalFilter = (event: ChangeEvent<HTMLSelectElement>) => {
		studioStore.setTerminalFilter(event.target.value);
	};

	return (
		<main className="mx-auto min-h-screen w-full max-w-[1100px] p-4 md:p-6">
			<header className="mb-4 rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm backdrop-blur md:p-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-sm font-medium text-[var(--studio-muted)]">
							OpenCode Studio
						</p>
						<h1 className="text-2xl font-extrabold tracking-tight text-[var(--studio-ink)] md:text-3xl">
							Subagent Live Monitor
						</h1>
					</div>
					<div className="flex items-center gap-2">
						<select
							value={studioStore.terminalFilterId}
							onChange={handleTerminalFilter}
							className="max-w-64 rounded-full border border-[var(--studio-border)] bg-white px-3 py-1 text-sm"
						>
							<option value="all">all terminals</option>
							{studioStore.terminals.map((terminal) => (
								<option key={terminal} value={terminal}>
									{terminal}
								</option>
							))}
						</select>
						<div className="rounded-full border border-[var(--studio-border)] bg-white px-3 py-1 text-sm">
							{studioStore.streamConnected
								? "live connected"
								: "stream reconnecting"}
						</div>
					</div>
				</div>
				{studioStore.runtimeIssue ? (
					<div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
						{studioStore.runtimeIssue}
					</div>
				) : null}
			</header>

			<SubagentPanel
				runs={filteredRuns}
				availableSubagents={studioStore.availableSubagents}
				selectedTerminal={studioStore.terminalFilterId}
			/>
		</main>
	);
});

function SubagentPanel({
	runs,
	availableSubagents,
	selectedTerminal,
}: {
	runs: StudioRun[];
	availableSubagents: string[];
	selectedTerminal: string;
}) {
	const activityMap = collectSubagentActivity(runs);
	const allSubagents = mergeSubagentNames(availableSubagents);
	const cards = allSubagents
		.map((name) => {
			const activity = activityMap.get(name) ?? {
				activeCount: 0,
				sessions: [],
			};
			return { name, activeCount: activity.activeCount };
		})
		.sort(
			(a, b) => b.activeCount - a.activeCount || a.name.localeCompare(b.name),
		);

	const totalActive = cards.reduce((sum, item) => sum + item.activeCount, 0);

	return (
		<section className="rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm">
			<div className="mb-3 flex flex-wrap items-center justify-between gap-2">
				<div>
					<h2 className="text-lg font-bold">Subagents</h2>
					<p className="text-sm text-[var(--studio-muted)]">
						Terminal: {selectedTerminal === "all" ? "all" : selectedTerminal}
					</p>
				</div>
				<span className="rounded-full bg-[var(--studio-blue)]/35 px-3 py-1 text-xs font-semibold text-[var(--studio-ink)]">
					{totalActive} parallel running
				</span>
			</div>

			{cards.length === 0 ? (
				<p className="rounded-2xl bg-white p-3 text-sm text-[var(--studio-muted)]">
					Subagent가 아직 감지되지 않았습니다.
				</p>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{cards.map((item) => {
						const active = item.activeCount > 0;
						const tone = toAgentTone(item.name);
						return (
							<div
								key={item.name}
								className={`rounded-2xl border p-3 ${
									active
										? `${tone.activeCard} shadow-sm`
										: "border-slate-200 bg-white"
								}`}
							>
								<div className="flex items-center gap-2">
									<div
										className={`flex size-10 items-center justify-center rounded-full border text-xl ${
											active ? tone.activeIcon : "border-slate-300 bg-slate-100"
										}`}
									>
										<span className={active ? "" : "grayscale"}>
											{toAgentMascot(item.name)}
										</span>
									</div>
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold">
											{item.name}
										</p>
										<p className="text-xs text-[var(--studio-muted)]">
											{active ? `${item.activeCount} running` : "idle"}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</section>
	);
}

function collectSubagentActivity(runs: StudioRun[]) {
	const callState = new Map<
		string,
		{ state: string; agent: string; runId: string; changedAt: number }
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

			const rawAgent = String(event.payload.agent ?? "task").trim();
			const agent = rawAgent && rawAgent !== "unknown" ? rawAgent : "task";
			const state =
				event.type === "subagent.started"
					? "running"
					: event.type === "subagent.completed"
						? "completed"
						: "failed";

			callState.set(`${run.id}:${callId}`, {
				state,
				agent,
				runId: run.id,
				changedAt: event.timestamp,
			});
		}
	}

	const RECENT_ACTIVE_GRACE_MS = 2500;
	const now = Date.now();

	const activity = new Map<
		string,
		{ activeCount: number; sessions: Set<string> }
	>();

	for (const call of callState.values()) {
		if (!activity.has(call.agent)) {
			activity.set(call.agent, { activeCount: 0, sessions: new Set<string>() });
		}

		const entry = activity.get(call.agent);
		if (!entry) {
			continue;
		}

		if (
			call.state === "running" ||
			(now - call.changedAt <= RECENT_ACTIVE_GRACE_MS &&
				(call.state === "completed" || call.state === "failed"))
		) {
			entry.activeCount += 1;
			entry.sessions.add(call.runId);
		}
	}

	const normalized = new Map<
		string,
		{ activeCount: number; sessions: string[] }
	>();
	for (const [agent, value] of activity.entries()) {
		normalized.set(agent, {
			activeCount: value.activeCount,
			sessions: Array.from(value.sessions),
		});
	}

	return normalized;
}

function mergeSubagentNames(...groups: string[][]) {
	const merged = new Map<string, string>();

	for (const group of groups) {
		for (const rawName of group) {
			const name = rawName.trim();
			if (!name) {
				continue;
			}

			const key = name.toLowerCase();
			if (!merged.has(key)) {
				merged.set(key, name);
			}
		}
	}

	return Array.from(merged.values());
}

function toAgentMascot(agentName: string) {
	const key = agentName.toLowerCase();

	if (key.startsWith("orch-")) {
		return "🐙";
	}
	if (key.startsWith("req-")) {
		return "🦉";
	}
	if (key.startsWith("be-")) {
		return "🐻";
	}
	if (key.startsWith("fe-")) {
		return "🦊";
	}
	if (key.startsWith("qa-")) {
		return "🐰";
	}
	if (key.startsWith("dev-")) {
		return "🐶";
	}
	if (key.startsWith("etc-")) {
		return "🐼";
	}

	return "🐱";
}

function toAgentTone(agentName: string) {
	const key = agentName.toLowerCase();

	if (key.startsWith("orch-")) {
		return {
			activeCard: "border-indigo-200 bg-gradient-to-br from-white to-indigo-50",
			activeIcon: "border-indigo-200 bg-indigo-100",
			activeBadge: "bg-indigo-100 text-indigo-700",
		};
	}

	if (key.startsWith("req-")) {
		return {
			activeCard: "border-amber-200 bg-gradient-to-br from-white to-amber-50",
			activeIcon: "border-amber-200 bg-amber-100",
			activeBadge: "bg-amber-100 text-amber-700",
		};
	}

	if (key.startsWith("be-")) {
		return {
			activeCard:
				"border-emerald-200 bg-gradient-to-br from-white to-emerald-50",
			activeIcon: "border-emerald-200 bg-emerald-100",
			activeBadge: "bg-emerald-100 text-emerald-700",
		};
	}

	if (key.startsWith("fe-")) {
		return {
			activeCard: "border-sky-200 bg-gradient-to-br from-white to-sky-50",
			activeIcon: "border-sky-200 bg-sky-100",
			activeBadge: "bg-sky-100 text-sky-700",
		};
	}

	if (key.startsWith("qa-")) {
		return {
			activeCard: "border-rose-200 bg-gradient-to-br from-white to-rose-50",
			activeIcon: "border-rose-200 bg-rose-100",
			activeBadge: "bg-rose-100 text-rose-700",
		};
	}

	return {
		activeCard: "border-cyan-200 bg-gradient-to-br from-white to-cyan-50",
		activeIcon: "border-cyan-200 bg-cyan-100",
		activeBadge: "bg-cyan-100 text-cyan-700",
	};
}
