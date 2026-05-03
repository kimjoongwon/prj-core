"use client";

import { Chip } from "@heroui/react";
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

/** 문의 우선순위값 (Prisma Enum 값과 동일) */
export type InquiryPriorityCode = "LOW" | "NORMAL" | "HIGH" | "URGENT";

interface InquiryPriorityCellProps {
	/** 우선순위값 */
	value?: InquiryPriorityCode | null;
	/** 별 개수 표시 여부 */
	showStars?: boolean;
}

/** 우선순위별 설정 */
const PRIORITY_CONFIG: Record<
	InquiryPriorityCode,
	{
		label: string;
		color: "success" | "primary" | "warning" | "danger";
		stars: number;
	}
> = {
	LOW: { label: "낮음", color: "success", stars: 1 },
	NORMAL: { label: "보통", color: "primary", stars: 2 },
	HIGH: { label: "높음", color: "warning", stars: 3 },
	URGENT: { label: "긴급", color: "danger", stars: 4 },
};

/** 우선순위 아이콘 반환 */
const getPriorityIcon = (priority: InquiryPriorityCode) => {
	switch (priority) {
		case "URGENT":
			return <AlertTriangle className="h-3 w-3" />;
		case "HIGH":
			return <ArrowUp className="h-3 w-3" />;
		case "NORMAL":
			return <Minus className="h-3 w-3" />;
		case "LOW":
			return <ArrowDown className="h-3 w-3" />;
	}
};

/**
 * 문의 우선순위를 Chip으로 표시하는 Cell 컴포넌트
 *
 * @example
 * ```tsx
 * <InquiryPriorityCell value="URGENT" />
 * <InquiryPriorityCell value="HIGH" showStars />
 * ```
 */
export const InquiryPriorityCell = observer(function InquiryPriorityCell({
	value,
	showStars,
}: InquiryPriorityCellProps) {
	const t = useT();

	if (!value) {
		return <span className="text-default-400">-</span>;
	}

	const config = PRIORITY_CONFIG[value];

	return (
		<div className="flex w-full justify-center">
			<Chip
				size="sm"
				color={config.color}
				variant="flat"
				startContent={getPriorityIcon(value)}
			>
				{showStars ? "⭐".repeat(config.stars) : t(config.label)}
			</Chip>
		</div>
	);
});
