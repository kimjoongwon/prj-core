import { formatDateTime } from "@cocrepo/toolkit";

export interface DateTimeCellProps {
	/** 생성 DTO의 DateTime 값 */
	value: Date | null | undefined;
}

/**
 * DateTimeCell 컴포넌트
 * 날짜와 시간을 표시합니다 (초 단위 제외).
 *
 * @example
 * ```tsx
 * <DateTimeCell value={new Date("2024-01-15T10:30:00Z")} />
 * // 출력: 2024-01-15 10:30
 *
 * <DateTimeCell value={null} /> // "-"
 * ```
 */
export const DateTimeCell = ({ value }: DateTimeCellProps) => {
	if (!value || Number.isNaN(value.getTime())) {
		return <span>-</span>;
	}

	return <span>{formatDateTime(value)}</span>;
};
