import { formatDateTime } from "@cocrepo/toolkit";

interface DateTimeCellProps {
	/** 날짜/시간 값 (ISO 문자열 또는 Date 객체) */
	value: string | Date | null | undefined;
}

/**
 * DateTimeCell 컴포넌트
 * 날짜와 시간을 표시합니다 (초 단위 제외).
 *
 * @example
 * ```tsx
 * <DateTimeCell value="2024-01-15T10:30:00" />
 * // 출력: 2024-01-15 10:30
 *
 * <DateTimeCell value={null} /> // "-"
 * ```
 */
export const DateTimeCell = ({ value }: DateTimeCellProps) => {
	if (!value) {
		return <span>-</span>;
	}

	return <span>{formatDateTime(value as string)}</span>;
};
