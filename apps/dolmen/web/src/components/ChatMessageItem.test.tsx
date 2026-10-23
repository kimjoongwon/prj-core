import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChatMessageItem } from "./ChatMessageItem";

vi.mock("@cocrepo/ui", () => ({
	Chip: ({ children }: { children: ReactNode }) => <span>{children}</span>,
	Typography: {
		Paragraph: ({ children }: { children: ReactNode }) => <p>{children}</p>,
	},
}));

afterEach(cleanup);

describe("면접 질문과 이력서 근거", () => {
	it("사용자는 면접관으로 표시하고 답변의 이력서 쪽 출처를 그대로 전달한다", () => {
		render(
			<ChatMessageItem
				chatMessage={{
					chatMessageId: "question",
					role: "user",
					text: "경험을 소개해 주세요.",
					evidence: [],
				}}
			/>,
		);
		expect(screen.getByText("면접관")).toBeInTheDocument();
		render(
			<ChatMessageItem
				chatMessage={{
					chatMessageId: "reply",
					role: "assistant",
					text: "등록된 이력서에 근거한 설명입니다.",
					evidence: [
						{
							chunkId: "resume-1",
							source: "등록 이력서 · 1쪽",
							version: "test",
							score: 0.8,
							snippet: "테스트용 발췌문",
						},
					],
				}}
			/>,
		);
		expect(screen.getByText("MOMO")).toBeInTheDocument();
		expect(screen.getByText("이력서 근거 1개 보기")).toBeInTheDocument();
		expect(screen.getByText("등록 이력서 · 1쪽")).toBeInTheDocument();
	});

	it("첫 답변 전에는 이력서 근거 확인 상태와 서버 진행 안내를 보여준다", () => {
		const chatMessage = {
			chatMessageId: "reply",
			role: "assistant" as const,
			text: "",
			evidence: [],
		};
		const { rerender } = render(
			<ChatMessageItem chatMessage={chatMessage} isStreaming />,
		);
		expect(
			screen.getByText("이력서에서 질문과 관련된 근거를 찾고 있어요…"),
		).toBeInTheDocument();
		rerender(
			<ChatMessageItem
				chatMessage={chatMessage}
				isStreaming
				streamingStatusText="답변 연결을 다시 시도하고 있어요."
			/>,
		);
		expect(
			screen.getByText("답변 연결을 다시 시도하고 있어요."),
		).toBeInTheDocument();
	});
});
