import {
	type DolmenClientObservation,
	type DolmenDebugEvent,
	parseDolmenDebugEvent,
} from "./dolmenDebug";

export type DolmenChatRole = "user" | "assistant";

/** 답변 근거로 제시된 이력서 발췌문과 쪽 출처. */
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

/** 한 번의 질문에 대한 클라이언트 수신 상태. 서버 처리 기록은 debugEvents로 구분한다. */
export type DolmenAgentActivityPhase =
	| "searching"
	| "generating"
	| "done"
	| "error"
	| "cancelled";

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
	/** 진행 중 상태 안내(예: 모델 혼잡 재시도). 첫 답변 조각이 오면 비운다 */
	statusText: string;
	errorText: string;
	debugEvents: DolmenDebugEvent[];
	clientObservations: DolmenClientObservation[];
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
	signal?: AbortSignal;
	onRetrievedEvidence: (retrievedEvidence: DolmenChatEvidence[]) => void;
	onReplyStatus: (statusMessage: string) => void;
	onAssistantChunk: (chunkText: string) => void;
	onReplyDone: () => void;
	onReplyError: (errorMessage: string) => void;
	onReplyCancelled?: () => void;
	onDebugEvent?: (debugEvent: DolmenDebugEvent) => void;
}

interface DolmenChatStreamEvent {
	type: "sources" | "status" | "chunk" | "done" | "error" | "debug";
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
 * 명시적인 done만 성공이며, 오류와 취소는 각 종료 콜백으로 한 번만 알린다.
 */
export async function streamDolmenChatReply({
	messageText,
	sessionId,
	signal,
	onRetrievedEvidence,
	onReplyStatus,
	onAssistantChunk,
	onReplyDone,
	onReplyError,
	onReplyCancelled,
	onDebugEvent,
}: StreamDolmenChatReplyInput): Promise<void> {
	let replyOutcome: "done" | "error" | "cancelled" | undefined;
	let sseReader: ReadableStreamDefaultReader<Uint8Array> | undefined;
	let readerCancellation: Promise<void> | undefined;
	let hasReceivedResponse = false;

	const finishReply = (
		outcome: "done" | "error" | "cancelled",
		errorMessage = "알 수 없는 오류가 발생했습니다.",
	) => {
		if (replyOutcome) {
			return;
		}
		replyOutcome = outcome;
		try {
			if (outcome === "done") {
				onReplyDone();
			} else if (outcome === "error") {
				onReplyError(errorMessage);
			} else {
				onReplyCancelled?.();
			}
		} catch {
			// 종료 콜백의 예외가 스트림 정리나 Promise<void> 완료를 막지 않게 한다.
		}
	};

	const cancelReplyReader = () => {
		if (sseReader && !readerCancellation) {
			readerCancellation = sseReader.cancel().catch(() => undefined);
		}
	};

	const cancelReply = () => {
		finishReply("cancelled");
		cancelReplyReader();
	};

	const dispatchSseEvent = (sseEventData: string) => {
		if (replyOutcome) {
			return;
		}
		let streamEvent: DolmenChatStreamEvent;
		try {
			streamEvent = JSON.parse(sseEventData) as DolmenChatStreamEvent;
		} catch {
			return;
		}
		if (!streamEvent || typeof streamEvent !== "object") {
			return;
		}
		if (streamEvent.type === "debug") {
			try {
				const debugEvent = parseDolmenDebugEvent(
					streamEvent as unknown as Record<string, unknown>,
				);
				if (debugEvent) onDebugEvent?.(debugEvent);
			} catch {
				// 선택적인 개발 기록의 오류는 답변 수신이나 종료에 영향을 주지 않는다.
			}
			return;
		}
		if (streamEvent.type === "sources" && streamEvent.grounds) {
			onRetrievedEvidence(streamEvent.grounds.map(toDolmenChatEvidence));
			return;
		}
		if (streamEvent.type === "status" && streamEvent.message) {
			onReplyStatus(streamEvent.message);
			return;
		}
		if (streamEvent.type === "chunk" && streamEvent.text) {
			onAssistantChunk(streamEvent.text);
			return;
		}
		if (streamEvent.type === "error") {
			finishReply("error", streamEvent.message);
			return;
		}
		if (streamEvent.type === "done") {
			finishReply("done");
		}
	};

	const dispatchSseFrame = (sseFrame: string) => {
		const sseDataLines = sseFrame
			.split(/\r\n|\n|\r/)
			.filter((sseLine) => sseLine.startsWith("data:"))
			.map((sseLine) => sseLine.slice("data:".length).replace(/^ /, ""));
		if (sseDataLines.length > 0) {
			dispatchSseEvent(sseDataLines.join("\n"));
		}
	};

	if (signal?.aborted) {
		cancelReply();
		return;
	}
	signal?.addEventListener("abort", cancelReply, { once: true });

	try {
		const response = await fetch(DOLMEN_CHAT_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: messageText, session_id: sessionId }),
			signal,
		});
		hasReceivedResponse = true;
		sseReader = response.body?.getReader();
		if (replyOutcome) {
			return;
		}
		if (!response.ok || !sseReader) {
			finishReply(
				"error",
				`요청이 실패했습니다. (상태 코드 ${response.status})`,
			);
			return;
		}

		const sseDecoder = new TextDecoder();
		let bufferedSseData = "";
		while (!replyOutcome) {
			const { done, value } = await sseReader.read();
			if (replyOutcome) {
				break;
			}
			bufferedSseData += done
				? sseDecoder.decode()
				: sseDecoder.decode(value, { stream: true });

			const completeSseEvents = bufferedSseData.split(/\r\n\r\n|\n\n|\r\r/);
			bufferedSseData = completeSseEvents.pop() ?? "";
			for (const completeSseEvent of completeSseEvents) {
				dispatchSseFrame(completeSseEvent);
				if (replyOutcome) {
					break;
				}
			}
			if (done) {
				dispatchSseFrame(bufferedSseData);
				finishReply(
					"error",
					"답변이 완료되기 전에 연결이 종료되었습니다. 다시 시도해 주세요.",
				);
				break;
			}
		}
	} catch (streamError) {
		if (
			signal?.aborted ||
			(typeof streamError === "object" &&
				streamError !== null &&
				"name" in streamError &&
				streamError.name === "AbortError")
		) {
			finishReply("cancelled");
		} else {
			finishReply(
				"error",
				hasReceivedResponse
					? "답변을 받는 중 연결이 끊어졌습니다. 다시 시도해 주세요."
					: "dolmen-api에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.",
			);
		}
	} finally {
		signal?.removeEventListener("abort", cancelReply);
		cancelReplyReader();
		await readerCancellation;
		sseReader?.releaseLock();
	}
}
