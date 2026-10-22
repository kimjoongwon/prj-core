import "@testing-library/jest-dom/vitest";
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { streamDolmenChatReply } from "../data/dolmenChatClient";
import {
	ChatPanel,
	type ChatPanelState,
	createChatPanelState,
} from "./ChatPanel";
import type { MomoAvatarPanelProps } from "./MomoAvatarPanel";

const mocks = vi.hoisted(() => ({ streamReply: vi.fn() }));

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
	ScrollShadow: ({ children }: { children: ReactNode }) => (
		<div>{children}</div>
	),
	Chip: ({ children }: { children: ReactNode }) => <span>{children}</span>,
	Typography: {
		Paragraph: ({ children }: { children: ReactNode }) => <p>{children}</p>,
		Heading: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
	},
}));

vi.mock("./MomoAvatarPanel", () => ({
	MomoAvatarPanel: ({ motion, onReady }: MomoAvatarPanelProps) => (
		<div data-testid="momo-motion" data-motion={motion}>
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
		chatState.setDraftMessage("연차는 며칠인가요?");
		void chatState.submitDraftMessage();
		const replyInput = latestReplyInput();
		expect(chatState.momoMotion).toBe("think");
		replyInput.onRetrievedEvidence([]);
		replyInput.onReplyStatus("모델이 혼잡해 다시 시도합니다");
		expect(chatState.currentAgentActivity?.phase).toBe("generating");
		expect(chatState.momoMotion).toBe("think");
		replyInput.onAssistantChunk("연 15일입니다.");
		expect(chatState.momoMotion).toBe("speak");
		replyInput.onReplyDone();
		expect(chatState.momoMotion).toBe("happy");
		expect(chatState.agentActivities.at(-1)?.phase).toBe("done");
	});

	it("지난 one-shot의 종료 이벤트는 새로운 happy를 종료하지 않는다", () => {
		const chatState = createChatState();
		chatState.greetMomoIfIdle();
		const greetingPlaybackId = chatState.momoPlaybackId;
		chatState.setDraftMessage("연차?");
		void chatState.submitDraftMessage();
		latestReplyInput().onAssistantChunk("15일");
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
		expect(chatState.agentActivities).toHaveLength(1);
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
});

describe("ChatPanel의 입력과 수신 수명", () => {
	it("focus/blur, 실제 전송과 unmount abort를 상태에 연결한다", () => {
		const { unmount } = render(<ChatPanel />);
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
		fireEvent.change(questionInput, { target: { value: "연차?" } });
		fireEvent.click(screen.getByRole("button", { name: "전송" }));
		expect(questionInput).toBeDisabled();
		expect(screen.getByTestId("momo-motion")).toHaveAttribute(
			"data-motion",
			"think",
		);
		act(() => latestReplyInput().onAssistantChunk("연 15일"));
		expect(screen.getByTestId("momo-motion")).toHaveAttribute(
			"data-motion",
			"speak",
		);
		const replySignal = latestReplyInput().signal;
		unmount();
		expect(replySignal?.aborted).toBe(true);
		expect(vi.getTimerCount()).toBe(0);
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
