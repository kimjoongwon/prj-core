"use client";

import { useT } from "../../../i18n";
import type { DataGridSelectionMode } from "../../state/selection";

const DATA_GRID_SELECTION_COLUMN_LABEL = "행 선택";

export interface SelectionCellProps {
	entity: string;
	isSelected: boolean;
	rowKey: string;
	selectionMode: Exclude<DataGridSelectionMode, undefined>;
	onSelectionChange: (rowKey: string, isSelected: boolean) => void;
}

export function SelectionCell({
	entity,
	isSelected,
	rowKey,
	selectionMode,
	onSelectionChange,
}: SelectionCellProps) {
	const t = useT();

	return (
		<td className="w-10 border-r border-b border-[#e1e6ef] px-3 py-0 align-middle dark:border-white/10">
			<input
				aria-label={t(DATA_GRID_SELECTION_COLUMN_LABEL)}
				checked={isSelected}
				className="size-3.5 border-[#9ca3af] text-accent accent-current dark:border-white/20"
				name={`data-grid-${entity}-selection`}
				onChange={(event) =>
					onSelectionChange(rowKey, event.currentTarget.checked)
				}
				onClick={(event) => event.stopPropagation()}
				type={selectionMode === "single" ? "radio" : "checkbox"}
			/>
		</td>
	);
}
