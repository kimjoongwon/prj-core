"use client";

import { observer } from "mobx-react-lite";
import { AlertTriangle, CheckCircle, Clock, Inbox, Loader2, XCircle } from "lucide-react";
import { StatsCard } from "../StatsCard";

export interface InquiryStats {
	/** 전체 문의 수 */
	total: number;
	/** 신규 문의 수 */
	newCount: number;
	/** 진행중 문의 수 */
	inProgress: number;
	/** 해결된 문의 수 */
	resolved: number;
	/** SLA 위반 수 */
	slaBreached: number;
}

export interface InquiryStatsCardsProps {
	/** 통계 데이터 */
	stats: InquiryStats;
	/** 카드 클릭 핸들러 (상태 필터링) */
	onStatusClick?: (status: string | undefined) => void;
	/** 활성 상태 필터 */
	activeStatus?: string;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * InquiryStatsCards 컴포넌트
 * 문의 현황 통계를 카드 형태로 표시합니다.
 * 전체, 신규, 진행중, 해결, SLA 위반 건수를 보여주며 클릭 시 해당 상태로 필터링합니다.
 *
 * @example
 * ```tsx
 * <InquiryStatsCards
 *   stats={{
 *     total: 150,
 *     newCount: 12,
 *     inProgress: 45,
 *     resolved: 89,
 *     slaBreached: 4,
 *   }}
 *   activeStatus="IN_PROGRESS"
 *   onStatusClick={(status) => handleStatusFilter(status)}
 * />
 * ```
 */
export const InquiryStatsCards = observer(
	({
		stats,
		onStatusClick,
		activeStatus,
		className = "",
	}: InquiryStatsCardsProps) => {
		const cards = [
			{
				key: "all",
				title: "전체",
				value: stats.total,
				icon: <Inbox className="size-5" />,
				color: "default" as const,
				status: undefined,
			},
			{
				key: "NEW",
				title: "신규",
				value: stats.newCount,
				icon: <Inbox className="size-5" />,
				color: "primary" as const,
				status: "NEW",
			},
			{
				key: "IN_PROGRESS",
				title: "진행중",
				value: stats.inProgress,
				icon: <Loader2 className="size-5" />,
				color: "warning" as const,
				status: "IN_PROGRESS",
			},
			{
				key: "RESOLVED",
				title: "해결",
				value: stats.resolved,
				icon: <CheckCircle className="size-5" />,
				color: "success" as const,
				status: "RESOLVED",
			},
			{
				key: "SLA_BREACH",
				title: "SLA 위반",
				value: stats.slaBreached,
				icon: <AlertTriangle className="size-5" />,
				color: "danger" as const,
				status: "SLA_BREACH",
			},
		];

		return (
			<div className={`grid grid-cols-2 gap-4 md:grid-cols-5 ${className}`}>
				{cards.map((card) => (
					<StatsCard
						key={card.key}
						title={card.title}
						value={card.value}
						icon={card.icon}
						color={card.color}
						onPress={() => onStatusClick?.(card.status)}
						className={`cursor-pointer transition-all ${
							activeStatus === card.status
								? "ring-2 ring-primary"
								: ""
						}`}
					/>
				))}
			</div>
		);
	},
);

InquiryStatsCards.displayName = "InquiryStatsCards";
