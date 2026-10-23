// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import {
	contextWireFixture,
	ruleWireFixture,
	TEST_REQUEST_ID,
} from "../test/dolmenFixtures";
import { streamDolmenChatReply } from "./dolmenChatClient";

const sseEncoder = new TextEncoder();

function createChatInput() {
	return {
		messageText: "사용 방법을 알려 주세요.",
		sessionId: "chat-session-1",
		onRetrievedEvidence: vi.fn(),
		onReplyStatus: vi.fn(),
		onAssistantChunk: vi.fn(),
		onReplyDone: vi.fn(),
		onReplyError: vi.fn(),
		onReplyCancelled: vi.fn(),
	};
}

function createSseResponse(
	sseParts: (string | Uint8Array)[],
	{ hasEnded = true, status = 200 } = {},
) {
	const cancelResponse = vi.fn();
	const responseBody = new ReadableStream<Uint8Array>({
		start(controller) {
			for (const ssePart of sseParts) {
				controller.enqueue(
					typeof ssePart === "string" ? sseEncoder.encode(ssePart) : ssePart,
				);
			}
			if (hasEnded) {
				controller.close();
			}
		},
		cancel: cancelResponse,
	});
	const response = new Response(responseBody, { status });
	const fetchReply = vi.fn().mockResolvedValue(response);
	vi.stubGlobal("fetch", fetchReply);
	return { responseBody, cancelResponse, fetchReply };
}

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("streamDolmenChatReply", () => {
	it("기존 요청과 근거·진행·답변 계약을 유지하며 명시적 done만 성공으로 알린다", async () => {
		const chatInput = createChatInput();
		const abortController = new AbortController();
		const { responseBody, fetchReply } = createSseResponse([
			'data: {"type":"sources","grounds":[{"chunk_id":"guide-1","source":"사용 설명서 § 시작","version":"v1","score":0.9,"snippet":"시작 방법"}]}\n\n',
			'data: {"type":"status","message":"답변을 작성하고 있습니다."}\n\n',
			'data: {"type":"chunk","text":"안녕하세요."}\n\n',
			'data: {"type":"done"}\n\n',
		]);

		await expect(
			streamDolmenChatReply({ ...chatInput, signal: abortController.signal }),
		).resolves.toBeUndefined();

		expect(fetchReply).toHaveBeenCalledWith("/dolmen/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message: chatInput.messageText,
				session_id: chatInput.sessionId,
			}),
			signal: abortController.signal,
		});
		expect(chatInput.onRetrievedEvidence).toHaveBeenCalledExactlyOnceWith([
			{
				chunkId: "guide-1",
				source: "사용 설명서 § 시작",
				version: "v1",
				score: 0.9,
				snippet: "시작 방법",
			},
		]);
		expect(chatInput.onReplyStatus).toHaveBeenCalledExactlyOnceWith(
			"답변을 작성하고 있습니다.",
		);
		expect(chatInput.onAssistantChunk).toHaveBeenCalledExactlyOnceWith(
			"안녕하세요.",
		);
		expect(chatInput.onReplyDone).toHaveBeenCalledOnce();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
		expect(chatInput.onReplyCancelled).not.toHaveBeenCalled();
		expect(responseBody.locked).toBe(false);
	});

	it("error 이벤트 뒤 EOF를 성공으로 바꾸지 않는다", async () => {
		const chatInput = createChatInput();
		const { responseBody } = createSseResponse([
			'data: {"type":"chunk","text":"일부 답변"}\n\n',
			'data: {"type":"error","message":"모델에 연결할 수 없습니다."}\n\n',
		]);

		await streamDolmenChatReply(chatInput);

		expect(chatInput.onReplyError).toHaveBeenCalledExactlyOnceWith(
			"모델에 연결할 수 없습니다.",
		);
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyCancelled).not.toHaveBeenCalled();
		expect(responseBody.locked).toBe(false);
	});

	it.each([
		"",
		'data: {"type":"chunk","text":"완료되지 않은 답변"}',
	])("done 없는 EOF를 오류로 알린다: %s", async (sseText) => {
		const chatInput = createChatInput();
		const { responseBody } = createSseResponse([sseText]);

		await streamDolmenChatReply(chatInput);

		expect(chatInput.onReplyError).toHaveBeenCalledExactlyOnceWith(
			"답변이 완료되기 전에 연결이 종료되었습니다. 다시 시도해 주세요.",
		);
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyCancelled).not.toHaveBeenCalled();
		if (sseText) {
			expect(chatInput.onAssistantChunk).toHaveBeenCalledExactlyOnceWith(
				"완료되지 않은 답변",
			);
		}
		expect(responseBody.locked).toBe(false);
	});

	it.each([
		"done",
		"error",
	])("마지막 구분자가 없는 %s 이벤트도 EOF에서 해석한다", async (terminalType) => {
		const chatInput = createChatInput();
		createSseResponse([`data: {"type":"${terminalType}"}`]);

		await streamDolmenChatReply(chatInput);

		expect(chatInput.onReplyDone).toHaveBeenCalledTimes(
			terminalType === "done" ? 1 : 0,
		);
		expect(chatInput.onReplyError).toHaveBeenCalledTimes(
			terminalType === "error" ? 1 : 0,
		);
		expect(chatInput.onReplyCancelled).not.toHaveBeenCalled();
	});

	it.each([
		"done",
		"error",
	])("%s 이후의 중복 종료와 답변·진행·근거 이벤트를 무시한다", async (terminalType) => {
		const chatInput = createChatInput();
		const { responseBody, cancelResponse } = createSseResponse(
			[
				`data: {"type":"${terminalType}"}\n\ndata: {"type":"chunk","text":"늦은 답변"}\n\ndata: {"type":"status","message":"늦은 진행"}\n\ndata: {"type":"sources","grounds":[]}\n\ndata: {"type":"done"}\n\ndata: {"type":"error","message":"늦은 오류"}\n\n`,
			],
			{ hasEnded: false },
		);

		await streamDolmenChatReply(chatInput);

		expect(chatInput.onReplyDone).toHaveBeenCalledTimes(
			terminalType === "done" ? 1 : 0,
		);
		expect(chatInput.onReplyError).toHaveBeenCalledTimes(
			terminalType === "error" ? 1 : 0,
		);
		expect(chatInput.onReplyCancelled).not.toHaveBeenCalled();
		expect(chatInput.onAssistantChunk).not.toHaveBeenCalled();
		expect(chatInput.onReplyStatus).not.toHaveBeenCalled();
		expect(chatInput.onRetrievedEvidence).not.toHaveBeenCalled();
		expect(cancelResponse).toHaveBeenCalledOnce();
		expect(responseBody.locked).toBe(false);
	});

	it("UTF-8 문자와 SSE 구분자가 바이트 단위로 나뉘어도 답변을 복원한다", async () => {
		const chatInput = createChatInput();
		const sseBytes = sseEncoder.encode(
			'data: {"type":"chunk","text":"한글 🙂 답변"}\r\n\r\ndata: {"type":"done"}',
		);
		createSseResponse(
			Array.from(sseBytes, (sseByte) => Uint8Array.of(sseByte)),
		);

		await streamDolmenChatReply(chatInput);

		expect(chatInput.onAssistantChunk).toHaveBeenCalledExactlyOnceWith(
			"한글 🙂 답변",
		);
		expect(chatInput.onReplyDone).toHaveBeenCalledOnce();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
	});

	it("잘못된 JSON과 SSE 주석을 건너뛰고 여러 data 줄을 조합한다", async () => {
		const chatInput = createChatInput();
		createSseResponse([
			': keepalive\n\ndata: invalid-json\n\ndata: null\n\ndata:{"type":"chunk",\ndata: "text":"답변"}\n\ndata: {"type":"done"}\n\n',
		]);

		await streamDolmenChatReply(chatInput);

		expect(chatInput.onAssistantChunk).toHaveBeenCalledExactlyOnceWith("답변");
		expect(chatInput.onReplyDone).toHaveBeenCalledOnce();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
	});

	it("HTTP 실패는 본문의 done과 관계없이 오류로 알리고 reader를 정리한다", async () => {
		const chatInput = createChatInput();
		const { responseBody, cancelResponse } = createSseResponse(
			['data: {"type":"done"}\n\n'],
			{ hasEnded: false, status: 503 },
		);

		await streamDolmenChatReply(chatInput);

		expect(chatInput.onReplyError).toHaveBeenCalledExactlyOnceWith(
			"요청이 실패했습니다. (상태 코드 503)",
		);
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(cancelResponse).toHaveBeenCalledOnce();
		expect(responseBody.locked).toBe(false);
	});

	it("본문이 없는 응답도 오류로 알린다", async () => {
		const chatInput = createChatInput();
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null)));

		await streamDolmenChatReply(chatInput);

		expect(chatInput.onReplyError).toHaveBeenCalledExactlyOnceWith(
			"요청이 실패했습니다. (상태 코드 200)",
		);
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
	});

	it("fetch 예외를 오류 콜백으로 전달하고 Promise를 reject하지 않는다", async () => {
		const chatInput = createChatInput();
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

		await expect(streamDolmenChatReply(chatInput)).resolves.toBeUndefined();

		expect(chatInput.onReplyError).toHaveBeenCalledExactlyOnceWith(
			"dolmen-api에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.",
		);
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyCancelled).not.toHaveBeenCalled();
	});

	it("답변 중 reader 예외를 오류로 알리고 잠금을 해제한다", async () => {
		const chatInput = createChatInput();
		let responseController: ReadableStreamDefaultController<Uint8Array>;
		const responseBody = new ReadableStream<Uint8Array>({
			start(controller) {
				responseController = controller;
				controller.enqueue(
					sseEncoder.encode('data: {"type":"chunk","text":"일부 답변"}\n\n'),
				);
			},
		});
		chatInput.onAssistantChunk.mockImplementation(() => {
			responseController.error(new Error("connection lost"));
		});
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(responseBody)),
		);

		await expect(streamDolmenChatReply(chatInput)).resolves.toBeUndefined();

		expect(chatInput.onAssistantChunk).toHaveBeenCalledExactlyOnceWith(
			"일부 답변",
		);
		expect(chatInput.onReplyError).toHaveBeenCalledExactlyOnceWith(
			"답변을 받는 중 연결이 끊어졌습니다. 다시 시도해 주세요.",
		);
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyCancelled).not.toHaveBeenCalled();
		expect(responseBody.locked).toBe(false);
	});

	it("이미 취소된 signal이면 요청 없이 취소만 알린다", async () => {
		const chatInput = createChatInput();
		const abortController = new AbortController();
		abortController.abort();
		const fetchReply = vi.fn();
		vi.stubGlobal("fetch", fetchReply);

		await streamDolmenChatReply({
			...chatInput,
			signal: abortController.signal,
		});

		expect(fetchReply).not.toHaveBeenCalled();
		expect(chatInput.onReplyCancelled).toHaveBeenCalledOnce();
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
	});

	it("fetch 대기 중 abort를 오류나 성공으로 바꾸지 않는다", async () => {
		const chatInput = createChatInput();
		const abortController = new AbortController();
		vi.stubGlobal(
			"fetch",
			vi.fn(
				() =>
					new Promise<Response>((_resolve, reject) => {
						abortController.signal.addEventListener(
							"abort",
							() => reject(new DOMException("cancelled", "AbortError")),
							{ once: true },
						);
					}),
			),
		);

		const replyPromise = streamDolmenChatReply({
			...chatInput,
			signal: abortController.signal,
		});
		abortController.abort();
		await expect(replyPromise).resolves.toBeUndefined();

		expect(chatInput.onReplyCancelled).toHaveBeenCalledOnce();
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
	});

	it("read 대기 중 abort는 reader를 취소하고 취소만 한 번 알린다", async () => {
		const chatInput = createChatInput();
		const abortController = new AbortController();
		const { responseBody, cancelResponse } = createSseResponse([], {
			hasEnded: false,
		});

		const replyPromise = streamDolmenChatReply({
			...chatInput,
			signal: abortController.signal,
		});
		await vi.waitFor(() => expect(responseBody.locked).toBe(true));
		abortController.abort();
		await expect(replyPromise).resolves.toBeUndefined();

		expect(chatInput.onReplyCancelled).toHaveBeenCalledOnce();
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
		expect(cancelResponse).toHaveBeenCalledOnce();
		expect(responseBody.locked).toBe(false);
	});

	it("답변 콜백에서 취소하면 같은 버퍼의 이후 chunk와 done도 무시한다", async () => {
		const chatInput = createChatInput();
		const abortController = new AbortController();
		createSseResponse([
			'data: {"type":"chunk","text":"첫 답변"}\n\ndata: {"type":"chunk","text":"늦은 답변"}\n\ndata: {"type":"done"}\n\n',
		]);
		chatInput.onAssistantChunk.mockImplementation(() =>
			abortController.abort(),
		);

		await streamDolmenChatReply({
			...chatInput,
			signal: abortController.signal,
		});

		expect(chatInput.onAssistantChunk).toHaveBeenCalledExactlyOnceWith(
			"첫 답변",
		);
		expect(chatInput.onReplyCancelled).toHaveBeenCalledOnce();
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
	});

	it("signal 없는 AbortError도 취소로 알린다", async () => {
		const chatInput = createChatInput();
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValue(new DOMException("cancelled", "AbortError")),
		);

		await streamDolmenChatReply(chatInput);

		expect(chatInput.onReplyCancelled).toHaveBeenCalledOnce();
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
	});

	it("정상 종료 뒤 abort해도 성공을 취소로 바꾸지 않는다", async () => {
		const chatInput = createChatInput();
		const abortController = new AbortController();
		createSseResponse(['data: {"type":"done"}\n\n']);

		await streamDolmenChatReply({
			...chatInput,
			signal: abortController.signal,
		});
		abortController.abort();

		expect(chatInput.onReplyDone).toHaveBeenCalledOnce();
		expect(chatInput.onReplyCancelled).not.toHaveBeenCalled();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
	});

	it.each([
		"done",
		"error",
		"cancelled",
	])("%s 종료 콜백이 던져도 중복 종료나 Promise rejection이 없다", async (terminalType) => {
		const chatInput = createChatInput();
		const abortController = new AbortController();
		const terminalCallback =
			terminalType === "done"
				? chatInput.onReplyDone
				: terminalType === "error"
					? chatInput.onReplyError
					: chatInput.onReplyCancelled;
		terminalCallback.mockImplementation(() => {
			throw new Error("consumer callback failed");
		});
		const { responseBody } = createSseResponse([
			`data: {"type":"${terminalType === "cancelled" ? "chunk" : terminalType}","text":"답변"}\n\n`,
		]);
		if (terminalType === "cancelled") {
			chatInput.onAssistantChunk.mockImplementation(() =>
				abortController.abort(),
			);
		}

		await expect(
			streamDolmenChatReply({ ...chatInput, signal: abortController.signal }),
		).resolves.toBeUndefined();

		expect(terminalCallback).toHaveBeenCalledOnce();
		expect(chatInput.onReplyDone.mock.calls.length).toBe(
			terminalType === "done" ? 1 : 0,
		);
		expect(chatInput.onReplyError.mock.calls.length).toBe(
			terminalType === "error" ? 1 : 0,
		);
		expect(chatInput.onReplyCancelled.mock.calls.length).toBe(
			terminalType === "cancelled" ? 1 : 0,
		);
		expect(responseBody.locked).toBe(false);
	});

	it("reader 취소가 reject해도 종료 결과를 유지하고 잠금을 해제한다", async () => {
		const chatInput = createChatInput();
		const { responseBody, cancelResponse } = createSseResponse(
			['data: {"type":"done"}\n\n'],
			{ hasEnded: false },
		);
		cancelResponse.mockRejectedValue(new Error("cancel failed"));

		await expect(streamDolmenChatReply(chatInput)).resolves.toBeUndefined();

		expect(chatInput.onReplyDone).toHaveBeenCalledOnce();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
		expect(responseBody.locked).toBe(false);
	});
	it("개발 이벤트를 선택적으로 전달하고 본문/종료 계약을 유지한다", async () => {
		const chatInput = createChatInput();
		const onDebugEvent = vi.fn();
		createSseResponse([
			'data: {"type":"debug","event":"context_ready","elapsed_ms":12.3,"request_id":"12345678-1234-1234-1234-123456789abc","details":{"revision":2,"retrieved_count":5,"prompt":"비공개","error_category":"unknown"}}\n\n',
			'data: {"type":"chunk","text":"답변 본문"}\n\ndata: {"type":"done"}\n\n',
		]);
		await streamDolmenChatReply({ ...chatInput, onDebugEvent });
		expect(onDebugEvent).toHaveBeenCalledExactlyOnceWith({
			event: "context_ready",
			elapsedMs: 12.3,
			requestId: "12345678-1234-1234-1234-123456789abc",
			details: { revision: 2, retrieved_count: 5, error_category: "unknown" },
		});
		expect(chatInput.onAssistantChunk).toHaveBeenCalledExactlyOnceWith(
			"답변 본문",
		);
		expect(chatInput.onReplyDone).toHaveBeenCalledOnce();
	});

	it("malformed 개발 이벤트와 개발 콜백 예외가 답변을 실패시키지 않는다", async () => {
		const chatInput = createChatInput();
		const onDebugEvent = vi.fn(() => {
			throw new Error("기록 실패");
		});
		createSseResponse([
			'data: {"type":"debug","event":"unknown","elapsed_ms":1,"request_id":"12345678-1234-1234-1234-123456789abc","details":{}}\n\n',
			'data: {"type":"debug","event":"first_chunk","elapsed_ms":-1,"request_id":"bad","details":null}\n\n',
			'data: {"type":"debug","event":"request_received","elapsed_ms":0,"request_id":"12345678-1234-1234-1234-123456789abc","details":{}}\n\n',
			'data: {"type":"chunk","text":"정상 본문"}\n\ndata: {"type":"done"}\n\n',
		]);
		await streamDolmenChatReply({ ...chatInput, onDebugEvent });
		expect(onDebugEvent).toHaveBeenCalledOnce();
		expect(chatInput.onReplyDone).toHaveBeenCalledOnce();
		expect(chatInput.onReplyError).not.toHaveBeenCalled();
	});

	it.each([
		"done",
		"error",
	])("%s 이후의 늦은 개발 이벤트를 전달하지 않는다", async (terminalType) => {
		const chatInput = createChatInput();
		const onDebugEvent = vi.fn();
		createSseResponse([
			`data: {"type":"${terminalType}"}\n\ndata: {"type":"debug","event":"reply_completed","elapsed_ms":12,"request_id":"12345678-1234-1234-1234-123456789abc","details":{}}\n\n`,
		]);
		await streamDolmenChatReply({ ...chatInput, onDebugEvent });
		expect(onDebugEvent).not.toHaveBeenCalled();
	});

	it("개발 콜백이 없는 기존 소비자도 개발 이벤트를 건너뛰고 정상 완료한다", async () => {
		const chatInput = createChatInput();
		createSseResponse([
			'data: {"type":"debug","event":"request_received","elapsed_ms":0,"request_id":"12345678-1234-1234-1234-123456789abc","details":{}}\n\ndata: {"type":"done"}\n\n',
		]);
		await streamDolmenChatReply(chatInput);
		expect(chatInput.onReplyDone).toHaveBeenCalledOnce();
	});
	it("GSSC와 규칙 검사는 terminal 전에만 독립적으로 전달한다", async () => {
		const chatInput = createChatInput();
		const onDebugEvent = vi.fn();
		const frame = (event: string, payload: Record<string, unknown>) =>
			`data: ${JSON.stringify({ type: "debug", event, elapsed_ms: 2, request_id: TEST_REQUEST_ID, details: {}, ...payload })}\n\n`;
		createSseResponse([
			frame("context_built", { context: { malformed: true } }),
			frame("context_built", { context: contextWireFixture() }),
			frame("answer_evaluated", { evaluation: ruleWireFixture() }),
			'data: {"type":"chunk","text":"본문"}\n\ndata: {"type":"done"}\n\n',
			frame("answer_evaluated", { evaluation: ruleWireFixture() }),
		]);
		await streamDolmenChatReply({ ...chatInput, onDebugEvent });
		expect(onDebugEvent).toHaveBeenCalledTimes(2);
		expect(onDebugEvent.mock.calls[0]?.[0].context).toMatchObject({
			revision: 7,
			budget: { inputLimit: 1000 },
		});
		expect(onDebugEvent.mock.calls[1]?.[0].evaluation).toMatchObject({
			status: "completed",
		});
		expect(chatInput.onAssistantChunk).toHaveBeenCalledExactlyOnceWith("본문");
		expect(chatInput.onReplyDone).toHaveBeenCalledOnce();
	});
	it("부분 본문과 출력 한도 metrics 뒤 error를 정상 완료로 바꾸지 않는다", async () => {
		const chatInput = createChatInput();
		const onDebugEvent = vi.fn();
		const eventFrame = (event: string, details: Record<string, unknown>) =>
			`data: ${JSON.stringify({ type: "debug", event, elapsed_ms: 2, request_id: TEST_REQUEST_ID, details })}\n\n`;
		createSseResponse([
			'data: {"type":"chunk","text":"완료되지 않은 본문"}\n\n',
			eventFrame("reply_metrics", {
				attempt: 1,
				run_status: "output_limit",
				stop_reason: "length",
				completion_tokens: 100,
			}),
			eventFrame("reply_failed", { reason: "output_limit", attempt: 1 }),
			'data: {"type":"error","message":"출력 한도에 도달해 답변을 완료하지 못했습니다."}\n\n',
			eventFrame("reply_metrics", {
				attempt: 1,
				run_status: "completed",
				total_tokens: 200,
			}),
		]);
		await streamDolmenChatReply({ ...chatInput, onDebugEvent });
		expect(chatInput.onAssistantChunk).toHaveBeenCalledExactlyOnceWith(
			"완료되지 않은 본문",
		);
		expect(onDebugEvent).toHaveBeenCalledTimes(2);
		expect(chatInput.onReplyDone).not.toHaveBeenCalled();
		expect(chatInput.onReplyError).toHaveBeenCalledOnce();
	});
});
