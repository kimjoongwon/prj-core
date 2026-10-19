"use client";

import { Container, Typography } from "@cocrepo/ui";
import { ChatPanel } from "@/components/ChatPanel";

export default function Page() {
	return (
		<Container className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-10">
			<header className="flex flex-col gap-2">
				<Typography.Heading level={1} weight="bold">
					Dolmen
				</Typography.Heading>
				<Typography.Paragraph color="muted">
					온보딩 위키를 읽고 질문에 답하며, 대화를 기억하는 에이전트 메모리·RAG
					학습 데모입니다.
				</Typography.Paragraph>
			</header>
			<ChatPanel />
		</Container>
	);
}
