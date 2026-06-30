import { AlertTriangle, Clock } from "lucide-react";
import { Chip } from "../../data-display/Chip/Chip";
import { DefaultCell } from "../DefaultCell/DefaultCell";

export type TimeRemainingStatus = "ok" | "warning" | "breach";

export interface TimeRemainingCellProps {
	/** 시간 상태 */
	status?: TimeRemainingStatus | null;
	/** 남은 시간 (분 단위) */
	remainingMinutes?: number | null;
	/** 위반 상태 여부 */
	isBreached?: boolean;
	/** 위반 상태 라벨 */
	breachLabel?: string;
	/** 임박 상태의 남은 시간이 없을 때 표시할 라벨 */
	warningFallbackLabel?: string;
}

function formatRemainingTime(minutes: number): string {
	if (minutes <= 0) return "위반";
	if (minutes < 60) return `${minutes}분`;

	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hours >= 24) {
		const days = Math.floor(hours / 24);
		return `${days}일 ${hours % 24}시간`;
	}

	return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
}

/**
 * 남은 시간과 임박/위반 상태를 표시하는 범용 셀
 */
export const TimeRemainingCell = ({
	status,
	remainingMinutes,
	isBreached = false,
	breachLabel = "위반",
	warningFallbackLabel = "임박",
}: TimeRemainingCellProps) => {
	if (isBreached || status === "breach") {
		return (
			<div className="flex w-full justify-center">
				<Chip
					size="sm"
					color="danger"
					variant="flat"
					startContent={<AlertTriangle className="h-3 w-3" />}
				>
					{breachLabel}
				</Chip>
			</div>
		);
	}

	if (status === "warning") {
		return (
			<div className="flex w-full justify-center">
				<Chip
					size="sm"
					color="warning"
					variant="flat"
					startContent={<Clock className="h-3 w-3" />}
				>
					{remainingMinutes !== null && remainingMinutes !== undefined
						? formatRemainingTime(remainingMinutes)
						: warningFallbackLabel}
				</Chip>
			</div>
		);
	}

	if (remainingMinutes !== null && remainingMinutes !== undefined) {
		return (
			<div className="flex w-full items-center justify-center gap-1 text-muted text-sm">
				<Clock className="h-3.5 w-3.5" />
				<span>{formatRemainingTime(remainingMinutes)}</span>
			</div>
		);
	}

	return <DefaultCell value={null} />;
};
