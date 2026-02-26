"use client";

import { Card, CardBody, CardHeader, ScrollShadow, Spacer } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useRef, useEffect } from "react";
import { useInquiryStore } from "@cocrepo/store";
import type { InquiryMessage, InquiryParticipant } from "@cocrepo/store";
import { TypingIndicator } from "../../ui/feedback/TypingIndicator/TypingIndicator";
import { WebSocketConnectionStatus } from "../../ui/feedback/WebSocketConnectionStatus/WebSocketConnectionStatus";
import { MessageStatus } from "../../ui/feedback/MessageStatus/MessageStatus";
import { InquiryReplyForm } from "../InquiryReplyForm";

export interface RealtimeChatPanelProps {
	/** 문의 ID */
	inquiryId: string;
	/** 초기 메시지 목록 (선택) */
	initialMessages?: InquiryMessage[];
	/** 참여자 목록 */
	participants?: InquiryParticipant[];
	/** 메시지 전송 핸들러 */
	onSendMessage: (content: string, attachments?: File[]) => void;
	/** 타이핑 시작 핸들러 */
	onTypingStart?: () => void;
	/** 타이핑 중지 핸들러 */
	onTypingStop?: () => void;
	/** 재연결 핸들러 */
	onReconnect?: () => void;
	/** AI 초안 생성 핸들러 */
	onGenerateDraft?: () => void;
	/** 지식베이스 검색 핸들러 */
	onSearchKnowledge?: () => void;
	/** 메시지 전송 중 여부 */
	isSending?: boolean;
	/** AI 초안 생성 중 여부 */
	isGeneratingDraft?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
}

interface MessageBubbleProps {
	message: InquiryMessage;
	currentUserId?: string;
}

const MessageBubble = observer(({ message, currentUserId }: MessageBubbleProps) => {
	const isCurrentUser = message.senderId === currentUserId;
	const isAI = message.senderType === "AI";
	const isSystem = message.senderType === "SYSTEM";

	// 시스템 메시지는 중앙 정렬
	if (isSystem) {
		return (
			<div className="flex justify-center">
				<span className="rounded-full bg-default-100 px-3 py-1 text-xs text-default-500">
					{message.content}
				</span>
			</div>
		);
	}

	return (
		<div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`max-w-[70%] rounded-2xl px-4 py-2 ${
					isCurrentUser
						? "bg-primary text-primary-foreground"
						: isAI
							? "bg-secondary-100 text-secondary-700"
							: "bg-content2 text-default-800"
				}`}
			>
				{/* 발신자 표시 (다른 사용자 메시지) */}
				{!isCurrentUser && !isAI && (
					<span className="mb-1 block text-xs font-medium text-default-500">
						{message.senderId}
					</span>
				)}

				{/* AI 표시 */}
				{isAI && (
					<span className="mb-1 block text-xs font-medium text-secondary-500">
						🤖 AI 어시스턴트
					</span>
				)}

				{/* 메시지 내용 */}
				<p className="text-sm whitespace-pre-wrap">{message.content}</p>

				{/* 시간 및 상태 */}
				<div className="mt-1 flex items-center justify-end gap-1">
					<span className="text-[10px] opacity-70">
						{new Date(message.createdAt).toLocaleTimeString("ko-KR", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
					{isCurrentUser && (
						<MessageStatus
							deliveredAt={message.deliveredAt}
							readAt={message.readAt}
						/>
					)}
				</div>
			</div>
		</div>
	);
});

/**
 * RealtimeChatPanel 컴포넌트
 * 실시간 채팅 패널로 메시지 목록, 타이핑 표시, 메시지 입력 폼, WebSocket 연결 상태를 포함합니다.
 *
 * @example
 * ```tsx
 * <RealtimeChatPanel
 *   inquiryId="inq-123"
 *   onSendMessage={handleSendMessage}
 *   onTypingStart={() => socket.emit('typing:start')}
 *   onTypingStop={() => socket.emit('typing:stop')}
 *   onReconnect={() => socket.connect()}
 * />
 * ```
 */
export const RealtimeChatPanel = observer(
	({
		inquiryId,
		initialMessages,
		participants,
		onSendMessage,
		onTypingStart,
		onTypingStop,
		onReconnect,
		onGenerateDraft,
		onSearchKnowledge,
		isSending = false,
		isGeneratingDraft = false,
		className = "",
	}: RealtimeChatPanelProps) => {
		const store = useInquiryStore();
		const scrollRef = useRef<HTMLDivElement>(null);

		// Store에서 상태 가져오기
		const messages = store.messages.length > 0 ? store.messages : (initialMessages ?? []);
		const typingUserNames = store.typingUserNames;
		const isConnected = store.isWebSocketConnected;
		const isTyping = store.isTyping;

		// 새 메시지 추가 시 자동 스크롤
		useEffect(() => {
			if (scrollRef.current) {
				scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
			}
		}, [messages.length]);

		// 문의 ID 설정
		useEffect(() => {
			store.setCurrentInquiry(inquiryId);
			return () => store.setCurrentInquiry(null);
		}, [inquiryId, store]);

		// 참여자 목록 설정
		useEffect(() => {
			if (participants) {
				store.setParticipants(participants);
			}
		}, [participants, store]);

		const handleSendMessage = (content: string, attachments?: File[]) => {
			onSendMessage(content, attachments);
		};

		const handleTypingStart = () => {
			if (!isTyping) {
				store.startTyping();
				onTypingStart?.();
			}
		};

		const handleTypingStop = () => {
			if (isTyping) {
				store.stopTyping();
				onTypingStop?.();
			}
		};

		return (
			<Card className={`flex h-full flex-col ${className}`} shadow="sm">
				{/* 헤더: 연결 상태 */}
				<CardHeader className="flex items-center justify-between px-4 py-2">
					<span className="text-sm font-medium text-default-600">실시간 채팅</span>
					<WebSocketConnectionStatus
						status={isConnected ? "connected" : "disconnected"}
						onReconnect={onReconnect}
					/>
				</CardHeader>

				{/* 메시지 목록 */}
				<CardBody className="flex-1 overflow-hidden p-0">
					<ScrollShadow ref={scrollRef} className="flex-1 px-4 py-2">
						<div className="flex flex-col gap-3">
							{messages.map((message) => (
								<MessageBubble key={message.id} message={message} />
							))}
						</div>
					</ScrollShadow>

					{/* 타이핑 표시 */}
					{typingUserNames.length > 0 && (
						<div className="px-4 pb-2">
							<TypingIndicator userNames={typingUserNames} />
						</div>
					)}
				</CardBody>

				<Spacer y={2} />

				{/* 메시지 입력 폼 */}
				<div className="border-t border-divider p-4">
					<InquiryReplyForm
						onSubmit={handleSendMessage}
						onTypingStart={handleTypingStart}
						onTypingStop={handleTypingStop}
						onGenerateDraft={onGenerateDraft}
						onSearchKnowledge={onSearchKnowledge}
						isSending={isSending}
						isGeneratingDraft={isGeneratingDraft}
						placeholder="메시지를 입력하세요..."
					/>
				</div>
			</Card>
		);
	},
);

RealtimeChatPanel.displayName = "RealtimeChatPanel";
