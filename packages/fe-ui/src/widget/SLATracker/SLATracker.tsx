"use client";

import { Card, ProgressBar } from "@heroui/react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface SLAMetric {
	/** 라벨 (예: 첫 응답, 해결) */
	label: string;
	/** 실제 소요 시간 (분 단위) */
	elapsedMinutes: number;
	/** 목표 시간 (분 단위) */
	targetMinutes: number;
	/** 완료 여부 */
	isCompleted?: boolean;
	/** 위반 여부 */
	isBreached?: boolean;
}

export interface SLATrackerProps {
	/** 첫 응답 메트릭 */
	firstResponse?: SLAMetric;
	/** 해결 시간 메트릭 */
	resolution?: SLAMetric;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * SLATracker 컴포넌트
 * SLA(서비스 수준 협약) 추적 정보를 시각화합니다.
 * 첫 응답 시간과 해결 시간을 목표 대비 진행 바로 표시합니다.
 *
 * @example
 * ```tsx
 * <SLATracker
 *   firstResponse={{
 *     label: "첫 응답",
 *     elapsedMinutes: 30,
 *     targetMinutes: 60,
 *     isCompleted: true,
 *   }}
 *   resolution={{
 *     label: "해결",
 *     elapsedMinutes: 90,
 *     targetMinutes: 240,
 *     isBreached: false,
 *   }}
 * />
 * ```
 */
export const SLATracker = observer(
	({ firstResponse, resolution, className = "" }: SLATrackerProps) => {
		return (
			<Card className={`bg-surface ${className}`}>
				<Card.Content className="gap-4 p-4">
					{/* 헤더 */}
					<h3 className="text-sm font-semibold text-muted">⏱️ SLA 추적</h3>

					<div className="flex flex-col gap-4">
						{/* 첫 응답 */}
						{firstResponse && <SLAMetricItem metric={firstResponse} />}

						{/* 해결 */}
						{resolution && <SLAMetricItem metric={resolution} />}
					</div>
				</Card.Content>
			</Card>
		);
	},
);

/** 개별 SLA 메트릭 아이템 */
interface SLAMetricItemProps {
	metric: SLAMetric;
}

const SLAMetricItem = observer(({ metric }: SLAMetricItemProps) => {
	const progress = Math.min(
		(metric.elapsedMinutes / metric.targetMinutes) * 100,
		100,
	);

	const { status, color, icon } = getMetricStatus(metric);
	const elapsedFormatted = formatTime(metric.elapsedMinutes);
	const targetFormatted = formatTime(metric.targetMinutes);

	return (
		<div className="flex flex-col gap-2">
			{/* 라벨과 상태 */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{icon}
					<span className="text-sm text-foreground">{metric.label}</span>
				</div>
				<span className={`text-xs font-medium ${color}`}>{status}</span>
			</div>

			{/* 시간 표시 */}
			<div className="flex items-center justify-between text-xs text-muted">
				<span>{elapsedFormatted}</span>
				<span>목표: {targetFormatted}</span>
			</div>

			{/* 진행 바 */}
			<ProgressBar
				aria-label={`${metric.label} 진행률`}
				value={progress}
				color={
					metric.isBreached
						? "danger"
						: metric.isCompleted
							? "success"
							: "accent"
				}
				size="sm"
				className="h-2"
			/>
		</div>
	);
});

/** 메트릭 상태 계산 */
function getMetricStatus(metric: SLAMetric) {
	if (metric.isCompleted) {
		return {
			status: "완료",
			color: "text-success",
			icon: <CheckCircle className="size-4 text-success" />,
		};
	}

	if (metric.isBreached) {
		return {
			status: "위반",
			color: "text-danger",
			icon: <AlertTriangle className="size-4 text-danger" />,
		};
	}

	const remaining = metric.targetMinutes - metric.elapsedMinutes;
	if (remaining <= 0) {
		return {
			status: "위반",
			color: "text-danger",
			icon: <AlertTriangle className="size-4 text-danger" />,
		};
	}

	if (remaining <= metric.targetMinutes * 0.2) {
		return {
			status: "임박",
			color: "text-warning",
			icon: <Clock className="size-4 text-warning" />,
		};
	}

	return {
		status: "진행중",
		color: "text-accent",
		icon: <Clock className="size-4 text-accent" />,
	};
}

/** 시간 포맷팅 (분 단위 -> "X시간 Y분" 또는 "Y분") */
function formatTime(minutes: number): string {
	if (minutes < 60) {
		return `${minutes}분`;
	}

	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (mins === 0) {
		return `${hours}시간`;
	}

	return `${hours}시간 ${mins}분`;
}

SLATracker.displayName = "SLATracker";
