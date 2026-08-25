import type { ChipCellProps } from "../ChipCell/ChipCell";
import { ChipCell } from "../ChipCell/ChipCell";
import { DefaultCell } from "../DefaultCell/DefaultCell";

export interface SummaryCellProps {
	primary: string | number;
	secondary?: string | number | null;
	statusLabel?: string;
	statusColor?: ChipCellProps["color"];
}

/** 주요 값과 보조 설명, 선택적 상태를 한 Cell에 표시합니다. */
export function SummaryCell({
	primary,
	secondary,
	statusLabel,
	statusColor,
}: SummaryCellProps) {
	return (
		<div className="flex min-w-0 flex-col gap-1">
			<div className="flex items-center gap-2">
				{statusLabel ? (
					<ChipCell label={statusLabel} color={statusColor} align="start" />
				) : null}
				<DefaultCell value={primary} weight="semibold" lineClamp={1} />
			</div>
			{secondary ? (
				<DefaultCell value={secondary} tone="muted" size="xs" lineClamp={1} />
			) : null}
		</div>
	);
}
