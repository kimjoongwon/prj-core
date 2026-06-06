import { AlertTriangle, Clock } from "lucide-react";
import { Chip } from "../../data-display/Chip/Chip";

/** SLA 상태 */
export type SLAStatus = "ok" | "warning" | "breach";

interface InquirySLACellProps {
	/** SLA 상태 */
	status?: SLAStatus | null;
	/** 남은 시간 (분 단위) */
	remainingMinutes?: number | null;
	/** 응답 SLA 위반 여부 */
	isResponseBreached?: boolean;
	/** 해결 SLA 위반 여부 */
	isResolveBreached?: boolean;
}

/** 남은 시간을 포맷팅 */
const formatRemainingTime = (minutes: number): string => {
	if (minutes <= 0) return "위반";
	if (minutes < 60) return `${minutes}분`;

	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hours >= 24) {
		const days = Math.floor(hours / 24);
		return `${days}일 ${hours % 24}시간`;
	}

	return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
};

/**
 * 문의 SLA 상태를 표시하는 Cell 컴포넌트
 *
 * @example
 * ```tsx
 * <InquirySLACell status="ok" remainingMinutes={120} />
 * <InquirySLACell status="warning" remainingMinutes={30} />
 * <InquirySLACell status="breach" remainingMinutes={-10} />
 * ```
 */
export const InquirySLACell = ({
	status,
	remainingMinutes,
	isResponseBreached,
	isResolveBreached,
}: InquirySLACellProps) => {
	const isBreached =
		isResponseBreached || isResolveBreached || status === "breach";
	const isWarning = status === "warning";

	// 위반 상태
	if (isBreached) {
		return (
			<div className="flex w-full justify-center">
				<Chip
					size="sm"
					color="danger"
					variant="flat"
					startContent={<AlertTriangle className="h-3 w-3" />}
				>
					SLA 위반
				</Chip>
			</div>
		);
	}

	// 경고 상태 (30분 이내)
	if (isWarning) {
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
						: "임박"}
				</Chip>
			</div>
		);
	}

	// 정상 상태
	if (remainingMinutes !== null && remainingMinutes !== undefined) {
		return (
			<div className="flex w-full items-center justify-center gap-1 text-sm text-muted">
				<Clock className="h-3.5 w-3.5" />
				<span>{formatRemainingTime(remainingMinutes)}</span>
			</div>
		);
	}

	return <span className="text-muted">-</span>;
};
