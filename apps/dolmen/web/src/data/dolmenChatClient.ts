export type DolmenChatRole = "user" | "assistant";

export interface DolmenChatMessage {
	chatMessageId: string;
	role: DolmenChatRole;
	text: string;
}

export function issueChatMessageId(): string {
	return `chat-message-${crypto.randomUUID()}`;
}

export function issueChatSessionId(): string {
	return `chat-session-${crypto.randomUUID()}`;
}

const DOLMEN_CHAT_ENDPOINT = "/dolmen/api/chat";

interface StreamDolmenChatReplyInput {
	messageText: string;
	sessionId: string;
	onAssistantChunk: (chunkText: string) => void;
	onReplyDone: () => void;
	onReplyError: (errorMessage: string) => void;
}

interface DolmenChatStreamEvent {
	type: "chunk" | "done" | "error";
	text?: string;
	message?: string;
}

/**
 * dolmen-api의 SSE 스트림(/api/chat)을 구독해 어시스턴트 답변을 조각 단위로 전달한다.
 * 스트림 도중 오류가 나면 onReplyError로 알리고 정상 종료는 onReplyDone으로만 알린다.
 */
export async function streamDolmenChatReply({
	messageText,
	sessionId,
	onAssistantChunk,
	onReplyDone,
	onReplyError,
}: StreamDolmenChatReplyInput): Promise<void> {
	let response: Response;
	try {
		response = await fetch(DOLMEN_CHAT_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: messageText, session_id: sessionId }),
		});
	} catch {
		onReplyError(
			"dolmen-api에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.",
		);
		return;
	}

	if (!response.ok || !response.body) {
		onReplyError(`요청이 실패했습니다. (상태 코드 ${response.status})`);
		return;
	}

	const sseReader = response.body.getReader();
	const sseDecoder = new TextDecoder();
	let bufferedSseData = "";
	let hasReceivedDoneEvent = false;

	const dispatchSseEvent = (sseEventData: string) => {
		let streamEvent: DolmenChatStreamEvent;
		try {
			streamEvent = JSON.parse(sseEventData) as DolmenChatStreamEvent;
		} catch {
			return;
		}
		if (streamEvent.type === "chunk" && streamEvent.text) {
			onAssistantChunk(streamEvent.text);
			return;
		}
		if (streamEvent.type === "error") {
			onReplyError(streamEvent.message ?? "알 수 없는 오류가 발생했습니다.");
			return;
		}
		if (streamEvent.type === "done") {
			hasReceivedDoneEvent = true;
			onReplyDone();
		}
	};

	while (true) {
		const { done, value } = await sseReader.read();
		if (done) {
			break;
		}
		bufferedSseData += sseDecoder.decode(value, { stream: true });

		const completeSseEvents = bufferedSseData.split("\n\n");
		bufferedSseData = completeSseEvents.pop() ?? "";
		for (const completeSseEvent of completeSseEvents) {
			for (const sseEventLine of completeSseEvent.split("\n")) {
				if (sseEventLine.startsWith("data: ")) {
					dispatchSseEvent(sseEventLine.slice("data: ".length));
				}
			}
		}
	}

	if (!hasReceivedDoneEvent) {
		onReplyDone();
	}
}
