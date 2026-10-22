"use client";

import { Chip } from "@cocrepo/ui";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import {
	type DolmenHealthStatus,
	type DolmenWikiIndexStatus,
	fetchDolmenHealthStatus,
	fetchDolmenWikiIndexStatus,
} from "../data/dolmenHealthClient";

const HEALTH_POLL_INTERVAL_MS = 12_000;

function createAgentStatusBarState() {
	return makeAutoObservable(
		{
			apiOnline: false,
			llmConfigured: false,
			wikiIndexStatus: null as DolmenWikiIndexStatus | null,
			applyHealthStatus(healthStatus: DolmenHealthStatus) {
				this.apiOnline = healthStatus.apiOnline;
				this.llmConfigured = healthStatus.llmConfigured;
			},
			applyWikiIndexStatus(wikiIndexStatus: DolmenWikiIndexStatus | null) {
				this.wikiIndexStatus = wikiIndexStatus;
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
		const refreshStatuses = () => {
			void fetchDolmenHealthStatus().then((healthStatus) =>
				agentStatusBarState.applyHealthStatus(healthStatus),
			);
			void fetchDolmenWikiIndexStatus().then((wikiIndexStatus) =>
				agentStatusBarState.applyWikiIndexStatus(wikiIndexStatus),
			);
		};
		refreshStatuses();
		const pollTimer = window.setInterval(
			refreshStatuses,
			HEALTH_POLL_INTERVAL_MS,
		);
		return () => window.clearInterval(pollTimer);
	}, [agentStatusBarState]);

	return (
		<div className="flex flex-wrap items-center gap-2">
			<Chip
				size="sm"
				variant="soft"
				color={agentStatusBarState.apiOnline ? "success" : "danger"}
			>
				{agentStatusBarState.apiOnline ? "API 연결됨" : "API 응답 없음"}
			</Chip>
			<Chip
				size="sm"
				variant="soft"
				color={agentStatusBarState.llmConfigured ? "success" : "warning"}
			>
				{agentStatusBarState.llmConfigured
					? "모델 준비 완료"
					: "모델 응답 대기 (공급자 상태)"}
			</Chip>
			{agentStatusBarState.wikiIndexStatus ? (
				<Chip size="sm" variant="soft" color="accent">
					위키 {agentStatusBarState.wikiIndexStatus.wikiSectionCount}절 색인 ·
					rev {agentStatusBarState.wikiIndexStatus.revision}
				</Chip>
			) : (
				<Chip size="sm" variant="soft" color="default">
					위키 색인 확인 중…
				</Chip>
			)}
		</div>
	);
});
