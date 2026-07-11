"use client";

import type { InquiryMessage, InquiryParticipant } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { createContext, type ReactNode, useContext } from "react";

/**
 * WebSocket 연결 상태
 */
export type WebSocketStatus = "connected" | "connecting" | "disconnected";

/**
 * WebSocket 이벤트 핸들러 인터페이스
 */
export interface WebSocketEventHandlers {
	/** 메시지 수신 핸들러 */
	onMessageReceived?: (message: InquiryMessage) => void;
	/** 메시지 수정 핸들러 */
	onMessageUpdated?: (data: {
		messageId: string;
		updates: Partial<InquiryMessage>;
	}) => void;
	/** 메시지 삭제 핸들러 */
	onMessageDeleted?: (data: { messageId: string }) => void;
	/** 참여자 입장 핸들러 */
	onParticipantJoined?: (participant: InquiryParticipant) => void;
	/** 참여자 퇴장 핸들러 */
	onParticipantLeft?: (data: { userId: string }) => void;
	/** 참여자 상태 변경 핸들러 */
	onParticipantStatusChanged?: (data: {
		userId: string;
		updates: Partial<InquiryParticipant>;
	}) => void;
	/** 타이핑 시작 핸들러 */
	onTypingStart?: (data: { userId: string }) => void;
	/** 타이핑 중지 핸들러 */
	onTypingStop?: (data: { userId: string }) => void;
}

export interface InquiryWebSocketProviderProps {
	/** 문의 ID */
	inquiryId: string;
	/** WebSocket 연결 상태 */
	status?: WebSocketStatus;
	/** 연결 성공 핸들러 */
	onConnect?: () => void;
	/** 연결 실패 핸들러 */
	onDisconnect?: () => void;
	/** 에러 핸들러 */
	onError?: (error: Error) => void;
	/** 재연결 함수 (외부에서 제공) */
	onReconnect?: () => void;
	/** 메시지 전송 함수 (외부에서 제공) */
	sendMessage?: (content: string, attachments?: File[]) => void;
	/** 타이핑 상태 전송 함수 (외부에서 제공) */
	sendTypingStatus?: (isTyping: boolean) => void;
	/** 자식 노드 */
	children: ReactNode;
}

interface WebSocketContextValue {
	/** 연결 상태 */
	status: WebSocketStatus;
	/** 재연결 함수 */
	reconnect: () => void;
	/** 메시지 전송 함수 */
	sendMessage: ((content: string, attachments?: File[]) => void) | null;
	/** 타이핑 상태 전송 함수 */
	sendTypingStatus: ((isTyping: boolean) => void) | null;
}

const WebSocketContext = createContext<WebSocketContextValue>({
	status: "disconnected",
	reconnect: () => {},
	sendMessage: null,
	sendTypingStatus: null,
});

/**
 * WebSocket 컨텍스트를 사용하기 위한 훅
 */
export const useInquiryWebSocket = () => {
	return useContext(WebSocketContext);
};

/**
 * InquiryWebSocketProvider 컴포넌트
 *
 * WebSocket 연결 추상화 레이어입니다.
 * 실제 Socket.IO 연결은 외부에서 관리하고, 이 컴포넌트는 Store와의 연동을 담당합니다.
 *
 * @example
 * ```tsx
 * // 외부에서 Socket.IO 관리하는 경우
 * <InquiryWebSocketProvider
 *   inquiryId="inq-123"
 *   status={socketStatus}
 *   onReconnect={handleReconnect}
 *   sendMessage={handleSendMessage}
 * >
 *   <div>문의 실시간 화면</div>
 * </InquiryWebSocketProvider>
 * ```
 *
 * @remarks
 * socket.io-client는 peer dependency입니다. 사용 전 설치가 필요합니다:
 * ```bash
 * pnpm add socket.io-client
 * ```
 */
export const InquiryWebSocketProvider = observer(
	function InquiryWebSocketProvider({
		status = "disconnected",
		onReconnect,
		sendMessage,
		sendTypingStatus,
		children,
	}: InquiryWebSocketProviderProps) {
		const handleReconnect = () => {
			onReconnect?.();
		};

		const handleSendMessage = (content: string, attachments?: File[]) => {
			sendMessage?.(content, attachments);
		};

		const handleSendTypingStatus = (isTyping: boolean) => {
			sendTypingStatus?.(isTyping);
		};

		const contextValue: WebSocketContextValue = {
			status,
			reconnect: handleReconnect,
			sendMessage: sendMessage ? handleSendMessage : null,
			sendTypingStatus: sendTypingStatus ? handleSendTypingStatus : null,
		};

		return (
			<WebSocketContext.Provider value={contextValue}>
				{children}
			</WebSocketContext.Provider>
		);
	},
);

InquiryWebSocketProvider.displayName = "InquiryWebSocketProvider";
