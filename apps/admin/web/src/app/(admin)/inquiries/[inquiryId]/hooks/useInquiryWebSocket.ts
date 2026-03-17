"use client";

import { createLogger } from "@cocrepo/toolkit";
import { type InquiryMessage, type InquiryParticipant } from "@cocrepo/type";
import { useEffect, useRef, useState } from "react";
import { resolveWebSocketBaseUrl } from "@/runtime-urls";

const logger = createLogger("[useInquiryWebSocket]");

/** WebSocket 연결 상태 */
export type WebSocketStatus = "connected" | "connecting" | "disconnected";

/**
 * WebSocket 이벤트 타입
 */
interface WebSocketEvents {
	"inquiry:message:new": (message: InquiryMessage) => void;
	"inquiry:message:delivered": (data: {
		messageId: string;
		deliveredAt: string;
	}) => void;
	"inquiry:message:read": (data: { messageId: string; readAt: string }) => void;
	"inquiry:typing:start": (data: { userId: string }) => void;
	"inquiry:typing:stop": (data: { userId: string }) => void;
	"inquiry:participant:joined": (participant: InquiryParticipant) => void;
	"inquiry:participant:left": (data: { userId: string }) => void;
	"inquiry:participant:online": (data: { userId: string }) => void;
	"inquiry:participant:offline": (data: { userId: string }) => void;
	"inquiry:status:changed": (data: { status: string }) => void;
}

/**
 * useInquiryWebSocket 훅 옵션
 */
export interface UseInquiryWebSocketOptions {
	/** 문의 ID */
	inquiryId: string;
	/** 문의 상세 페이지 로컬 상태 */
	state: {
		setWebSocketConnected: (isConnected: boolean) => void;
		addMessage: (message: InquiryMessage) => void;
		updateMessage: (
			messageId: string,
			updates: Partial<InquiryMessage>,
		) => void;
		setTyping: (userId: string, isTyping: boolean) => void;
		addParticipant: (participant: InquiryParticipant) => void;
		removeParticipant: (userId: string) => void;
		updateParticipant: (
			userId: string,
			updates: Partial<InquiryParticipant>,
		) => void;
	};
	/** WebSocket 서버 URL */
	wsUrl?: string;
	/** 자동 연결 여부 */
	autoConnect?: boolean;
	/** 연결 성공 콜백 */
	onConnect?: () => void;
	/** 연결 해제 콜백 */
	onDisconnect?: () => void;
	/** 에러 콜백 */
	onError?: (error: Error) => void;
}

/**
 * useInquiryWebSocket 훅 반환값
 */
export interface UseInquiryWebSocketReturn {
	/** WebSocket 연결 상태 */
	status: WebSocketStatus;
	/** 재연결 함수 */
	reconnect: () => void;
	/** 연결 해제 함수 */
	disconnect: () => void;
	/** 메시지 전송 함수 */
	sendMessage: (content: string, attachments?: File[]) => void;
	/** 타이핑 상태 전송 함수 */
	sendTypingStatus: (isTyping: boolean) => void;
}

/**
 * 문의 WebSocket 연결 관리 훅
 *
 * WebSocket 연결, 이벤트 처리, Store 동기화를 담당합니다.
 * 실제 Socket.IO 연결은 이 훅에서 관리합니다.
 *
 * @example
 * ```tsx
 * const { status, reconnect, sendMessage, sendTypingStatus } = useInquiryWebSocket({
 *   inquiryId: "inq-123",
 *   autoConnect: true,
 * });
 * ```
 */
export function useInquiryWebSocket(
	options: UseInquiryWebSocketOptions,
): UseInquiryWebSocketReturn {
	const {
		inquiryId,
		state,
		wsUrl = resolveWebSocketBaseUrl() ?? "ws://localhost:4000",
		autoConnect = true,
		onConnect,
		onDisconnect,
		onError,
	} = options;

	const socketRef = useRef<WebSocket | null>(null);
	const [status, setStatus] = useState<WebSocketStatus>("disconnected");
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const latestStateRef = useRef(state);
	const latestOptionsRef = useRef({
		inquiryId,
		wsUrl,
		onConnect,
		onDisconnect,
		onError,
	});

	latestStateRef.current = state;
	latestOptionsRef.current = {
		inquiryId,
		wsUrl,
		onConnect,
		onDisconnect,
		onError,
	};

	// Store에 연결 상태 반영
	useEffect(() => {
		latestStateRef.current.setWebSocketConnected(status === "connected");
	}, [status]);

	// WebSocket 이벤트 핸들러
	const handleOpen = () => {
		const { inquiryId: currentInquiryId, onConnect: currentOnConnect } =
			latestOptionsRef.current;

		logger.info("WebSocket 연결됨");
		setStatus("connected");
		currentOnConnect?.();

		// 문의 방 참여 이벤트 전송
		if (socketRef.current) {
			socketRef.current.send(
				JSON.stringify({
					type: "inquiry:join",
					data: { inquiryId: currentInquiryId },
				}),
			);
		}
	};

	const handleClose = () => {
		const { onDisconnect: currentOnDisconnect } = latestOptionsRef.current;
		logger.info("WebSocket 연결 해제됨");
		setStatus("disconnected");
		currentOnDisconnect?.();
	};

	const handleError = (event: Event) => {
		const { onError: currentOnError } = latestOptionsRef.current;
		logger.error("WebSocket 에러:", event.type);
		setStatus("disconnected");
		currentOnError?.(new Error("WebSocket connection error"));
	};

	const handleMessage = (event: MessageEvent) => {
		const currentState = latestStateRef.current;
		try {
			const { type, data } = JSON.parse(event.data) as {
				type: keyof WebSocketEvents;
				data: unknown;
			};

			logger.debug("WebSocket 메시지 수신:", type);

			switch (type) {
				case "inquiry:message:new":
					currentState.addMessage(data as InquiryMessage);
					break;
				case "inquiry:message:delivered": {
					const { messageId, deliveredAt } = data as {
						messageId: string;
						deliveredAt: string;
					};
					currentState.updateMessage(messageId, { deliveredAt });
					break;
				}
				case "inquiry:message:read": {
					const { messageId, readAt } = data as {
						messageId: string;
						readAt: string;
					};
					currentState.updateMessage(messageId, { readAt });
					break;
				}
				case "inquiry:typing:start": {
					const { userId } = data as { userId: string };
					currentState.setTyping(userId, true);
					break;
				}
				case "inquiry:typing:stop": {
					const { userId } = data as { userId: string };
					currentState.setTyping(userId, false);
					break;
				}
				case "inquiry:participant:joined":
					currentState.addParticipant(data as InquiryParticipant);
					break;
				case "inquiry:participant:left": {
					const { userId } = data as { userId: string };
					currentState.removeParticipant(userId);
					break;
				}
				case "inquiry:participant:online": {
					const { userId } = data as { userId: string };
					currentState.updateParticipant(userId, { isOnline: true });
					break;
				}
				case "inquiry:participant:offline": {
					const { userId } = data as { userId: string };
					currentState.updateParticipant(userId, { isOnline: false });
					break;
				}
				case "inquiry:status:changed":
					// TODO: 상태 변경 처리
					logger.info("문의 상태 변경:", JSON.stringify(data));
					break;
				default:
					logger.info("알 수 없는 WebSocket 이벤트:", type);
			}
		} catch (error) {
			logger.error("WebSocket 메시지 파싱 에러:", String(error));
		}
	};

	const connectRef = useRef<() => void>(() => {});
	const disconnectRef = useRef<() => void>(() => {});

	connectRef.current = () => {
		const {
			inquiryId: currentInquiryId,
			wsUrl: currentWsUrl,
			onError: currentOnError,
		} = latestOptionsRef.current;

		if (socketRef.current?.readyState === WebSocket.OPEN) {
			logger.info("이미 연결되어 있습니다.");
			return;
		}

		logger.info("WebSocket 연결 시도:", currentWsUrl);
		setStatus("connecting");

		try {
			const socket = new WebSocket(
				`${currentWsUrl}/inquiries/${currentInquiryId}`,
			);
			socketRef.current = socket;

			socket.onopen = handleOpen;
			socket.onclose = handleClose;
			socket.onerror = handleError;
			socket.onmessage = handleMessage;
		} catch (error) {
			logger.error("WebSocket 연결 실패:", String(error));
			setStatus("disconnected");
			currentOnError?.(error as Error);
		}
	};

	disconnectRef.current = () => {
		const { inquiryId: currentInquiryId } = latestOptionsRef.current;
		if (socketRef.current) {
			// 문의 방 퇴장 이벤트 전송
			if (socketRef.current.readyState === WebSocket.OPEN) {
				socketRef.current.send(
					JSON.stringify({
						type: "inquiry:leave",
						data: { inquiryId: currentInquiryId },
					}),
				);
			}
			socketRef.current.close();
			socketRef.current = null;
		}

		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		setStatus("disconnected");
	};

	// 재연결
	const reconnect = () => {
		logger.info("WebSocket 재연결 시도");
		disconnectRef.current();
		connectRef.current();
	};

	// 연결 해제
	const disconnect = () => {
		disconnectRef.current();
	};

	// 메시지 전송
	const sendMessage = (content: string, attachments?: File[]) => {
		const { inquiryId: currentInquiryId } = latestOptionsRef.current;
		if (socketRef.current?.readyState !== WebSocket.OPEN) {
			logger.info("WebSocket이 연결되지 않았습니다.");
			return;
		}

		const message = {
			type: "inquiry:message:send",
			data: {
				inquiryId: currentInquiryId,
				content,
				attachments: attachments?.map((f) => ({
					name: f.name,
					size: f.size,
					type: f.type,
				})),
			},
		};

		socketRef.current.send(JSON.stringify(message));
		logger.debug("메시지 전송");
	};

	// 타이핑 상태 전송
	const sendTypingStatus = (isTyping: boolean) => {
		const { inquiryId: currentInquiryId } = latestOptionsRef.current;
		if (socketRef.current?.readyState !== WebSocket.OPEN) {
			return;
		}

		socketRef.current.send(
			JSON.stringify({
				type: isTyping ? "inquiry:typing:start" : "inquiry:typing:stop",
				data: { inquiryId: currentInquiryId },
			}),
		);
	};

	// 자동 연결 및 정리
	useEffect(() => {
		if (autoConnect) {
			connectRef.current();
		}

		return () => {
			disconnectRef.current();
		};
	}, [autoConnect, inquiryId, wsUrl]);

	// 페이지 이탈 시 정리
	useEffect(() => {
		const handleBeforeUnload = () => {
			disconnectRef.current();
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	return {
		status,
		reconnect,
		disconnect,
		sendMessage,
		sendTypingStatus,
	};
}
