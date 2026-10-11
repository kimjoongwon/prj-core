"use client";

import type { SelectionConfig } from "@cocrepo/type";
import { useT } from "../../../i18n";

const DATA_GRID_SELECTION_COLUMN_LABEL = "행 선택";

export interface SelectionCellProps {
	isSelected: boolean;
	rowKey: string;
	selectionGroupName: string;
	selectionMode: Exclude<SelectionConfig["mode"], "none">;
	onSelectionChange: (rowKey: string, isSelected: boolean) => void;
}

export function SelectionCell({
	isSelected,
	rowKey,
	selectionGroupName,
	selectionMode,
	onSelectionChange,
}: SelectionCellProps) {
	const t = useT();

	return (
		<td className="w-10 border-r border-b border-border px-3 py-0 align-middle">
			<input
				aria-label={t(DATA_GRID_SELECTION_COLUMN_LABEL)}
				checked={isSelected}
				className="size-3.5 border-border text-accent accent-current"
				name={`data-grid-${selectionGroupName}-selection`}
				onChange={(event) =>
					onSelectionChange(rowKey, event.currentTarget.checked)
				}
				onClick={(event) => event.stopPropagation()}
				type={selectionMode === "single" ? "radio" : "checkbox"}
				value={rowKey}
			/>
		</td>
	);
}
