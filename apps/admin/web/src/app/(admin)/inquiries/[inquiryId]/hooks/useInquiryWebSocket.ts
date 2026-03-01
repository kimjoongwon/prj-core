"use client";

import {
	type InquiryMessage,
	type InquiryParticipant,
} from "@cocrepo/type";
import { createLogger } from "@cocrepo/toolkit";
import { useCallback, useEffect, useRef, useState } from "react";

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
		wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000",
		autoConnect = true,
		onConnect,
		onDisconnect,
		onError,
	} = options;

	const socketRef = useRef<WebSocket | null>(null);
	const [status, setStatus] = useState<WebSocketStatus>("disconnected");
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Store에 연결 상태 반영
	useEffect(() => {
		state.setWebSocketConnected(status === "connected");
	}, [status, state]);

	// WebSocket 이벤트 핸들러
	const handleOpen = useCallback(() => {
		logger.info("WebSocket 연결됨");
		setStatus("connected");
		onConnect?.();

		// 문의 방 참여 이벤트 전송
		if (socketRef.current) {
			socketRef.current.send(
				JSON.stringify({
					type: "inquiry:join",
					data: { inquiryId },
				}),
			);
		}
	}, [inquiryId, onConnect]);

	const handleClose = useCallback(() => {
		logger.info("WebSocket 연결 해제됨");
		setStatus("disconnected");
		onDisconnect?.();
	}, [onDisconnect]);

	const handleError = useCallback(
		(event: Event) => {
			logger.error("WebSocket 에러:", event.type);
			setStatus("disconnected");
			onError?.(new Error("WebSocket connection error"));
		},
		[onError],
	);

	const handleMessage = useCallback(
		(event: MessageEvent) => {
			try {
				const { type, data } = JSON.parse(event.data) as {
					type: keyof WebSocketEvents;
					data: unknown;
				};

				logger.debug("WebSocket 메시지 수신:", type);

				switch (type) {
					case "inquiry:message:new":
						state.addMessage(data as InquiryMessage);
						break;
					case "inquiry:message:delivered": {
						const { messageId, deliveredAt } = data as {
							messageId: string;
							deliveredAt: string;
						};
						state.updateMessage(messageId, { deliveredAt });
						break;
					}
					case "inquiry:message:read": {
						const { messageId, readAt } = data as {
							messageId: string;
							readAt: string;
						};
						state.updateMessage(messageId, { readAt });
						break;
					}
					case "inquiry:typing:start": {
						const { userId } = data as { userId: string };
						state.setTyping(userId, true);
						break;
					}
					case "inquiry:typing:stop": {
						const { userId } = data as { userId: string };
						state.setTyping(userId, false);
						break;
					}
					case "inquiry:participant:joined":
						state.addParticipant(data as InquiryParticipant);
						break;
					case "inquiry:participant:left": {
						const { userId } = data as { userId: string };
						state.removeParticipant(userId);
						break;
					}
					case "inquiry:participant:online": {
						const { userId } = data as { userId: string };
						state.updateParticipant(userId, { isOnline: true });
						break;
					}
					case "inquiry:participant:offline": {
						const { userId } = data as { userId: string };
						state.updateParticipant(userId, { isOnline: false });
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
		},
		[state],
	);

	// WebSocket 연결
	const connect = useCallback(() => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			logger.info("이미 연결되어 있습니다.");
			return;
		}

		logger.info("WebSocket 연결 시도:", wsUrl);
		setStatus("connecting");

		try {
			const socket = new WebSocket(`${wsUrl}/inquiries/${inquiryId}`);
			socketRef.current = socket;

			socket.onopen = handleOpen;
			socket.onclose = handleClose;
			socket.onerror = handleError;
			socket.onmessage = handleMessage;
		} catch (error) {
			logger.error("WebSocket 연결 실패:", String(error));
			setStatus("disconnected");
			onError?.(error as Error);
		}
	}, [
		wsUrl,
		inquiryId,
		handleOpen,
		handleClose,
		handleError,
		handleMessage,
		onError,
	]);

	// WebSocket 연결 해제
	const disconnect = useCallback(() => {
		if (socketRef.current) {
			// 문의 방 퇴장 이벤트 전송
			if (socketRef.current.readyState === WebSocket.OPEN) {
				socketRef.current.send(
					JSON.stringify({
						type: "inquiry:leave",
						data: { inquiryId },
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
	}, [inquiryId]);

	// 재연결
	const reconnect = useCallback(() => {
		logger.info("WebSocket 재연결 시도");
		disconnect();
		connect();
	}, [disconnect, connect]);

	// 메시지 전송
	const sendMessage = useCallback(
		(content: string, attachments?: File[]) => {
			if (socketRef.current?.readyState !== WebSocket.OPEN) {
				logger.info("WebSocket이 연결되지 않았습니다.");
				return;
			}

			const message = {
				type: "inquiry:message:send",
				data: {
					inquiryId,
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
		},
		[inquiryId],
	);

	// 타이핑 상태 전송
	const sendTypingStatus = useCallback(
		(isTyping: boolean) => {
			if (socketRef.current?.readyState !== WebSocket.OPEN) {
				return;
			}

			socketRef.current.send(
				JSON.stringify({
					type: isTyping ? "inquiry:typing:start" : "inquiry:typing:stop",
					data: { inquiryId },
				}),
			);
		},
		[inquiryId],
	);

	// 자동 연결 및 정리
	useEffect(() => {
		if (autoConnect) {
			connect();
		}

		return () => {
			disconnect();
		};
	}, [autoConnect, connect, disconnect]);

	// 페이지 이탈 시 정리
	useEffect(() => {
		const handleBeforeUnload = () => {
			disconnect();
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [disconnect]);

	return {
		status,
		reconnect,
		disconnect,
		sendMessage,
		sendTypingStatus,
	};
}
