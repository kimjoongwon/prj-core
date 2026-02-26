import { Chip } from "@heroui/react";
import type { InquiryPriorityCode } from "../../data-display/cells";

export interface PriorityBadgeProps {
	/** 우선순위 코드 */
	priority: InquiryPriorityCode;
	/** 크기 */
	size?: "sm" | "md" | "lg";
	/** 추가 클래스명 */
	className?: string;
}

const PRIORITY_CONFIG: Record<
	InquiryPriorityCode,
	{
		label: string;
		color: "default" | "primary" | "warning" | "danger";
		stars: number;
	}
> = {
	LOW: { label: "낮음", color: "default", stars: 1 },
	NORMAL: { label: "보통", color: "primary", stars: 2 },
	HIGH: { label: "높음", color: "warning", stars: 3 },
	URGENT: { label: "긴급", color: "danger", stars: 4 },
};

/**
 * 문의 우선순위를 표시하는 배지 컴포넌트
 *
 * @example
 * ```tsx
 * <PriorityBadge priority="NORMAL" />
 * <PriorityBadge priority="URGENT" size="md" />
 * ```
 */
export const PriorityBadge = ({
	priority,
	size = "sm",
	className,
}: PriorityBadgeProps) => {
	const config = PRIORITY_CONFIG[priority] ?? {
		label: priority,
		color: "default" as const,
		stars: 0,
	};

	const stars = "★".repeat(config.stars);

	return (
		<Chip
			size={size}
			color={config.color}
			variant="flat"
			className={className}
			startContent={
				<span className="text-[10px] leading-none">{stars}</span>
			}
		>
			{config.label}
		</Chip>
	);
};
