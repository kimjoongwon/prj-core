"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { useT } from "../../i18n";

const slaIndicatorVariants = cva("inline-flex items-center gap-1.5", {
	variants: {
		status: {
			normal: "text-success-600",
			warning: "text-warning-600",
			breach: "text-danger-600",
		},
	},
	defaultVariants: {
		status: "normal",
	},
});

export type SLAStatusValue = "normal" | "warning" | "breach";

export interface SLAIndicatorProps
	extends VariantProps<typeof slaIndicatorVariants> {
	/** 응답 기한 */
	responseDue?: Date | string | null;
	/** 해결 기한 */
	resolveDue?: Date | string | null;
	/** 첫 응답 시간 */
	firstResponseAt?: Date | string | null;
	/** 해결 시간 */
	resolvedAt?: Date | string | null;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * 남은 시간에 따른 SLA 상태 계산
 */
const calculateSLAStatus = (
	due: Date | string | null | undefined,
	completed: Date | string | null | undefined,
): { status: SLAStatusValue; remainingMs: number } => {
	if (completed) {
		const completedDate = new Date(completed);
		const dueDate = new Date(due ?? 0);
		return {
			status: completedDate <= dueDate ? "normal" : "breach",
			remainingMs: 0,
		};
	}

	if (!due) {
		return { status: "normal", remainingMs: 0 };
	}

	const now = new Date();
	const dueDate = new Date(due);
	const remainingMs = dueDate.getTime() - now.getTime();

	if (remainingMs < 0) {
		return { status: "breach", remainingMs };
	}

	// 30분 이내면 warning
	const thirtyMinutes = 30 * 60 * 1000;
	if (remainingMs <= thirtyMinutes) {
		return { status: "warning", remainingMs };
	}

	return { status: "normal", remainingMs };
};

/**
 * 남은 시간 포맷팅
 */
const formatRemaining = (ms: number, t: (key: string) => string): string => {
	if (ms < 0) {
		const absMs = Math.abs(ms);
		const minutes = Math.floor(absMs / (1000 * 60));
		if (minutes < 60) return `${minutes}${t("분 초과")}`;
		const hours = Math.floor(minutes / 60);
		return `${hours}${t("시간")} ${minutes % 60}${t("분 초과")}`;
	}

	const minutes = Math.floor(ms / (1000 * 60));
	if (minutes < 60) return `${minutes}${t("분 남음")}`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}${t("시간")} ${minutes % 60}${t("분 남음")}`;
	const days = Math.floor(hours / 24);
	return `${days}${t("일")} ${hours % 24}${t("시간 남음")}`;
};

const STATUS_CHIP_COLOR: Record<
	SLAStatusValue,
	"success" | "warning" | "danger"
> = {
	normal: "success",
	warning: "warning",
	breach: "danger",
};

const STATUS_LABEL: Record<SLAStatusValue, string> = {
	normal: "정상",
	warning: "임박",
	breach: "위반",
};

/**
 * SLA 상태를 표시하는 인디케이터 컴포넌트
 *
 * @example
 * ```tsx
 * <SLAIndicator responseDue={new Date(Date.now() + 3600000)} />
 * <SLAIndicator resolveDue={new Date(Date.now() - 1000)} />
 * <SLAIndicator firstResponseAt={new Date()} resolvedAt={new Date()} />
 * ```
 */
export const SLAIndicator = observer(function SLAIndicator({
	responseDue,
	resolveDue,
	firstResponseAt,
	resolvedAt,
	className,
}: SLAIndicatorProps) {
	const t = useT();
	// 해결 SLA가 있으면 해결 기준, 없으면 응답 기준
	const due = resolveDue ?? responseDue;
	const completed = resolvedAt ?? firstResponseAt;

	const { status, remainingMs } = calculateSLAStatus(due, completed);

	const label = STATUS_LABEL[status];
	const color = STATUS_CHIP_COLOR[status];

	return (
		<div className={slaIndicatorVariants({ status, className })}>
			<Chip size="sm" color={color} variant="flat">
				{t(label)}
			</Chip>
			{due && !completed && (
				<span className="text-xs opacity-70">
					{formatRemaining(remainingMs, t)}
				</span>
			)}
		</div>
	);
});
