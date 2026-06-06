"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Card } from "@heroui/react";

export interface StatsCardProps {
	/** 통계 제목 */
	title: string;
	/** 통계 값 */
	value: number | string;
	/** 아이콘 (선택) */
	icon?: ReactNode;
	/** 색상 테마 */
	color?: "default" | "primary" | "success" | "warning" | "danger";
	/** 부가 설명 */
	description?: string;
	/** 변화량 (증감 표시) */
	change?: {
		value: number;
		type: "increase" | "decrease";
	};
	/** 클릭 핸들러 */
	onPress?: () => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

const colorStyles = {
	default: {
		icon: "text-muted",
		value: "text-foreground",
	},
	primary: {
		icon: "text-accent",
		value: "text-accent",
	},
	success: {
		icon: "text-success",
		value: "text-success",
	},
	warning: {
		icon: "text-warning",
		value: "text-warning",
	},
	danger: {
		icon: "text-danger",
		value: "text-danger",
	},
};

/**
 * StatsCard 컴포넌트
 * 통계 정보를 카드 형태로 표시합니다.
 *
 * @example
 * ```tsx
 * <StatsCard
 *   title="전체 이용자"
 *   value={150}
 *   icon={<Users className="size-5" />}
 *   color="primary"
 * />
 * ```
 */
export const StatsCard = observer(
	({
		title,
		value,
		icon,
		color = "default",
		description,
		change,
		onPress,
		className = "",
	}: StatsCardProps) => {
		const styles = colorStyles[color];

		return (
			<Card
				role={onPress ? "button" : undefined}
				tabIndex={onPress ? 0 : undefined}
				onClick={onPress}
				className={`bg-surface ${onPress ? "cursor-pointer" : ""} ${className}`}
			>
				<Card.Content className="flex flex-row items-center gap-4 p-4">
					{icon && (
						<div
							className={`flex size-10 items-center justify-center rounded-lg bg-surface-secondary ${styles.icon}`}
						>
							{icon}
						</div>
					)}
					<div className="flex flex-1 flex-col">
						<span className="text-sm text-muted">{title}</span>
						<div className="flex items-baseline gap-2">
							<span className={`text-2xl font-bold ${styles.value}`}>
								{typeof value === "number" ? value.toLocaleString() : value}
							</span>
							{change && (
								<span
									className={`text-xs ${
										change.type === "increase" ? "text-success" : "text-danger"
									}`}
								>
									{change.type === "increase" ? "+" : "-"}
									{change.value}%
								</span>
							)}
						</div>
						{description && (
							<span className="text-xs text-muted">{description}</span>
						)}
					</div>
				</Card.Content>
			</Card>
		);
	},
);
