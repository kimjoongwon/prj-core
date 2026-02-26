"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useInquiryStore, type InquiryMessage, type InquiryParticipant } from "@cocrepo/store";

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
	onMessageUpdated?: (data: { messageId: string; updates: Partial<InquiryMessage> }) => void;
	/** 메시지 삭제 핸들러 */
	onMessageDeleted?: (data: { messageId: string }) => void;
	/** 참여자 입장 핸들러 */
	onParticipantJoined?: (participant: InquiryParticipant) => void;
	/** 참여자 퇴장 핸들러 */
	onParticipantLeft?: (data: { userId: string }) => void;
	/** 참여자 상태 변경 핸들러 */
	onParticipantStatusChanged?: (data: { userId: string; updates: Partial<InquiryParticipant> }) => void;
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
 *   <RealtimeChatPanel />
 * </InquiryWebSocketProvider>
 * ```
 *
 * @remarks
 * socket.io-client는 peer dependency입니다. 사용 전 설치가 필요합니다:
 * ```bash
 * pnpm add socket.io-client
 * ```
 */
export const InquiryWebSocketProvider = ({
	inquiryId,
	status = "disconnected",
	onConnect,
	onDisconnect,
	onError,
	onReconnect,
	sendMessage,
	sendTypingStatus,
	children,
}: InquiryWebSocketProviderProps) => {
	const store = useInquiryStore();

	// Store에 연결 상태 반영
	const isConnected = status === "connected";
	store.setWebSocketConnected(isConnected);

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
};

/**
 * Store에 메시지를 추가하는 유틸리티 함수
 * 외부에서 WebSocket 이벤트 수신 시 호출
 */
export const dispatchMessageToStore = (
	store: ReturnType<typeof useInquiryStore>,
	message: InquiryMessage,
) => {
	store.addMessage(message);
};

/**
 * Store에서 메시지를 업데이트하는 유틸리티 함수
 */
export const dispatchMessageUpdateToStore = (
	store: ReturnType<typeof useInquiryStore>,
	data: { messageId: string; updates: Partial<InquiryMessage> },
) => {
	store.updateMessage(data.messageId, data.updates);
};

/**
 * Store에서 메시지를 삭제하는 유틸리티 함수
 */
export const dispatchMessageDeleteToStore = (
	store: ReturnType<typeof useInquiryStore>,
	data: { messageId: string },
) => {
	store.removeMessage(data.messageId);
};

/**
 * Store에 참여자를 추가하는 유틸리티 함수
 */
export const dispatchParticipantJoinToStore = (
	store: ReturnType<typeof useInquiryStore>,
	participant: InquiryParticipant,
) => {
	store.addParticipant(participant);
};

/**
 * Store에서 참여자를 제거하는 유틸리티 함수
 */
export const dispatchParticipantLeaveToStore = (
	store: ReturnType<typeof useInquiryStore>,
	data: { userId: string },
) => {
	store.removeParticipant(data.userId);
};

/**
 * Store에서 참여자 상태를 업데이트하는 유틸리티 함수
 */
export const dispatchParticipantStatusChangeToStore = (
	store: ReturnType<typeof useInquiryStore>,
	data: { userId: string; updates: Partial<InquiryParticipant> },
) => {
	store.updateParticipant(data.userId, data.updates);
};

/**
 * Store에 타이핑 상태를 반영하는 유틸리티 함수
 */
export const dispatchTypingStatusToStore = (
	store: ReturnType<typeof useInquiryStore>,
	data: { userId: string; isTyping: boolean },
) => {
	store.setTyping(data.userId, data.isTyping);
};

InquiryWebSocketProvider.displayName = "InquiryWebSocketProvider";
