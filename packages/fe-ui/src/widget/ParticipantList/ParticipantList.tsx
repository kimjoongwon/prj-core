"use client";

import { observer } from "mobx-react-lite";
import { Card } from "@heroui/react";
import { Chip } from "../../data-display/Chip/Chip";

export interface Participant {
	/** 참여자 ID */
	id: string;
	/** 이름 */
	name: string;
	/** 역할 */
	role: "customer" | "agent" | "supervisor";
	/** 온라인 여부 */
	isOnline: boolean;
	/** 타이핑 중 여부 */
	isTyping?: boolean;
	/** 프로필 이미지 URL */
	avatarUrl?: string;
}

export interface ParticipantListProps {
	/** 참여자 목록 */
	participants: Participant[];
	/** 참여자 클릭 핸들러 */
	onParticipantClick?: (participant: Participant) => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

const roleConfig = {
	customer: { label: "고객", color: "primary" as const },
	agent: { label: "담당자", color: "success" as const },
	supervisor: { label: "감독관", color: "warning" as const },
};

/**
 * ParticipantList 컴포넌트
 * 문의에 참여한 사용자 목록을 온라인/오프라인 상태, 타이핑 상태, 역할과 함께 표시합니다.
 *
 * @example
 * ```tsx
 * <ParticipantList
 *   participants={[
 *     { id: "1", name: "홍길동", role: "customer", isOnline: true, isTyping: true },
 *     { id: "2", name: "김상담", role: "agent", isOnline: true },
 *     { id: "3", name: "이감독", role: "supervisor", isOnline: false },
 *   ]}
 *   onParticipantClick={(p) => console.log(p)}
 * />
 * ```
 */
export const ParticipantList = observer(
	({
		participants,
		onParticipantClick,
		className = "",
	}: ParticipantListProps) => {
		const onlineParticipants = participants.filter((p) => p.isOnline);
		const offlineParticipants = participants.filter((p) => !p.isOnline);
		const typingParticipants = participants.filter((p) => p.isTyping);

		return (
			<Card className={`bg-surface ${className}`}>
				<Card.Content className="gap-3 p-4">
					{/* 헤더 */}
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-semibold text-muted">
							👥 참여자 ({participants.length})
						</h3>
						{onlineParticipants.length > 0 && (
							<span className="text-xs text-success">
								🟢 {onlineParticipants.length}명 온라인
							</span>
						)}
					</div>

					{/* 온라인 참여자 */}
					{onlineParticipants.length > 0 && (
						<div className="flex flex-col gap-2">
							{onlineParticipants.map((participant) => (
								<ParticipantItem
									key={participant.id}
									participant={participant}
									onClick={() => onParticipantClick?.(participant)}
								/>
							))}
						</div>
					)}

					{/* 오프라인 참여자 */}
					{offlineParticipants.length > 0 && (
						<div className="flex flex-col gap-2">
							{offlineParticipants.map((participant) => (
								<ParticipantItem
									key={participant.id}
									participant={participant}
									onClick={() => onParticipantClick?.(participant)}
								/>
							))}
						</div>
					)}

					{/* 타이핑 표시 */}
					{typingParticipants.length > 0 && (
						<div className="rounded-lg bg-accent-soft p-2">
							<span className="text-xs text-accent">
								🔵 {typingParticipants.map((p) => p.name).join(", ")}님이 타이핑
								중입니다...
							</span>
						</div>
					)}
				</Card.Content>
			</Card>
		);
	},
);

/** 개별 참여자 아이템 */
interface ParticipantItemProps {
	participant: Participant;
	onClick?: () => void;
}

const ParticipantItem = observer(
	({ participant, onClick }: ParticipantItemProps) => {
		const roleInfo = roleConfig[participant.role];

		return (
			<button
				type="button"
				onClick={onClick}
				className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-surface-secondary"
			>
				{/* 온라인 상태 표시 */}
				<span
					className={`size-2 rounded-full ${
						participant.isOnline ? "bg-success" : "bg-default"
					}`}
				/>

				{/* 이름 */}
				<span className="flex-1 text-sm text-foreground">
					{participant.name}
				</span>

				{/* 역할 */}
				<Chip size="sm" variant="flat" color={roleInfo.color}>
					{roleInfo.label}
				</Chip>

				{/* 타이핑 중 */}
				{participant.isTyping && (
					<span className="text-xs text-accent">작성 중...</span>
				)}
			</button>
		);
	},
);

ParticipantList.displayName = "ParticipantList";
