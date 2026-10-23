"use client";

import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import type { DolmenAgentActivity } from "../data/dolmenChatClient";
import { serializeDolmenDiagnostics } from "../data/dolmenDiagnostics";
import {
	type DolmenHealthStatus,
	type DolmenResumeStatus,
	fetchDolmenHealthStatus,
	fetchDolmenResumeStatus,
} from "../data/dolmenHealthClient";
import { DeveloperDataPanel } from "./DeveloperDataPanel";
import { DeveloperOverviewPanel } from "./DeveloperOverviewPanel";
import { DeveloperRequestCard } from "./DeveloperRequestCard";
import { DeveloperSampleQuestions } from "./DeveloperSampleQuestions";

const HEALTH_POLL_INTERVAL_MS = 12_000;

export function createDeveloperDebugPanelState() {
	let isActive = false;
	let isRefreshPending = false;
	let refreshSequence = 0;
	return makeAutoObservable(
		{
			exportMessage: "",
			apiOnline: false,
			llmConfigured: false,
			hasCheckedHealth: false,
			resumeStatus: null as DolmenResumeStatus | null,
			get resumeStatusLabel(): string {
				if (!this.resumeStatus) return "이력서 확인 중…";
				switch (this.resumeStatus.state) {
					case "ready":
						return `${this.resumeStatus.candidateName ? `${this.resumeStatus.candidateName}님 ` : ""}이력서 준비됨 · 근거 ${this.resumeStatus.sectionCount}개`;
					case "unregistered":
						return "이력서 등록 안 됨";
					case "not-ready":
						return "이력서 준비 실패";
					default:
						return "이력서 상태 확인 실패";
				}
			},
			exportDiagnostics(activities: DolmenAgentActivity[]) {
				let objectUrl: string | undefined;
				try {
					const payload = serializeDolmenDiagnostics(activities);
					objectUrl = URL.createObjectURL(
						new Blob([payload], { type: "application/json;charset=utf-8" }),
					);
					const downloadLink = document.createElement("a");
					downloadLink.href = objectUrl;
					downloadLink.download = "dolmen-browser-diagnostics.json";
					downloadLink.click();
					this.exportMessage = "현재 브라우저 진단 JSON을 저장했습니다.";
				} catch {
					this.exportMessage = "진단 JSON을 저장하지 못했습니다.";
				} finally {
					if (objectUrl) URL.revokeObjectURL(objectUrl);
				}
			},
			activate() {
				isActive = true;
			},
			dispose() {
				isActive = false;
				isRefreshPending = false;
				refreshSequence += 1;
			},
			applyHealthStatus(healthStatus: DolmenHealthStatus) {
				this.apiOnline = healthStatus.apiOnline;
				this.llmConfigured = healthStatus.llmConfigured;
				this.hasCheckedHealth = true;
			},
			applyResumeStatus(resumeStatus: DolmenResumeStatus) {
				this.resumeStatus = resumeStatus;
			},
			async refreshStatuses() {
				if (!isActive || isRefreshPending) return;
				isRefreshPending = true;
				const requestSequence = ++refreshSequence;
				const canApplyStatus = () =>
					isActive && requestSequence === refreshSequence;
				try {
					await Promise.all([
						fetchDolmenHealthStatus().then((healthStatus) => {
							if (canApplyStatus()) this.applyHealthStatus(healthStatus);
						}),
						fetchDolmenResumeStatus().then((resumeStatus) => {
							if (canApplyStatus()) this.applyResumeStatus(resumeStatus);
						}),
					]);
				} finally {
					if (requestSequence === refreshSequence) isRefreshPending = false;
				}
			},
		},
		{},
		{ autoBind: true, name: "DeveloperDebugPanelState" },
	);
}

export type DeveloperDebugPanelState = ReturnType<
	typeof createDeveloperDebugPanelState
>;

export const DeveloperDebugPanel = observer(function DeveloperDebugPanel({
	agentActivities,
	isChatPending = false,
	onRunSampleQuestion,
	onJudgeActivity,
	onCancelJudge,
}: {
	agentActivities: DolmenAgentActivity[];
	isChatPending?: boolean;
	onRunSampleQuestion?: (question: string) => void;
	onJudgeActivity?: (activityId: string) => void;
	onCancelJudge?: (activityId: string) => void;
}) {
	const developerDebugPanelState = useLocalObservable(() =>
		createDeveloperDebugPanelState(),
	);

	useEffect(() => {
		developerDebugPanelState.activate();
		void developerDebugPanelState.refreshStatuses();
		const pollTimer = window.setInterval(
			developerDebugPanelState.refreshStatuses,
			HEALTH_POLL_INTERVAL_MS,
		);
		return () => {
			window.clearInterval(pollTimer);
			developerDebugPanelState.dispose();
		};
	}, [developerDebugPanelState]);

	const registeredData = (
		<details open className="min-w-0 rounded-xl border border-border p-3">
			<summary className="cursor-pointer text-sm font-semibold">
				등록 데이터
			</summary>
			<div className="mt-3 space-y-2 text-xs">
				<p>
					{!developerDebugPanelState.hasCheckedHealth
						? "API 연결 미확인"
						: developerDebugPanelState.apiOnline
							? "API 연결됨"
							: "API 연결 실패"}
				</p>
				<p>
					{!developerDebugPanelState.hasCheckedHealth
						? "모델 설정 미확인"
						: developerDebugPanelState.llmConfigured
							? "모델 설정됨"
							: "모델 설정 필요"}
				</p>
				<output className="block">
					{developerDebugPanelState.resumeStatusLabel}
				</output>
				<DeveloperDataPanel
					resumeStatus={developerDebugPanelState.resumeStatus}
				/>
			</div>
		</details>
	);
	const requestRecords = (
		<section aria-label="요청 기록" className="min-w-0 space-y-3">
			<h3 className="px-1 text-sm font-semibold">요청 기록</h3>
			{agentActivities.length === 0 ? (
				<p className="px-1 text-xs text-foreground/60">
					아직 요청이 없습니다. 질문을 보내면 수신한 이벤트를 기록합니다.
				</p>
			) : (
				[...agentActivities]
					.reverse()
					.map((activity, activityIndex) => (
						<DeveloperRequestCard
							key={activity.activityId}
							activity={activity}
							isLatest={activityIndex === 0}
							onJudgeActivity={onJudgeActivity}
							onCancelJudge={onCancelJudge}
						/>
					))
			)}
		</section>
	);

	return (
		<aside
			aria-label="개발자 디버그"
			className="flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface/70 lg:max-h-[calc(100dvh-250px)] lg:w-[360px] lg:shrink-0"
		>
			<header className="border-b border-border p-4">
				<h2 className="text-sm font-semibold">개발자 디버그</h2>
				<p className="mt-1 text-xs text-foreground/60">
					등록 데이터와 실제 수신한 처리 기록입니다. 모델의 내부 추론은 표시하지
					않습니다.
				</p>
			</header>
			<div className="max-h-[75dvh] min-h-0 min-w-0 space-y-3 overflow-y-auto overscroll-contain p-3">
				<DeveloperOverviewPanel activities={agentActivities} />
				<details className="rounded-xl border border-border p-3 text-xs">
					<summary className="cursor-pointer font-semibold">
						진단 JSON 내보내기
					</summary>
					<p className="mt-2 text-foreground/60">
						현재 브라우저 요청의 관측·컨텍스트·평가만 저장합니다. 질문·답변
						원문과 세션 ID는 제외합니다.
					</p>
					<button
						type="button"
						className="mt-2 rounded-lg border border-border px-3 py-1.5 disabled:opacity-50"
						disabled={agentActivities.length === 0}
						onClick={() =>
							developerDebugPanelState.exportDiagnostics(agentActivities)
						}
					>
						JSON 저장
					</button>
					{developerDebugPanelState.exportMessage ? (
						<output className="mt-2 block">
							{developerDebugPanelState.exportMessage}
						</output>
					) : null}
				</details>
				{agentActivities.length > 0 ? requestRecords : null}
				<DeveloperSampleQuestions
					isAvailable={
						developerDebugPanelState.resumeStatus?.state === "ready" &&
						!!developerDebugPanelState.resumeStatus.debug
					}
					isChatPending={isChatPending}
					onRunSampleQuestion={onRunSampleQuestion}
				/>
				{registeredData}
				{agentActivities.length === 0 ? requestRecords : null}
			</div>
		</aside>
	);
});

DeveloperDebugPanel.displayName = "DeveloperDebugPanel";
