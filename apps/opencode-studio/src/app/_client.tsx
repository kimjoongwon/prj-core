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

	const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		studioStore.setPrompt(event.target.value);
	};

	const handleSubmit = () => {
		void studioStore.submitPrompt();
	};

	const activeRun = studioStore.activeRun;

	return (
		<main className="mx-auto min-h-screen w-full max-w-[1500px] p-4 md:p-6">
			<header className="mb-4 rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm backdrop-blur md:p-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-sm font-medium text-[var(--studio-muted)]">
							OpenCode Studio
						</p>
						<h1 className="text-2xl font-extrabold tracking-tight text-[var(--studio-ink)] md:text-3xl">
							Subagent + Skill Visual Playground
						</h1>
					</div>
					<div className="rounded-full border border-[var(--studio-border)] bg-white px-3 py-1 text-sm">
						{studioStore.streamConnected
							? "live connected"
							: "stream reconnecting"}
					</div>
				</div>
			</header>

			<section className="grid gap-4 lg:grid-cols-[320px_1fr_380px]">
				<div className="space-y-4">
					<AgentCard run={activeRun} />
					<PromptCard
						prompt={studioStore.prompt}
						onPromptChange={handlePromptChange}
						onSubmit={handleSubmit}
						isSubmitting={studioStore.isSubmitting}
					/>
					<RunList
						runs={studioStore.runs}
						activeRunId={studioStore.activeRunId}
						onSelect={studioStore.setActiveRun}
					/>
				</div>

				<div className="rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm backdrop-blur">
					<h2 className="mb-3 text-lg font-bold">Execution Timeline</h2>
					<EventTimeline run={activeRun} />
				</div>

				<div className="space-y-4">
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

function PromptCard({
	prompt,
	onPromptChange,
	onSubmit,
	isSubmitting,
}: {
	prompt: string;
	onPromptChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onSubmit: () => void;
	isSubmitting: boolean;
}) {
	return (
		<div className="rounded-3xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-4 shadow-sm">
			<p className="mb-2 text-sm font-semibold text-[var(--studio-muted)]">
				Chat Prompt
			</p>
			<textarea
				className="min-h-32 w-full resize-y rounded-2xl border border-[var(--studio-border)] bg-white p-3 text-sm outline-none focus:border-blue-300"
				value={prompt}
				onChange={onPromptChange}
				placeholder="Try: be-seed-maker로 현실 시드데이터 생성"
			/>
			<button
				type="button"
				onClick={onSubmit}
				disabled={isSubmitting}
				className="mt-3 w-full rounded-2xl bg-[var(--studio-ink)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
			>
				{isSubmitting ? "running..." : "Run with OpenCode"}
			</button>
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
		<div className="max-h-[74vh] space-y-2 overflow-auto pr-1">
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
					<pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-2 text-xs text-slate-700">
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
