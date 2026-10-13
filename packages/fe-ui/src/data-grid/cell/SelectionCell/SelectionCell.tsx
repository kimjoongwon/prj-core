"use client";

import type { SelectionConfig } from "@cocrepo/type";
import type { Row } from "@tanstack/react-table";
import { useT } from "../../../i18n";
import { useHandlers } from "./useHandlers";

const DATA_GRID_SELECTION_COLUMN_LABEL = "행 선택";

export interface SelectionCellProps<TData> {
	row: Row<TData>;
	selectionGroupName: string;
	selectionMode: Exclude<SelectionConfig["mode"], "none">;
}

export function SelectionCell<TData>(state: SelectionCellProps<TData>) {
	const { row, selectionGroupName, selectionMode } = state;
	const t = useT();
	const handlers = useHandlers(state);

	return (
		<td className="w-10 border-r border-b border-border px-3 py-0 align-middle">
			<input
				aria-label={t(DATA_GRID_SELECTION_COLUMN_LABEL)}
				checked={row.getIsSelected()}
				className="size-3.5 border-border text-accent accent-current"
				name={`data-grid-${selectionGroupName}-selection`}
				onChange={handlers.toggleSelection}
				onClick={handlers.stopClickPropagation}
				type={selectionMode === "single" ? "radio" : "checkbox"}
				value={row.id}
			/>
		</td>
	);
}
