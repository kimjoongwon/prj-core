"use client";

import { Chip } from "@cocrepo/ui";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import {
	type DolmenHealthStatus,
	type DolmenResumeStatus,
	fetchDolmenHealthStatus,
	fetchDolmenResumeStatus,
} from "../data/dolmenHealthClient";

const HEALTH_POLL_INTERVAL_MS = 12_000;

export function createAgentStatusBarState() {
	let isActive = false;
	let isRefreshPending = false;
	let refreshSequence = 0;
	return makeAutoObservable(
		{
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
			get resumeStatusColor(): "success" | "warning" | "danger" | "default" {
				if (!this.resumeStatus) return "default";
				if (this.resumeStatus.state === "ready") return "success";
				if (this.resumeStatus.state === "unavailable") return "danger";
				return "warning";
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
		{ autoBind: true, name: "AgentStatusBarState" },
	);
}

export type AgentStatusBarState = ReturnType<typeof createAgentStatusBarState>;

export const AgentStatusBar = observer(function AgentStatusBar() {
	const agentStatusBarState = useLocalObservable(() =>
		createAgentStatusBarState(),
	);

	useEffect(() => {
		agentStatusBarState.activate();
		void agentStatusBarState.refreshStatuses();
		const pollTimer = window.setInterval(
			agentStatusBarState.refreshStatuses,
			HEALTH_POLL_INTERVAL_MS,
		);
		return () => {
			window.clearInterval(pollTimer);
			agentStatusBarState.dispose();
		};
	}, [agentStatusBarState]);

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Chip
				size="sm"
				variant="soft"
				color={
					!agentStatusBarState.hasCheckedHealth
						? "default"
						: agentStatusBarState.apiOnline
							? "success"
							: "danger"
				}
			>
				{!agentStatusBarState.hasCheckedHealth
					? "서비스 연결 확인 중…"
					: agentStatusBarState.apiOnline
						? "서비스 연결됨"
						: "서비스 연결 실패"}
			</Chip>
			<Chip
				size="sm"
				variant="soft"
				color={
					!agentStatusBarState.hasCheckedHealth
						? "default"
						: agentStatusBarState.llmConfigured
							? "success"
							: "warning"
				}
			>
				{!agentStatusBarState.hasCheckedHealth
					? "답변 설정 확인 중…"
					: agentStatusBarState.llmConfigured
						? "답변 연결 설정됨"
						: "답변 연결 설정 필요"}
			</Chip>
			<Chip
				size="sm"
				variant="soft"
				color={agentStatusBarState.resumeStatusColor}
			>
				{agentStatusBarState.resumeStatusLabel}
			</Chip>
		</div>
	);
});
