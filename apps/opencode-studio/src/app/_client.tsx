"use client";

import { observer } from "mobx-react-lite";
import { type ChangeEvent, useEffect } from "react";
import type { StudioEvent, StudioRun } from "@/lib/types";
import { studioStore } from "@/stores/StudioStore";

const EVENT_COLOR: Record<StudioEvent["type"], string> = {
	"run.started": "bg-blue-100 text-blue-800",
	"run.completed": "bg-emerald-100 text-emerald-700",
	"run.failed": "bg-rose-100 text-rose-700",
	"tool.call.started": "bg-violet-100 text-violet-700",
	"tool.call.completed": "bg-indigo-100 text-indigo-700",
	"tool.call.failed": "bg-red-100 text-red-700",
	"subagent.started": "bg-amber-100 text-amber-700",
	"subagent.completed": "bg-teal-100 text-teal-700",
	"subagent.failed": "bg-orange-100 text-orange-700",
	"skill.loaded": "bg-cyan-100 text-cyan-700",
};

const STATUS_FACE: Record<string, string> = {
	running: "(o w o)",
	completed: "(=^_^=)",
	failed: "(T_T)",
};

export const StudioClient = observer(() => {
	useEffect(() => {
		studioStore.connectStream();
		return () => {
			studioStore.disconnectStream();
		};
	}, []);

	const activeRun = studioStore.activeRun;
	const filteredRuns = studioStore.filteredRuns;

	const handleTerminalFilter = (event: ChangeEvent<HTMLSelectElement>) => {
		studioStore.setTerminalFilter(event.target.value);
	};

	return (
		<main className="mx-auto min-h-screen w-full max-w-[1500px] p-4 md:p-6">
			<header className="mb-4 rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm backdrop-blur md:p-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-sm font-medium text-[var(--studio-muted)]">
							OpenCode Studio
						</p>
						<h1 className="text-2xl font-extrabold tracking-tight text-[var(--studio-ink)] md:text-3xl">
							Terminal Subagent Visual Monitor
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
			</header>

			<CharacterStage
				runs={filteredRuns}
				availableSubagents={studioStore.availableSubagents}
			/>

			<section className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)_minmax(0,380px)]">
				<div className="min-w-0 space-y-4">
					<AgentCard run={activeRun} />
					<TerminalBindingPanel />
					<RunList
						runs={filteredRuns}
						activeRunId={studioStore.activeRunId}
						onSelect={studioStore.setActiveRun}
					/>
				</div>

				<div className="min-w-0 overflow-hidden rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm backdrop-blur">
					<h2 className="mb-3 text-lg font-bold">Execution Timeline</h2>
					<EventTimeline run={activeRun} />
				</div>

				<div className="min-w-0 space-y-4">
					<InspectorCard run={activeRun} />
					<SkillPanel run={activeRun} />
				</div>
			</section>
		</main>
	);
});

function AgentCard({ run }: { run?: StudioRun }) {
	const status = run?.status ?? "running";
	const face = STATUS_FACE[status] ?? "(o w o)";
	const statusText = status === "running" ? "thinking..." : status;

	return (
		<div className="rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel-strong)] p-4 shadow-sm">
			<p className="text-sm font-semibold text-[var(--studio-muted)]">
				Agent Buddy
			</p>
			<div className="mt-2 flex items-center gap-3 rounded-2xl bg-[var(--studio-blue)]/35 p-3">
				<div className="studio-float flex size-14 items-center justify-center rounded-full bg-white text-lg font-extrabold shadow-sm">
					{face}
				</div>
				<div>
					<p className="font-bold">Kkumi Agent</p>
					<p className="text-sm text-[var(--studio-muted)]">{statusText}</p>
				</div>
			</div>
		</div>
	);
}

function TerminalBindingPanel() {
	const handleBind = (runId: string, event: ChangeEvent<HTMLSelectElement>) => {
		studioStore.bindRunTerminal(runId, event.target.value);
	};

	return (
		<div className="rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm">
			<p className="mb-2 text-sm font-semibold text-[var(--studio-muted)]">
				Terminal Mapping
			</p>
			<div className="max-h-60 space-y-2 overflow-auto pr-1 text-xs">
				{studioStore.runs.map((run) => (
					<div key={run.id} className="rounded-xl bg-white p-2">
						<p className="truncate font-medium">{run.prompt}</p>
						<select
							value={studioStore.getRunTerminal(run.id)}
							onChange={(event) => handleBind(run.id, event)}
							className="mt-1 w-full rounded-lg border border-[var(--studio-border)] px-2 py-1 text-xs"
						>
							<option value="">unassigned</option>
							{studioStore.terminals.map((terminal) => (
								<option key={terminal} value={terminal}>
									{terminal}
								</option>
							))}
						</select>
					</div>
				))}
				{studioStore.runs.length === 0 ? (
					<p className="rounded-xl bg-white p-2 text-[var(--studio-muted)]">
						세션이 감지되면 터미널에 매핑할 수 있어요.
					</p>
				) : null}
			</div>
		</div>
	);
}

function RunList({
	runs,
	activeRunId,
	onSelect,
}: {
	runs: StudioRun[];
	activeRunId: string;
	onSelect: (runId: string) => void;
}) {
	return (
		<div className="rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm">
			<p className="mb-2 text-sm font-semibold text-[var(--studio-muted)]">
				Runs
			</p>
			<div className="max-h-72 space-y-2 overflow-auto pr-1">
				{runs.map((run) => {
					const active = activeRunId === run.id;
					const handleClick = () => {
						onSelect(run.id);
					};
					return (
						<button
							type="button"
							key={run.id}
							onClick={handleClick}
							className={`w-full rounded-2xl border p-3 text-left text-sm ${
								active
									? "border-blue-300 bg-blue-50"
									: "border-[var(--studio-border)] bg-white"
							}`}
						>
							<p className="truncate font-semibold">{run.prompt}</p>
							<p className="mt-1 text-xs text-[var(--studio-muted)]">
								{run.status}
							</p>
						</button>
					);
				})}
				{runs.length === 0 ? (
					<p className="rounded-2xl bg-white p-3 text-sm text-[var(--studio-muted)]">
						아직 실행 기록이 없어요.
					</p>
				) : null}
			</div>
		</div>
	);
}

function EventTimeline({ run }: { run?: StudioRun }) {
	if (!run) {
		return (
			<p className="text-sm text-[var(--studio-muted)]">
				Run을 시작하면 타임라인이 나타납니다.
			</p>
		);
	}

	return (
		<div className="max-h-[74vh] min-w-0 space-y-2 overflow-auto pr-1">
			{run.events.map((event) => (
				<div
					key={event.id}
					className="rounded-2xl border border-[var(--studio-border)] bg-white p-3"
				>
					<div className="flex items-center justify-between gap-2">
						<span
							className={`rounded-full px-2 py-0.5 text-xs font-semibold ${EVENT_COLOR[event.type]}`}
						>
							{event.type}
						</span>
						<span className="text-xs text-[var(--studio-muted)]">
							{new Date(event.timestamp).toLocaleTimeString()}
						</span>
					</div>
					<pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-2 text-xs text-slate-700">
						{JSON.stringify(event.payload, null, 2)}
					</pre>
				</div>
			))}
			{run.events.length === 0 ? (
				<p className="text-sm text-[var(--studio-muted)]">
					이 런에는 아직 이벤트가 없습니다.
				</p>
			) : null}
		</div>
	);
}

function InspectorCard({ run }: { run?: StudioRun }) {
	return (
		<div className="rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm">
			<h3 className="text-lg font-bold">Run Detail</h3>
			{run ? (
				<div className="mt-3 space-y-2 text-sm">
					<p>
						<span className="font-semibold">status:</span> {run.status}
					</p>
					<p>
						<span className="font-semibold">session:</span>{" "}
						{run.sessionId ?? "-"}
					</p>
					<p>
						<span className="font-semibold">events:</span> {run.events.length}
					</p>
					{run.error ? (
						<p className="rounded-xl bg-rose-50 p-2 text-rose-700">
							{run.error}
						</p>
					) : null}
					{run.resultText ? (
						<div>
							<p className="mb-1 font-semibold">assistant result</p>
							<pre className="max-h-56 overflow-auto rounded-xl bg-white p-3 text-xs">
								{run.resultText}
							</pre>
						</div>
					) : null}
				</div>
			) : (
				<p className="mt-3 text-sm text-[var(--studio-muted)]">
					선택된 런이 없습니다.
				</p>
			)}
		</div>
	);
}

function SkillPanel({ run }: { run?: StudioRun }) {
	const skills = (run?.events ?? []).filter(
		(event) => event.type === "skill.loaded",
	);
	return (
		<div className="rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm">
			<h3 className="text-lg font-bold">Skill Inspector</h3>
			<div className="mt-3 space-y-2 text-sm">
				{skills.map((event) => (
					<div key={event.id} className="rounded-xl bg-white p-3">
						<p className="font-semibold">
							{String(event.payload.skill ?? "unknown")}
						</p>
						<p className="text-xs text-[var(--studio-muted)]">
							{new Date(event.timestamp).toLocaleTimeString()}
						</p>
					</div>
				))}
				{skills.length === 0 ? (
					<p className="rounded-xl bg-white p-3 text-[var(--studio-muted)]">
						아직 로드된 skill이 없습니다.
					</p>
				) : null}
			</div>
		</div>
	);
}

function CharacterStage({
	runs,
	availableSubagents,
}: {
	runs: StudioRun[];
	availableSubagents: string[];
}) {
	const activityMap = collectSubagentActivity(runs);
	const allSubagents = mergeSubagentNames(
		availableSubagents,
		Array.from(activityMap.keys()),
	);
	const activityByKey = new Map(
		Array.from(activityMap.entries()).map(([name, value]) => [
			name.toLowerCase(),
			value,
		]),
	);
	const cards = allSubagents
		.map((name) => {
			const activeCount =
				activityByKey.get(name.toLowerCase())?.activeCount ?? 0;
			const sessions = activityByKey.get(name.toLowerCase())?.sessions ?? [];
			return { name, activeCount, sessions };
		})
		.sort(
			(a, b) => b.activeCount - a.activeCount || a.name.localeCompare(b.name),
		);

	const activeCount = cards.filter((item) => item.activeCount > 0).length;

	return (
		<section className="mb-4 rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-lg font-bold">Subagent Zoo</h2>
				<span className="rounded-full bg-[var(--studio-blue)]/35 px-2 py-0.5 text-xs font-semibold text-[var(--studio-ink)]">
					{activeCount}/{cards.length || 0} active
				</span>
			</div>
			{cards.length === 0 ? (
				<p className="rounded-2xl bg-white p-3 text-sm text-[var(--studio-muted)]">
					감지된 서브에이전트가 아직 없습니다.
				</p>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{cards.map((item) => {
						const active = item.activeCount > 0;
						const tone = toAgentTone(item.name);

						return (
							<div
								key={item.name}
								className={`rounded-2xl border p-3 transition-all duration-300 ${
									active
										? `${tone.activeCard} shadow-sm`
										: "border-slate-200 bg-slate-50/90"
								}`}
							>
								<div className="mb-2 flex items-center gap-2">
									<div
										className={`flex size-10 items-center justify-center rounded-full border text-xl transition-all duration-300 ${
											active
												? `studio-float ${tone.activeIcon}`
												: "border-slate-300 bg-slate-200"
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
											{active ? `${item.activeCount} running` : "standby"}
										</p>
									</div>
								</div>
								<p
									className={`rounded-xl px-2 py-1 text-xs font-semibold ${
										active
											? `studio-pulse ${tone.activeBadge}`
											: "bg-slate-200 text-slate-600"
									}`}
								>
									{active
										? `active in ${item.sessions.length} session`
										: "idle"}
								</p>
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
		{ state: string; agent: string; runId: string }
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

			callState.set(`${run.id}:${callId}`, { state, agent, runId: run.id });
		}
	}

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

		if (call.state === "running") {
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
