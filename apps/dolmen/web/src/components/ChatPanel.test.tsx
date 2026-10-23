import "@testing-library/jest-dom/vitest";
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { streamDolmenChatReply } from "../data/dolmenChatClient";
import {
	ChatPanel,
	type ChatPanelState,
	createChatPanelState,
} from "./ChatPanel";
import type { MomoAvatarPanelProps } from "./MomoAvatarPanel";

const mocks = vi.hoisted(() => ({ streamReply: vi.fn() }));

vi.mock("../data/dolmenHealthClient", () => ({
	fetchDolmenHealthStatus: () => new Promise(() => {}),
	fetchDolmenResumeStatus: () => new Promise(() => {}),
}));

vi.mock("../data/dolmenChatClient", async (importOriginal) => ({
	...(await importOriginal<typeof import("../data/dolmenChatClient")>()),
	streamDolmenChatReply: mocks.streamReply,
}));

vi.mock("@cocrepo/ui", () => ({
	Button: ({
		children,
		onPress,
		isDisabled,
	}: {
		children: ReactNode;
		onPress: () => void;
		isDisabled: boolean;
	}) => (
		<button type="button" disabled={isDisabled} onClick={onPress}>
			{children}
		</button>
	),
	TextArea: ({
		value,
		onChange,
		onFocus,
		onBlur,
		onKeyDown,
		isDisabled,
	}: {
		value: string;
		onChange: (value: string) => void;
		onFocus: () => void;
		onBlur: () => void;
		onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
		isDisabled: boolean;
	}) => (
		<textarea
			aria-label="질문 입력"
			value={value}
			onChange={(event) => onChange(event.target.value)}
			onFocus={onFocus}
			onBlur={onBlur}
			onKeyDown={onKeyDown}
			disabled={isDisabled}
		/>
	),
	ScrollShadow: ({ children, ...viewportProps }: ComponentProps<"div">) => (
		<div {...viewportProps}>{children}</div>
	),
	Chip: ({ children }: { children: ReactNode }) => <span>{children}</span>,
	Typography: {
		Paragraph: ({ children }: { children: ReactNode }) => <p>{children}</p>,
		Heading: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
	},
}));

vi.mock("./MomoAvatarPanel", () => ({
	MomoAvatarPanel: ({
		motion,
		onReady,
		presentation,
	}: MomoAvatarPanelProps) => (
		<div
			data-testid="momo-motion"
			data-motion={motion}
			data-presentation={presentation}
		>
			<button type="button" onClick={onReady}>
				모델 준비
			</button>
		</div>
	),
}));

type ChatReplyInput = Parameters<typeof streamDolmenChatReply>[0];
const createdStates: ChatPanelState[] = [];

function createChatState() {
	const chatState = createChatPanelState({ sessionId: "momo-test-session" });
	createdStates.push(chatState);
	return chatState;
}

function latestReplyInput(): ChatReplyInput {
	return mocks.streamReply.mock.calls.at(-1)?.[0] as ChatReplyInput;
}

/** jsdom에 없는 넘침과 scrollTop 제한만 재현하며 높이는 실제 렌더된 본문에서 계산한다. */
function giveChatViewportLayout(viewport: HTMLElement) {
	let viewportScrollTop = 0;
	Object.defineProperties(viewport, {
		clientHeight: { configurable: true, get: () => 200 },
		scrollHeight: {
			configurable: true,
			get: () => 500 + (viewport.textContent?.length ?? 0) * 2,
		},
		scrollTop: {
			configurable: true,
			get: () => viewportScrollTop,
			set: (requestedScrollTop: number) => {
				viewportScrollTop = Math.max(
					0,
					Math.min(
						requestedScrollTop,
						viewport.scrollHeight - viewport.clientHeight,
					),
				);
			},
		},
	});
}

function sendQuestionThroughComposer(question: string) {
	fireEvent.change(screen.getByRole("textbox", { name: "질문 입력" }), {
		target: { value: question },
	});
	fireEvent.click(screen.getByRole("button", { name: "전송" }));
}

beforeEach(() => {
	vi.useFakeTimers();
	mocks.streamReply.mockReset();
	mocks.streamReply.mockImplementation(() => new Promise(() => {}));
});

afterEach(() => {
	cleanup();
	for (const chatState of createdStates.splice(0)) chatState.dispose();
	vi.useRealTimers();
});

describe("ChatPanelState의 MOMO 연결", () => {
	it("모델 준비 후 한 번 인사하고 watchdog 뒤 대기하며 다시 인사하지 않는다", () => {
		const chatState = createChatState();
		expect(chatState.momoMotion).toBe("idle");
		chatState.greetMomoIfIdle();
		expect(chatState.momoMotion).toBe("hello");
		vi.advanceTimersByTime(4_500);
		expect(chatState.momoMotion).toBe("idle");
		chatState.greetMomoIfIdle();
		expect(chatState.momoMotion).toBe("idle");
	});

	it("입력 focus는 인사를 중단하고 blur는 대기로 돌아간다", () => {
		const chatState = createChatState();
		chatState.greetMomoIfIdle();
		chatState.focusDraftInput();
		expect(chatState.momoMotion).toBe("listen");
		chatState.blurDraftInput();
		expect(chatState.momoMotion).toBe("idle");
		expect(vi.getTimerCount()).toBe(0);
	});

	it("모델이 늦게 준비되어도 이미 작성한 질문이 있으면 인사를 생략한다", () => {
		const chatState = createChatState();
		chatState.setDraftMessage("샘플 질문");
		chatState.greetMomoIfIdle();
		expect(chatState.momoMotion).toBe("idle");
		expect(vi.getTimerCount()).toBe(0);
		chatState.setDraftMessage("");
		chatState.greetMomoIfIdle();
		expect(chatState.momoMotion).toBe("idle");
	});

	it("검색 근거와 재시도 상태만으로는 think를 벗어나지 않고 첫 chunk부터 speak한다", () => {
		const chatState = createChatState();
		chatState.setDraftMessage("경력과 역할을 소개해 주세요.");
		void chatState.submitDraftMessage();
		const replyInput = latestReplyInput();
		expect(chatState.momoMotion).toBe("think");
		replyInput.onRetrievedEvidence([]);
		replyInput.onReplyStatus("모델이 혼잡해 다시 시도합니다");
		expect(chatState.currentAgentActivity?.phase).toBe("generating");
		expect(chatState.momoMotion).toBe("think");
		replyInput.onAssistantChunk("이력서에 기재된 내용을 설명합니다.");
		expect(chatState.momoMotion).toBe("speak");
		replyInput.onReplyDone();
		expect(chatState.momoMotion).toBe("happy");
		expect(chatState.agentActivities.at(-1)?.phase).toBe("done");
	});

	it("지난 one-shot의 종료 이벤트는 새로운 happy를 종료하지 않는다", () => {
		const chatState = createChatState();
		chatState.greetMomoIfIdle();
		const greetingPlaybackId = chatState.momoPlaybackId;
		chatState.setDraftMessage("어떤 경험이 있나요?");
		void chatState.submitDraftMessage();
		latestReplyInput().onAssistantChunk("등록된 이력서를 근거로 답합니다.");
		latestReplyInput().onReplyDone();
		chatState.finishMomoOneShot(greetingPlaybackId);
		expect(chatState.momoMotion).toBe("happy");
		chatState.finishMomoOneShot(chatState.momoPlaybackId);
		expect(chatState.momoMotion).toBe("idle");
		expect(vi.getTimerCount()).toBe(0);
	});

	it("실패와 취소는 happy로 전환하지 않고 요청을 해제한다", () => {
		const chatState = createChatState();
		chatState.setDraftMessage("첫 질문");
		void chatState.submitDraftMessage();
		latestReplyInput().onReplyError("연결이 끊어졌어요");
		expect(chatState.momoMotion).toBe("idle");
		expect(chatState.isAssistantResponding).toBe(false);
		expect(chatState.agentActivities.at(-1)?.phase).toBe("error");
		chatState.setDraftMessage("다음 질문");
		void chatState.submitDraftMessage();
		latestReplyInput().onReplyCancelled?.();
		expect(chatState.momoMotion).toBe("idle");
		expect(chatState.isAssistantResponding).toBe(false);
		expect(chatState.streamErrorMessage).toBe("");
		expect(chatState.agentActivities).toHaveLength(2);
		expect(chatState.agentActivities.at(-1)?.phase).toBe("cancelled");
		expect(
			chatState.agentActivities.at(-1)?.clientObservations.at(-1)?.event,
		).toBe("cancelled");
	});

	it("새 요청이 시작되면 happy 타이머를 지우고 중복 전송을 막는다", () => {
		const chatState = createChatState();
		chatState.beginMomoOneShot("happy");
		chatState.setDraftMessage("첫 질문");
		void chatState.submitDraftMessage();
		chatState.setDraftMessage("중복 질문");
		void chatState.submitDraftMessage();
		expect(mocks.streamReply).toHaveBeenCalledTimes(1);
		expect(chatState.momoMotion).toBe("think");
		expect(vi.getTimerCount()).toBe(0);
	});

	it("dispose는 수신을 abort하고 늦은 callback과 인사를 무시한다", () => {
		const chatState = createChatState();
		chatState.setDraftMessage("질문");
		void chatState.submitDraftMessage();
		const replyInput = latestReplyInput();
		chatState.dispose();
		expect(replyInput.signal?.aborted).toBe(true);
		replyInput.onAssistantChunk("늦은 답변");
		replyInput.onReplyDone();
		chatState.greetMomoIfIdle();
		expect(chatState.momoMotion).toBe("idle");
		expect(chatState.chatMessages).toHaveLength(1);
		expect(vi.getTimerCount()).toBe(0);
	});
	it("요청별 서버 기록을 분리하고 완료·새 요청 뒤 늦은 콜백을 무시한다", () => {
		const chatState = createChatState();
		chatState.setDraftMessage("첫 질문");
		void chatState.submitDraftMessage();
		const firstInput = latestReplyInput();
		const firstEvent = {
			event: "reply_completed" as const,
			elapsedMs: 12,
			requestId: "12345678-1234-1234-1234-123456789abc",
			details: {},
		};
		firstInput.onDebugEvent?.(firstEvent);
		expect(chatState.isAssistantResponding).toBe(true);
		expect(chatState.currentAgentActivity?.phase).toBe("searching");
		firstInput.onReplyDone();
		firstInput.onDebugEvent?.(firstEvent);
		expect(chatState.agentActivities[0]?.debugEvents).toHaveLength(1);
		chatState.setDraftMessage("다음 질문");
		void chatState.submitDraftMessage();
		firstInput.onDebugEvent?.(firstEvent);
		firstInput.onAssistantChunk("지난 요청의 늦은 본문");
		latestReplyInput().onDebugEvent?.({
			...firstEvent,
			event: "request_received",
			requestId: "87654321-1234-1234-1234-123456789abc",
		});
		expect(chatState.agentActivities[0]?.debugEvents).toHaveLength(1);
		expect(chatState.agentActivities[1]?.debugEvents).toHaveLength(1);
		expect(chatState.agentActivities[1]?.clientObservations).toEqual([
			{ event: "request_sent", elapsedMs: 0 },
		]);
		expect(chatState.assistantReplyMessage?.text).toBe("");
	});
});

describe("ChatPanel의 입력과 수신 수명", () => {
	it("focus/blur, 실제 전송과 unmount abort를 상태에 연결한다", () => {
		const { unmount } = render(<ChatPanel />);
		expect(
			screen.getByText(
				/면접관님, 경력·프로젝트·기술·협업에 대해 질문해 주세요/,
			),
		).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "모델 준비" }));
		expect(screen.getByTestId("momo-motion")).toHaveAttribute(
			"data-motion",
			"hello",
		);
		const questionInput = screen.getByRole("textbox", { name: "질문 입력" });
		fireEvent.focus(questionInput);
		expect(screen.getByTestId("momo-motion")).toHaveAttribute(
			"data-motion",
			"listen",
		);
		fireEvent.blur(questionInput);
		expect(screen.getByTestId("momo-motion")).toHaveAttribute(
			"data-motion",
			"idle",
		);
		fireEvent.click(
			screen.getByRole("button", {
				name: "주요 프로젝트와 맡은 역할을 소개해 주세요.",
			}),
		);
		expect(questionInput).toHaveValue(
			"주요 프로젝트와 맡은 역할을 소개해 주세요.",
		);
		fireEvent.click(screen.getByRole("button", { name: "전송" }));
		expect(
			within(screen.getByRole("region", { name: "채팅" })).getByText("면접관"),
		).toBeInTheDocument();
		expect(questionInput).toBeDisabled();
		expect(screen.getByTestId("momo-motion")).toHaveAttribute(
			"data-motion",
			"think",
		);
		act(() =>
			latestReplyInput().onAssistantChunk("이력서에 기재된 설명입니다."),
		);
		expect(screen.getByTestId("momo-motion")).toHaveAttribute(
			"data-motion",
			"speak",
		);
		act(() => latestReplyInput().onReplyError("이력서를 준비하지 못했어요."));
		expect(screen.getByRole("alert")).toHaveTextContent(
			"답변을 마치지 못했어요. 잠시 후 다시 질문해 주세요.",
		);
		expect(questionInput).not.toBeDisabled();
		expect(screen.getByTestId("momo-motion")).toHaveAttribute(
			"data-motion",
			"idle",
		);
		const replySignal = latestReplyInput().signal;
		unmount();
		expect(replySignal?.aborted).toBe(true);
		vi.runOnlyPendingTimers();
		expect(vi.getTimerCount()).toBe(0);
	});

	it("왼쪽에는 작은 모모와 대화만, 오른쪽에는 개발 기록과 전체 검색 근거를 둔다", () => {
		render(<ChatPanel />);
		const chat = screen.getByRole("region", { name: "채팅" });
		const debugPane = screen.getByRole("complementary", {
			name: "개발자 디버그",
		});
		expect(within(chat).getByTestId("momo-motion")).toHaveAttribute(
			"data-presentation",
			"compact",
		);
		expect(
			within(debugPane).queryByTestId("momo-motion"),
		).not.toBeInTheDocument();
		fireEvent.change(screen.getByRole("textbox", { name: "질문 입력" }), {
			target: { value: "질문" },
		});
		fireEvent.click(screen.getByRole("button", { name: "전송" }));
		act(() => {
			latestReplyInput().onRetrievedEvidence(
				Array.from({ length: 5 }, (_, index) => ({
					chunkId: `test-${index}`,
					source: `출처 ${index + 1}`,
					version: "test-revision",
					score: 0.7,
					snippet: `정제 발췌 ${index + 1}`,
				})),
			);
			latestReplyInput().onDebugEvent?.({
				event: "context_ready",
				elapsedMs: 2.3,
				requestId: "12345678-1234-1234-1234-123456789abc",
				details: { retrieved_count: 5 },
			});
			latestReplyInput().onAssistantChunk("답변입니다. [등록 이력서 · 1쪽]");
		});
		expect(chat).toHaveTextContent("답변입니다. [등록 이력서 · 1쪽]");
		expect(chat).not.toHaveTextContent(
			/API|retrieved_count|test-revision|정제 발췌|유사도|검색 근거/,
		);
		expect(debugPane).toHaveTextContent("retrieved_count: 5");
		expect(
			within(debugPane)
				.getByText(/최신 요청 · 답변 수신 중/)
				.closest("details"),
		).toHaveAttribute("open");
		expect(
			within(debugPane)
				.getByRole("region", { name: "요청 기록" })
				.compareDocumentPosition(within(debugPane).getByText("등록 데이터")) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		fireEvent.click(within(debugPane).getByText("검색 근거 (5)"));
		expect(within(debugPane).getByText("정제 발췌 5")).toBeVisible();
		expect(
			within(debugPane).getByText("서버 이벤트 · 서버 요청 시작 기준"),
		).toBeVisible();
		expect(
			within(debugPane).getByText("브라우저 관측 · 전송 시작 기준"),
		).toBeVisible();
	});

	it("근거와 답변 시도만 수신하면 첫 답변을 기다리고 첫 본문부터 수신 중으로 표시한다", () => {
		render(<ChatPanel />);
		const debugPane = screen.getByRole("complementary", {
			name: "개발자 디버그",
		});
		fireEvent.change(screen.getByRole("textbox", { name: "질문 입력" }), {
			target: { value: "질문" },
		});
		fireEvent.click(screen.getByRole("button", { name: "전송" }));
		act(() => {
			latestReplyInput().onDebugEvent?.({
				event: "context_ready",
				elapsedMs: 2,
				requestId: "12345678-1234-1234-1234-123456789abc",
				details: { retrieved_count: 0 },
			});
			latestReplyInput().onRetrievedEvidence([]);
			latestReplyInput().onDebugEvent?.({
				event: "reply_attempt",
				elapsedMs: 3,
				requestId: "12345678-1234-1234-1234-123456789abc",
				details: { attempt: 1, answer_path: "model" },
			});
		});
		expect(
			within(debugPane).getByText("최신 요청 · 첫 답변 대기"),
		).toBeVisible();
		expect(
			within(debugPane).queryByText("최신 요청 · 답변 수신 중"),
		).not.toBeInTheDocument();
		act(() => latestReplyInput().onAssistantChunk("첫 본문"));
		expect(
			within(debugPane).getByText("최신 요청 · 답변 수신 중"),
		).toBeVisible();
		act(() => latestReplyInput().onReplyDone());
		expect(within(debugPane).getByText("최신 요청 · 정상 종료")).toBeVisible();
	});

	it("새 질문과 연속 본문 증가를 하단에서 따라가며 대화 밖의 스크롤은 움직이지 않는다", () => {
		render(<ChatPanel />);
		const viewport = screen.getByRole("log", { name: "대화 내역" });
		giveChatViewportLayout(viewport);
		const developerPane = screen.getByRole("complementary", {
			name: "개발자 디버그",
		});
		const developerViewport = within(developerPane).getByRole("region", {
			name: "요청 기록",
		}).parentElement;
		if (!developerViewport)
			throw new Error("개발 패널 스크롤 영역이 없습니다.");
		developerViewport.scrollTop = 75;
		document.documentElement.scrollTop = 40;
		for (let questionIndex = 1; questionIndex <= 5; questionIndex += 1) {
			sendQuestionThroughComposer(`새 질문 ${questionIndex}`);
			expect(viewport.scrollTop + viewport.clientHeight).toBe(
				viewport.scrollHeight,
			);
			const beforeChunkScrollTop = viewport.scrollTop;
			act(() =>
				latestReplyInput().onAssistantChunk(
					`답변 ${questionIndex} ${"본문 ".repeat(100)}`,
				),
			);
			expect(viewport.scrollTop).toBeGreaterThan(beforeChunkScrollTop);
			expect(viewport.scrollTop + viewport.clientHeight).toBe(
				viewport.scrollHeight,
			);
			const beforeNextChunkScrollTop = viewport.scrollTop;
			act(() => latestReplyInput().onAssistantChunk("추가 본문 ".repeat(100)));
			expect(viewport.scrollTop).toBeGreaterThan(beforeNextChunkScrollTop);
			expect(viewport.scrollTop + viewport.clientHeight).toBe(
				viewport.scrollHeight,
			);
			expect(
				within(viewport).getByText(
					new RegExp(`답변 ${questionIndex}.*추가 본문`),
				),
			).toBeInTheDocument();
			act(() => latestReplyInput().onReplyDone());
		}
		expect(within(viewport).getByText("새 질문 5")).toBeInTheDocument();
		expect(developerViewport.scrollTop).toBe(75);
		expect(document.documentElement.scrollTop).toBe(40);
		expect(screen.getByRole("textbox", { name: "질문 입력" })).toBeEnabled();
		document.documentElement.scrollTop = 0;
	});

	it("위로 읽는 동안 본문이 늘어도 위치를 유지하고 새 전송에서 최신 따라가기를 재개한다", () => {
		render(<ChatPanel />);
		const viewport = screen.getByRole("log", { name: "대화 내역" });
		giveChatViewportLayout(viewport);
		sendQuestionThroughComposer("첫 질문");
		act(() => latestReplyInput().onAssistantChunk("첫 본문 ".repeat(100)));
		viewport.scrollTop = 50;
		fireEvent.scroll(viewport);
		act(() =>
			latestReplyInput().onAssistantChunk("읽는 동안 추가된 본문 ".repeat(100)),
		);
		expect(viewport.scrollTop).toBe(50);
		expect(
			within(viewport).getByText(/읽는 동안 추가된 본문/),
		).toBeInTheDocument();
		act(() => latestReplyInput().onReplyDone());
		expect(viewport.scrollTop).toBe(50);
		sendQuestionThroughComposer("새 질문으로 최신 복귀");
		expect(viewport.scrollTop + viewport.clientHeight).toBe(
			viewport.scrollHeight,
		);
		act(() => latestReplyInput().onAssistantChunk("새 답변 ".repeat(100)));
		expect(viewport.scrollTop + viewport.clientHeight).toBe(
			viewport.scrollHeight,
		);
	});

	it("한글 조합 중 Enter와 Shift+Enter는 전송하지 않는다", () => {
		render(<ChatPanel />);
		const questionInput = screen.getByRole("textbox", { name: "질문 입력" });
		fireEvent.change(questionInput, { target: { value: "질문" } });
		fireEvent.keyDown(questionInput, { key: "Enter", isComposing: true });
		fireEvent.keyDown(questionInput, { key: "Enter", shiftKey: true });
		expect(mocks.streamReply).not.toHaveBeenCalled();
		fireEvent.keyDown(questionInput, { key: "Enter" });
		expect(mocks.streamReply).toHaveBeenCalledTimes(1);
	});
});
