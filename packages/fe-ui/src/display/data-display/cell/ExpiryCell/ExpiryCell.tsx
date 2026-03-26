import { formatDateTime } from "@cocrepo/toolkit";

interface ExpiryCellProps {
	/** 만료 시간 (ISO 문자열 또는 Date 객체) */
	expiresAt: string | Date | null | undefined;
}

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
 * <ExpiryCell expiresAt="2026-02-10T15:30:00Z" />
 * // 출력: 2026-02-10 15:30 (2h 30m 남음)
 *
 * <ExpiryCell expiresAt={null} /> // "-"
 * ```
 */
export const ExpiryCell = ({ expiresAt }: ExpiryCellProps) => {
	if (!expiresAt) {
		return <p className="text-default-400">-</p>;
	}

	const date = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
	const relativeTime = getRelativeTime(date);
	const isExpired = relativeTime === "만료됨";

	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-sm">{formatDateTime(expiresAt as string)}</span>
			<span className={`text-xs ${isExpired ? "text-danger" : "text-success"}`}>
				{relativeTime}
			</span>
		</div>
	);
};
