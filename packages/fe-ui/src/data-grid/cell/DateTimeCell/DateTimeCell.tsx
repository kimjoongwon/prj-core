import { formatDateTime } from "@cocrepo/toolkit";
import { Typography } from "../../../data-display/Typography";

export interface DateTimeCellProps {
	/** 생성 DTO의 DateTime 값 */
	value: Date | null | undefined;
}

/** 셀 마크업(text-[13px])과 동일한 크기를 유지하는 폴백 클래스입니다. */
const DATA_CELL_SIZE_FALLBACK_CLASS_NAME = "text-[13px]";

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
		return (
			<Typography className={DATA_CELL_SIZE_FALLBACK_CLASS_NAME} type="body-sm">
				-
			</Typography>
		);
	}

	return (
		<Typography className={DATA_CELL_SIZE_FALLBACK_CLASS_NAME} type="body-sm">
			{formatDateTime(value)}
		</Typography>
	);
};
