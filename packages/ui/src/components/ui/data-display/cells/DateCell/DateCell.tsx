import { formatDateTimeWithSeconds } from "@cocrepo/toolkit";

interface DateCellProps {
	/** 날짜 값 (ISO 문자열 또는 Date 객체) */
	value: string | Date | null | undefined;
}

/**
 * DateCell 컴포넌트
 * 날짜를 초 단위까지 포함한 형식으로 표시합니다.
 *
 * @example
 * ```tsx
 * <DateCell value="2024-01-15T10:30:45" />
 * // 출력: 2024-01-15 10:30:45
 *
 * <DateCell value={null} /> // "-"
 * ```
 */
export const DateCell = ({ value }: DateCellProps) => {
	if (!value) {
		return <p>-</p>;
	}

	return <p>{formatDateTimeWithSeconds(value as string)}</p>;
};
