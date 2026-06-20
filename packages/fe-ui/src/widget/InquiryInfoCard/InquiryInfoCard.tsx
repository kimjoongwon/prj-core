"use client";

import { Card } from "@heroui/react";
import { Clock, Hash, MessageSquare, User } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

export interface InquiryInfoCardProps {
	/** 문의 번호 */
	inquiryNumber: string;
	/** 문의 제목 */
	title: string;
	/** 채널 (웹, 이메일, 채팅, SMS, 전화, 방문) */
	channel: string;
	/** 채널 아이콘 */
	channelIcon?: ReactNode;
	/** 접수일 */
	createdAt: string;
	/** 감정 분석 결과 */
	sentiment?: {
		type: "positive" | "neutral" | "negative";
		label: string;
		confidence: number;
	};
	/** 온라인 참여자 목록 */
	onlineParticipants?: string[];
	/** 추가 CSS 클래스 */
	className?: string;
}

const sentimentConfig = {
	positive: { color: "success" as const, emoji: "😊" },
	neutral: { color: "default" as const, emoji: "😐" },
	negative: { color: "danger" as const, emoji: "😠" },
};

/**
 * InquiryInfoCard 컴포넌트
 * 문의의 기본 정보(번호, 제목, 채널, 접수일)와 감정 분석 결과, 온라인 참여자를 표시합니다.
 *
 * @example
 * ```tsx
 * <InquiryInfoCard
 *   inquiryNumber="INQ-2026-0225-001"
 *   title="배송 일정 문의"
 *   channel="CHAT"
 *   channelIcon={<MessageSquare className="size-4" />}
 *   createdAt="2026.02.25 14:30"
 *   sentiment={{ type: "neutral", label: "중립", confidence: 85 }}
 *   onlineParticipants={["홍길동", "김상담"]}
 * />
 * ```
 */
export const InquiryInfoCard = observer(
	({
		inquiryNumber,
		title,
		channel,
		channelIcon,
		createdAt,
		sentiment,
		onlineParticipants = [],
		className = "",
	}: InquiryInfoCardProps) => {
		const sentimentInfo = sentiment ? sentimentConfig[sentiment.type] : null;

		return (
			<Card className={`bg-surface ${className}`}>
				<Card.Content className="gap-3 p-4">
					{/* 헤더 */}
					<div className="flex items-start justify-between">
						<h3 className="text-sm font-semibold text-muted">📋 문의 정보</h3>
					</div>

					{/* 문의 번호 */}
					<div className="flex items-center gap-2">
						<Hash className="size-4 text-muted" />
						<span className="text-sm text-muted">문의번호:</span>
						<span className="font-mono text-sm font-medium text-foreground">
							{inquiryNumber}
						</span>
					</div>

					{/* 제목 */}
					<div>
						<span className="text-sm text-muted">제목: </span>
						<span className="font-semibold text-foreground">{title}</span>
					</div>

					{/* 채널 */}
					<div className="flex items-center gap-2">
						{channelIcon || <MessageSquare className="size-4 text-muted" />}
						<span className="text-sm text-muted">채널:</span>
						<span className="text-sm text-foreground">{channel}</span>
					</div>

					{/* 접수일 */}
					<div className="flex items-center gap-2">
						<Clock className="size-4 text-muted" />
						<span className="text-sm text-muted">접수일:</span>
						<span className="text-sm text-foreground">{createdAt}</span>
					</div>

					{/* 감정 분석 */}
					{sentiment && sentimentInfo && (
						<div className="flex items-center gap-2 rounded-lg bg-surface-secondary p-2">
							<span className="text-sm">💡 감정 분석:</span>
							<span className="text-lg">{sentimentInfo.emoji}</span>
							<span className="text-sm font-medium">{sentiment.label}</span>
							<span className="text-xs text-muted">
								(신뢰도 {sentiment.confidence}%)
							</span>
						</div>
					)}

					{/* 온라인 참여자 */}
					{onlineParticipants.length > 0 && (
						<div className="flex items-center gap-2">
							<User className="size-4 text-success" />
							<span className="text-sm text-success">🟢 온라인:</span>
							<span className="text-sm text-foreground">
								{onlineParticipants.join(", ")}
							</span>
						</div>
					)}
				</Card.Content>
			</Card>
		);
	},
);

InquiryInfoCard.displayName = "InquiryInfoCard";
