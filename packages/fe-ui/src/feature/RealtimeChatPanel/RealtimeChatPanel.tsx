"use client";

import type { InquiryMessage, InquiryParticipant } from "@cocrepo/type";
import { Card, ScrollShadow } from "@heroui/react";
import { Check, CheckCheck, Wifi, WifiOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { InquiryReplyForm } from "../../form/InquiryReplyForm";
import { Button } from "../../input/Button/Button";

export interface RealtimeChatPanelProps {
	/** 문의 ID */
	inquiryId: string;
	/** 메시지 목록 */
	messages?: InquiryMessage[];
	/** 초기 메시지 목록 (선택) */
	initialMessages?: InquiryMessage[];
	/** 참여자 목록 */
	participants?: InquiryParticipant[];
	/** 타이핑 사용자 목록 */
	typingUserNames?: string[];
	/** WebSocket 연결 여부 */
	isWebSocketConnected?: boolean;
	/** 현재 사용자 타이핑 여부 */
	isTyping?: boolean;
	/** 메시지 전송 핸들러 */
	onSendMessage: (content: string, attachments?: File[]) => void;
	/** 타이핑 시작 핸들러 */
	onTypingStart?: () => void;
	/** 타이핑 중지 핸들러 */
	onTypingStop?: () => void;
	/** 재연결 핸들러 */
	onReconnect?: () => void;
	/** 지식베이스 검색 핸들러 */
	onSearchKnowledge?: () => void;
	/** 메시지 전송 중 여부 */
	isSending?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
}

interface MessageBubbleProps {
	message: InquiryMessage;
	currentUserId?: string;
}

const formatStatusTime = (value?: Date | string | null) =>
	value ? new Date(value).toLocaleTimeString() : "";

const renderMessageStatus = (
	deliveredAt?: Date | string | null,
	readAt?: Date | string | null,
) => {
	if (readAt) {
		return (
			<span
				className="inline-flex items-center text-[10px] text-accent"
				title={`읽음: ${formatStatusTime(readAt)}`}
			>
				<CheckCheck className="size-3" aria-label="읽음" />
			</span>
		);
	}

	if (deliveredAt) {
		return (
			<span
				className="inline-flex items-center text-[10px] text-muted"
				title={`전달됨: ${formatStatusTime(deliveredAt)}`}
			>
				<Check className="size-3" aria-label="전달됨" />
			</span>
		);
	}

	return (
		<span
			className="inline-flex items-center text-[10px] text-muted"
			title="전송 중..."
		>
			<Check className="size-3" aria-label="전송 중" />
		</span>
	);
};

const getTypingText = (userNames: string[]) => {
	if (userNames.length === 1) {
		return `${userNames[0]}님이 타이핑 중입니다...`;
	}
	if (userNames.length === 2) {
		return `${userNames[0]}님과 ${userNames[1]}님이 타이핑 중입니다...`;
	}
	return `${userNames[0]}님 외 ${userNames.length - 1}명이 타이핑 중입니다...`;
};

const MessageBubble = observer(
	({ message, currentUserId }: MessageBubbleProps) => {
		const isCurrentUser = message.senderId === currentUserId;
		const isSystem = message.senderType === "SYSTEM";

		// 시스템 메시지는 중앙 정렬
		if (isSystem) {
			return (
				<div className="flex justify-center">
					<span className="rounded-full bg-default px-3 py-1 text-xs text-muted">
						{message.content}
					</span>
				</div>
			);
		}

		return (
			<div
				className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
			>
				<div
					className={`max-w-[70%] rounded-2xl px-4 py-2 ${
						isCurrentUser
							? "bg-accent text-accent-foreground"
							: "bg-surface-secondary text-foreground"
					}`}
				>
					{/* 발신자 표시 (다른 사용자 메시지) */}
					{!isCurrentUser && message.senderId ? (
						<span className="mb-1 block text-xs font-medium text-muted">
							{message.senderId}
						</span>
					) : null}

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
						{isCurrentUser
							? renderMessageStatus(message.deliveredAt, message.readAt)
							: null}
					</div>
				</div>
			</div>
		);
	},
);

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
		messages,
		initialMessages,
		typingUserNames,
		isWebSocketConnected = false,
		isTyping = false,
		onSendMessage,
		onTypingStart,
		onTypingStop,
		onReconnect,
		onSearchKnowledge,
		isSending = false,
		className = "",
	}: RealtimeChatPanelProps) => {
		const scrollRef = useRef<HTMLDivElement>(null);

		const currentMessages = messages ?? initialMessages ?? [];
		const currentTypingUserNames = typingUserNames ?? [];

		// 새 메시지 추가 시 자동 스크롤
		useEffect(() => {
			if (scrollRef.current) {
				scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
			}
		}, [currentMessages.length]);

		const handleSendMessage = (content: string, attachments?: File[]) => {
			onSendMessage(content, attachments);
		};

		const handleTypingStart = () => {
			if (!isTyping) {
				onTypingStart?.();
			}
		};

		const handleTypingStop = () => {
			if (isTyping) {
				onTypingStop?.();
			}
		};

		return (
			<Card className={`flex h-full flex-col ${className}`}>
				{/* 헤더: 연결 상태 */}
				<Card.Header className="flex items-center justify-between px-4 py-2">
					<span className="text-sm font-medium text-muted">실시간 채팅</span>
					<div className="flex items-center gap-2">
						<Chip
							color={isWebSocketConnected ? "success" : "danger"}
							variant="flat"
							size="sm"
							startContent={
								isWebSocketConnected ? (
									<Wifi className="size-3" />
								) : (
									<WifiOff className="size-3" />
								)
							}
						>
							{isWebSocketConnected ? "연결됨" : "연결 끊김"}
						</Chip>
						{!isWebSocketConnected && onReconnect ? (
							<Button
								size="sm"
								variant="flat"
								color="danger"
								onPress={onReconnect}
								className="h-7 px-2 text-xs"
								startContent={<Wifi className="size-3" />}
							>
								재연결
							</Button>
						) : null}
					</div>
				</Card.Header>

				{/* 메시지 목록 */}
				<Card.Content className="flex-1 overflow-hidden p-0">
					<ScrollShadow ref={scrollRef} className="flex-1 px-4 py-2">
						<div className="flex flex-col gap-3">
							{currentMessages.map((message) => (
								<MessageBubble key={message.id} message={message} />
							))}
						</div>
					</ScrollShadow>

					{/* 타이핑 표시 */}
					{currentTypingUserNames.length > 0 && (
						<div className="px-4 pb-2">
							<div className="inline-flex items-center gap-1 text-xs text-muted">
								<span className="inline-flex gap-0.5" aria-hidden>
									<span className="animate-bounce delay-0">.</span>
									<span className="animate-bounce delay-100">.</span>
									<span className="animate-bounce delay-200">.</span>
								</span>
								<span>{getTypingText(currentTypingUserNames)}</span>
							</div>
						</div>
					)}
				</Card.Content>

				<div className="h-2" />

				{/* 메시지 입력 폼 */}
				<div className="border-t border-border p-4">
					<InquiryReplyForm
						onSubmit={handleSendMessage}
						onTypingStart={handleTypingStart}
						onTypingStop={handleTypingStop}
						onSearchKnowledge={onSearchKnowledge}
						isSending={isSending}
						placeholder="메시지를 입력하세요..."
					/>
				</div>
			</Card>
		);
	},
);

RealtimeChatPanel.displayName = "RealtimeChatPanel";
