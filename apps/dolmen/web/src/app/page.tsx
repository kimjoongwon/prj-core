"use client";

import { Chip, Container, Typography } from "@cocrepo/ui";
import { Landmark } from "lucide-react";
import { AgentStatusBar } from "@/components/AgentStatusBar";
import { ChatPanel } from "@/components/ChatPanel";

const TECH_HIGHLIGHTS = [
	"hello-agents 에이전트",
	"RAG · 절 단위 구조 청킹",
	"로컬 임베딩(MiniLM 다국어)",
	"근거 유사도 노출",
	"SSE 실시간 스트리밍",
];

export default function Page() {
	return (
		<Container className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 px-4 py-8">
			<header className="flex flex-col gap-4">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
							<Landmark className="h-6 w-6" />
						</div>
						<div className="flex flex-col gap-0.5">
							<Typography.Heading level={1} weight="bold" className="text-2xl">
								Dolmen
							</Typography.Heading>
							<Typography.Paragraph color="muted" className="text-sm">
								위키를 읽고 근거와 함께 답하는 에이전트 — 검색과 판단 과정이
								그대로 보입니다.
							</Typography.Paragraph>
						</div>
					</div>
					<AgentStatusBar />
				</div>
				<div className="flex flex-wrap gap-2">
					{TECH_HIGHLIGHTS.map((techHighlight) => (
						<Chip key={techHighlight} size="sm" variant="soft" color="default">
							{techHighlight}
						</Chip>
					))}
				</div>
			</header>

			<ChatPanel />

			<footer className="pb-4">
				<Typography.Paragraph color="muted" className="text-xs">
					데모 문서: 가상의 피트니스 예약 스타트업 「모아핏」 온보딩 위키(실제
					회사 아님). 답변의 근거 절·유사도는 검색 결과를 그대로 보여줍니다.
				</Typography.Paragraph>
			</footer>
		</Container>
	);
}
