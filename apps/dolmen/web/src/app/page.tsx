"use client";

import { Alert, Container, Typography } from "@cocrepo/ui";
import { Landmark } from "lucide-react";
import { ChatPanel } from "../components/ChatPanel";

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
								MOMO 이력서 Q&A
							</Typography.Heading>
							<Typography.Paragraph color="muted" className="text-sm">
								면접관의 경력·프로젝트·기술·협업 질문에, MOMO가 등록된 이력서를
								근거로 답합니다.
							</Typography.Paragraph>
						</div>
					</div>
					</div>
					<Alert
						status="warning"
						description="이 서비스는 무료 AI 모델로 운영됩니다. 모델이 혼잡한 시간대에는 답변이 느려지거나 중간에 끊길 수 있으니 잠시 후 다시 질문해 주세요."
					/>
				</header>

			<ChatPanel />

			<footer className="flex flex-col gap-1 pb-4">
				<Typography.Paragraph color="muted" className="text-xs">
					MOMO는 등록된 이력서를 바탕으로 답하는 AI입니다. 답변의 이력서 출처를
					함께 확인해 주세요. 이력서에 없는 내용은 추측하지 않습니다.
				</Typography.Paragraph>
				<Typography.Paragraph color="muted" className="text-xs">
					이 사이트는 지원자가 직접 구축했습니다 — React · Next.js · FastAPI ·
					Google Gemini · Kubernetes.
				</Typography.Paragraph>
			</footer>
		</Container>
	);
}
