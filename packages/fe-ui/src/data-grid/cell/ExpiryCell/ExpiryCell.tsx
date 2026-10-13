import { Typography } from "../../../data-display/Typography";
import { useHandlers } from "./useHandlers";

export interface ExpiryCellProps {
	/** 생성 DTO의 만료 시간 */
	expiresAt: Date | null | undefined;
}

/** 셀 마크업(text-[13px])과 동일한 크기를 유지하는 폴백 클래스입니다. */
const DATA_CELL_SIZE_FALLBACK_CLASS_NAME = "text-[13px]";

/**
 * 만료 시간 + 남은 시간을 표시하는 Cell 컴포넌트
 *
 * @example
 * ```tsx
 * <ExpiryCell expiresAt={new Date("2026-02-10T15:30:00Z")} />
 * // 출력: 2026-02-10 15:30 (2h 30m 남음)
 *
 * <ExpiryCell expiresAt={null} /> // "-"
 * ```
 */
export const ExpiryCell = (state: ExpiryCellProps) => {
	const handlers = useHandlers(state);
	const { isEmpty, relativeTime, expiresAtText, isExpired } =
		handlers.getExpiryPresentation();
	if (isEmpty) {
		return (
			<Typography
				className={DATA_CELL_SIZE_FALLBACK_CLASS_NAME}
				color="muted"
				type="body-sm"
			>
				-
			</Typography>
		);
	}

	return (
		<div className="flex flex-col gap-0.5">
			<Typography type="body-sm">{expiresAtText}</Typography>
			<Typography
				className={isExpired ? "text-danger" : "text-success"}
				type="body-xs"
			>
				{relativeTime}
			</Typography>
		</div>
	);
};
