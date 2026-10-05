import { formatDateTime } from "@cocrepo/toolkit";
import { Typography } from "../../../data-display/Typography";

interface ExpiryCellProps {
	/** 생성 DTO의 만료 시간 */
	expiresAt: Date | null | undefined;
}

/** 셀 마크업(text-[13px])과 동일한 크기를 유지하는 폴백 클래스입니다. */
const DATA_CELL_SIZE_FALLBACK_CLASS_NAME = "text-[13px]";

/**
 * 남은 시간 계산
 */
const getRelativeTime = (expiresAt: Date): string => {
	const now = new Date();
	const diff = expiresAt.getTime() - now.getTime();

	if (diff <= 0) return "만료됨";

	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days}d ${hours % 24}h 남음`;
	if (hours > 0) return `${hours}h ${minutes % 60}m 남음`;
	return `${minutes}m 남음`;
};

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
export const ExpiryCell = ({ expiresAt }: ExpiryCellProps) => {
	if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
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

	const relativeTime = getRelativeTime(expiresAt);
	const isExpired = relativeTime === "만료됨";

	return (
		<div className="flex flex-col gap-0.5">
			<Typography type="body-sm">{formatDateTime(expiresAt)}</Typography>
			<Typography
				className={isExpired ? "text-danger" : "text-success"}
				type="body-xs"
			>
				{relativeTime}
			</Typography>
		</div>
	);
};
