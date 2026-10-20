"use client";

import { Chip, Typography } from "@cocrepo/ui";
import {
	Activity,
	CheckCircle2,
	CircleDashed,
	Loader2,
	XCircle,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type {
	DolmenAgentActivity,
	DolmenChatEvidence,
} from "../data/dolmenChatClient";

type AgentStepStatus = "pending" | "active" | "done" | "error";

const AGENT_STEP_LABELS = [
	"질문 접수",
	"위키 검색",
	"근거 선별",
	"답변 생성",
] as const;

/** 활동 단계(phase)와 근거 유무로 4개 단계 각각의 표시 상태를 정한다. */
function deriveAgentStepStatuses(
	agentActivity: DolmenAgentActivity,
): AgentStepStatus[] {
	const hasSearchFinished = agentActivity.searchFinishedAtMs > 0;
	const hasGrounds = agentActivity.retrievedEvidence.length > 0;
	switch (agentActivity.phase) {
		case "searching":
			return ["done", "active", "pending", "pending"];
		case "generating":
			return ["done", "done", hasGrounds ? "done" : "error", "active"];
		case "done":
			return ["done", "done", hasGrounds ? "done" : "error", "done"];
		case "error":
			return [
				"done",
				hasSearchFinished ? "done" : "error",
				hasGrounds ? "done" : hasSearchFinished ? "error" : "pending",
				"error",
			];
	}
}

function extractEvidenceSectionLabel(evidenceSource: string): string {
	const sectionDelimiterIndex = evidenceSource.indexOf(" § ");
	return sectionDelimiterIndex < 0
		? evidenceSource
		: evidenceSource.slice(sectionDelimiterIndex + 3);
}

function formatElapsedSeconds(elapsedMs: number): string {
	return `${(elapsedMs / 1000).toFixed(1)}초`;
}

function AgentStepIcon({ stepStatus }: { stepStatus: AgentStepStatus }) {
	if (stepStatus === "done") {
		return <CheckCircle2 className="h-4 w-4 text-success" />;
	}
	if (stepStatus === "active") {
		return <Loader2 className="h-4 w-4 animate-spin text-accent" />;
	}
	if (stepStatus === "error") {
		return <XCircle className="h-4 w-4 text-danger" />;
	}
	return <CircleDashed className="h-4 w-4 text-foreground/30" />;
}

function EvidenceScoreRow({
	evidenceItem,
}: {
	evidenceItem: DolmenChatEvidence;
}) {
	const scorePercent = Math.max(
		0,
		Math.min(100, Math.round(evidenceItem.score * 100)),
	);
	return (
		<li className="flex flex-col gap-1">
			<div className="flex items-center justify-between gap-2 text-xs">
				<span className="truncate text-foreground/80">
					{extractEvidenceSectionLabel(evidenceItem.source)}
				</span>
				<span className="shrink-0 tabular-nums text-foreground/50">
					{evidenceItem.score.toFixed(2)}
				</span>
			</div>
			<div className="h-1.5 w-full overflow-hidden rounded-full bg-default">
				<div
					className="h-full rounded-full bg-accent transition-[width] duration-500"
					style={{ width: `${scorePercent}%` }}
				/>
			</div>
		</li>
	);
}

const AgentActivityCard = observer(function AgentActivityCard({
	agentActivity,
}: {
	agentActivity: DolmenAgentActivity;
}) {
	const stepStatuses = deriveAgentStepStatuses(agentActivity);
	const isInProgress =
		agentActivity.phase === "searching" || agentActivity.phase === "generating";
	const totalElapsedMs = agentActivity.finishedAtMs - agentActivity.startedAtMs;
	const searchElapsedMs =
		agentActivity.searchFinishedAtMs - agentActivity.startedAtMs;

	return (
		<li className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3">
			<div className="flex items-start justify-between gap-2">
				<Typography.Paragraph className="line-clamp-2 text-sm font-medium">
					Q. {agentActivity.questionText}
				</Typography.Paragraph>
				{isInProgress ? (
					<Chip size="sm" variant="soft" color="accent">
						진행 중
					</Chip>
				) : agentActivity.phase === "error" ? (
					<Chip size="sm" variant="soft" color="danger">
						실패
					</Chip>
				) : (
					<Chip size="sm" variant="soft" color="success">
						{formatElapsedSeconds(totalElapsedMs)}
					</Chip>
				)}
			</div>

			<ol className="flex items-center justify-between gap-1">
				{AGENT_STEP_LABELS.map((stepLabel, stepIndex) => (
					<li key={stepLabel} className="flex flex-1 items-center gap-1">
						<div className="flex flex-col items-center gap-1">
							<AgentStepIcon stepStatus={stepStatuses[stepIndex]} />
							<span className="whitespace-nowrap text-[10px] text-foreground/60">
								{stepLabel}
							</span>
						</div>
						{stepIndex < AGENT_STEP_LABELS.length - 1 ? (
							<div
								className={`mb-4 h-px flex-1 ${
									stepStatuses[stepIndex] === "done"
										? "bg-success/60"
										: "bg-border"
								}`}
							/>
						) : null}
					</li>
				))}
			</ol>

			{agentActivity.retrievedEvidence.length > 0 ? (
				<ul className="flex flex-col gap-2">
					{agentActivity.retrievedEvidence.slice(0, 3).map((evidenceItem) => (
						<EvidenceScoreRow
							key={evidenceItem.chunkId}
							evidenceItem={evidenceItem}
						/>
					))}
				</ul>
			) : null}

			<div className="text-[11px] text-foreground/55">
				{agentActivity.searchFinishedAtMs > 0 ? (
					<span>
						검색 {formatElapsedSeconds(searchElapsedMs)} · 근거{" "}
						{agentActivity.retrievedEvidence.length}개
					</span>
				) : (
					<span>위키에서 근거를 찾는 중…</span>
				)}
				{agentActivity.phase === "done" ? (
					<span> · 답변 {agentActivity.replyCharacterCount}자</span>
				) : null}
				{isInProgress && agentActivity.statusText.length > 0 ? (
					<p className="mt-1 flex items-center gap-1 text-warning">
						<Loader2 className="h-3 w-3 animate-spin" />
						{agentActivity.statusText}
					</p>
				) : null}
				{agentActivity.phase === "error" ? (
					<p className="mt-1 line-clamp-3 text-danger">
						{agentActivity.errorText}
					</p>
				) : null}
			</div>
		</li>
	);
});

export const AgentActivityPanel = observer(function AgentActivityPanel({
	agentActivities,
}: {
	agentActivities: DolmenAgentActivity[];
}) {
	const latestFirstActivities = [...agentActivities].reverse();

	return (
		<aside className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-4 lg:w-80">
			<div className="flex items-center gap-2">
				<Activity className="h-4 w-4 text-accent" />
				<Typography.Heading level={2} className="text-sm font-semibold">
					에이전트 활동
				</Typography.Heading>
				<span className="ml-auto text-xs text-foreground/50">
					{agentActivities.length}건
				</span>
			</div>

			{latestFirstActivities.length === 0 ? (
				<div className="flex flex-col gap-3 py-6 text-center">
					<Typography.Paragraph color="muted" className="text-xs">
						질문을 보내면 에이전트가 거치는 단계가 여기에 실시간으로 나타납니다.
					</Typography.Paragraph>
					<ol className="flex items-center justify-between gap-1 px-2">
						{AGENT_STEP_LABELS.map((stepLabel) => (
							<li key={stepLabel} className="flex flex-col items-center gap-1">
								<CircleDashed className="h-4 w-4 text-foreground/30" />
								<span className="whitespace-nowrap text-[10px] text-foreground/50">
									{stepLabel}
								</span>
							</li>
						))}
					</ol>
				</div>
			) : (
				<ol className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
					{latestFirstActivities.map((agentActivity) => (
						<AgentActivityCard
							key={agentActivity.activityId}
							agentActivity={agentActivity}
						/>
					))}
				</ol>
			)}
		</aside>
	);
});
