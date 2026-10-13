import { AlertTriangle, Clock } from "lucide-react";
import { Chip } from "../../../data-display/Chip/Chip";
import { Typography } from "../../../data-display/Typography";
import { DefaultCell } from "../DefaultCell/DefaultCell";
import { useHandlers } from "./useHandlers";

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

/**
 * 남은 시간과 임박/위반 상태를 표시하는 범용 셀
 */
export const TimeRemainingCell = (state: TimeRemainingCellProps) => {
	const {
		status,
		remainingMinutes,
		isBreached = false,
		breachLabel = "위반",
	} = state;
	const handlers = useHandlers(state);
	if (isBreached || status === "breach") {
		return (
			<div className="flex w-full justify-center">
				<Chip
					size="sm"
					color="danger"
					variant="soft"
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
					variant="soft"
					startContent={<Clock className="h-3 w-3" />}
				>
					{handlers.getRemainingTimeText()}
				</Chip>
			</div>
		);
	}

	if (remainingMinutes !== null && remainingMinutes !== undefined) {
		return (
			<div className="flex w-full items-center justify-center gap-1 text-muted text-sm">
				<Clock className="h-3.5 w-3.5" />
				<Typography color="muted" type="body-sm">
					{handlers.getRemainingTimeText()}
				</Typography>
			</div>
		);
	}

	return <DefaultCell value={null} />;
};
