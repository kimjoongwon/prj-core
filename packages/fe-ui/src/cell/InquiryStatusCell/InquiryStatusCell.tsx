"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { useT } from "../../i18n";

/** 문의 상태값 (Prisma Enum 값과 동일) */
export type InquiryStatusCode =
	| "NEW"
	| "OPEN"
	| "IN_PROGRESS"
	| "WAITING_CUSTOMER"
	| "RESOLVED"
	| "CLOSED"
	| "ESCALATED";

interface InquiryStatusCellProps {
	/** 문의 상태값 */
	value?: InquiryStatusCode | null;
	/** 신규 표시 여부 (NEW 상태에서 추가 하이라이트) */
	isNew?: boolean;
}

/** 상태별 Chip 설정 */
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
	OPEN: { label: "열림", color: "secondary" },
	IN_PROGRESS: { label: "처리 중", color: "warning" },
	WAITING_CUSTOMER: { label: "고객 대기", color: "default" },
	RESOLVED: { label: "해결됨", color: "success" },
	CLOSED: { label: "종료됨", color: "default" },
	ESCALATED: { label: "에스컬레이션", color: "danger" },
};

/**
 * 문의 상태를 Chip으로 표시하는 Cell 컴포넌트
 *
 * @example
 * ```tsx
 * <InquiryStatusCell value="NEW" isNew />
 * <InquiryStatusCell value="IN_PROGRESS" />
 * ```
 */
export const InquiryStatusCell = observer(function InquiryStatusCell({
	value,
	isNew,
}: InquiryStatusCellProps) {
	const t = useT();

	if (!value) {
		return <span className="text-muted">-</span>;
	}

	const config = STATUS_CONFIG[value];

	return (
		<div className="flex w-full justify-center">
			<Chip
				size="sm"
				color={config.color}
				variant="flat"
				startContent={isNew ? <span className="text-xs">🆕</span> : undefined}
			>
				{t(config.label)}
			</Chip>
		</div>
	);
});
