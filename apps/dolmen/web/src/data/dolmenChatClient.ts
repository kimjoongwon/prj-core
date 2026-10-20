export type DolmenChatRole = "user" | "assistant";

/** 답변 근거로 제시된 검색 청크(절 제목이 source 끝에 "§"로 붙어 온다). */
export interface DolmenChatEvidence {
	chunkId: string;
	source: string;
	version: string;
	score: number;
	snippet: string;
}

export interface DolmenChatMessage {
	chatMessageId: string;
	role: DolmenChatRole;
	text: string;
	evidence: DolmenChatEvidence[];
}

/** 한 번의 질문에 대한 에이전트 처리 단계 — 활동 타임라인 패널이 실시간으로 그린다. */
export type DolmenAgentActivityPhase =
	| "searching"
	| "generating"
	| "done"
	| "error";

export interface DolmenAgentActivity {
	activityId: string;
	questionText: string;
	phase: DolmenAgentActivityPhase;
	startedAtMs: number;
	/** 근거 검색이 끝난 시각(sources 이벤트 수신). 0이면 아직 검색 중 */
	searchFinishedAtMs: number;
	finishedAtMs: number;
	retrievedEvidence: DolmenChatEvidence[];
	replyCharacterCount: number;
	errorText: string;
}

export function issueAgentActivityId(): string {
	return `agent-activity-${crypto.randomUUID()}`;
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
	onRetrievedEvidence: (retrievedEvidence: DolmenChatEvidence[]) => void;
	onAssistantChunk: (chunkText: string) => void;
	onReplyDone: () => void;
	onReplyError: (errorMessage: string) => void;
}

interface DolmenChatStreamEvent {
	type: "sources" | "chunk" | "done" | "error";
	text?: string;
	message?: string;
	grounds?: DolmenChatStreamGround[];
}

interface DolmenChatStreamGround {
	chunk_id: string;
	source: string;
	version: string;
	score: number;
	snippet: string;
}

/** API의 snake_case 근거 필드를 화면용 camelCase로 바꾼다. */
function toDolmenChatEvidence(
	streamGround: DolmenChatStreamGround,
): DolmenChatEvidence {
	return {
		chunkId: streamGround.chunk_id,
		source: streamGround.source,
		version: streamGround.version,
		score: streamGround.score,
		snippet: streamGround.snippet,
	};
}

/**
 * dolmen-api의 SSE 스트림(/api/chat)을 구독해 어시스턴트 답변을 조각 단위로 전달한다.
 * 답변 전에 온 sources 이벤트는 근거 목록으로 onRetrievedEvidence에 전달하고,
 * 스트림 도중 오류가 나면 onReplyError로 알리며 정상 종료는 onReplyDone으로만 알린다.
 */
export async function streamDolmenChatReply({
	messageText,
	sessionId,
	onRetrievedEvidence,
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
		if (streamEvent.type === "sources" && streamEvent.grounds) {
			onRetrievedEvidence(streamEvent.grounds.map(toDolmenChatEvidence));
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
