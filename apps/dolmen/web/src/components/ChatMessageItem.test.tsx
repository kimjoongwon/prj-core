import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { observable, runInAction } from "mobx";
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
					text: "등록된 이력서에 근거한 설명입니다. [등록 이력서 · 1쪽]",
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
		expect(
			screen.getByText(/설명입니다. \[등록 이력서 · 1쪽\]/),
		).toBeInTheDocument();
		expect(screen.queryByText("이력서 근거 1개 보기")).not.toBeInTheDocument();
		expect(screen.queryByText("테스트용 발췌문")).not.toBeInTheDocument();
		expect(screen.queryByText(/관련도/)).not.toBeInTheDocument();
	});

	it("작성 중에는 개발 상태와 근거 개수 대신 일반 안내를 보여준다", () => {
		render(
			<ChatMessageItem
				chatMessage={{
					chatMessageId: "reply",
					role: "assistant",
					text: "",
					evidence: [],
				}}
				isStreaming
			/>,
		);
		expect(screen.getByRole("status")).toHaveTextContent(
			"답변을 작성하고 있어요…",
		);
		expect(screen.queryByText(/근거|모델|SSE/)).not.toBeInTheDocument();
	});
	it("동일한 observable 메시지의 연속 chunk를 부모 rerender 없이 즉시 표시한다", () => {
		const message = observable({
			chatMessageId: "streaming",
			role: "assistant" as const,
			text: "",
			evidence: [],
		});
		render(<ChatMessageItem chatMessage={message} isStreaming />);
		expect(screen.getByRole("status")).toHaveTextContent(
			"답변을 작성하고 있어요…",
		);
		act(() =>
			runInAction(() => {
				message.text += "첫 본문";
			}),
		);
		expect(screen.getByText("첫 본문")).toBeInTheDocument();
		act(() =>
			runInAction(() => {
				message.text += " 다음 본문";
			}),
		);
		expect(screen.getByText("첫 본문 다음 본문")).toBeInTheDocument();
		act(() =>
			runInAction(() => {
				message.text += " 세 번째 본문";
			}),
		);
		expect(
			screen.getByText("첫 본문 다음 본문 세 번째 본문"),
		).toBeInTheDocument();
	});
});
