"use client";

import { Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { InquiryStatusCode } from "../../../cell/InquiryStatusCell/InquiryStatusCell";
import { useT } from "../../../i18n";

export interface StatusBadgeProps {
	/** 문의 상태 코드 */
	status: InquiryStatusCode;
	/** 크기 */
	size?: "sm" | "md" | "lg";
	/** 추가 클래스명 */
	className?: string;
}

const STATUS_CONFIG: Record<
	InquiryStatusCode,
	{
		label: string;
		color:
			| "primary"
			| "success"
			| "warning"
			| "danger"
			| "secondary"
			| "default";
	}
> = {
	NEW: { label: "신규", color: "primary" },
	OPEN: { label: "열림", color: "success" },
	IN_PROGRESS: { label: "처리 중", color: "warning" },
	WAITING_CUSTOMER: { label: "고객 대기", color: "secondary" },
	RESOLVED: { label: "해결됨", color: "success" },
	CLOSED: { label: "종료됨", color: "default" },
	ESCALATED: { label: "에스컬레이션", color: "danger" },
};

/**
 * 문의 상태를 표시하는 배지 컴포넌트
 *
 * @example
 * ```tsx
 * <StatusBadge status="NEW" />
 * <StatusBadge status="IN_PROGRESS" size="lg" />
 * ```
 */
export const StatusBadge = observer(function StatusBadge({
	status,
	size = "sm",
	className,
}: StatusBadgeProps) {
	const t = useT();
	const config = STATUS_CONFIG[status] ?? {
		label: status,
		color: "default" as const,
	};

	return (
		<Chip size={size} color={config.color} variant="flat" className={className}>
			{t(config.label)}
		</Chip>
	);
});
