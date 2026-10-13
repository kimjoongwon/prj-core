"use client";

import type { Table } from "@tanstack/react-table";
import type { DataGridRow, DataGridState, Key } from "../DataGrid";
import type {
	DataGridTableRowState,
	EditDirection,
} from "../DataGridTableRow/DataGridTableRow";
import { startEditingCell } from "../DataGridTableRow/useHandlers";
import { useHandlers as useGridHandlers } from "../useHandlers";

export function moveToAdjacentCell<T extends DataGridRow>(
	table: Table<T>,
	rowState: DataGridTableRowState<T>,
	rowId: string,
	columnId: string,
	direction: EditDirection,
) {
	const editableCells = table.getRowModel().rows.flatMap((row) =>
		row.getIsGrouped()
			? []
			: row.getVisibleCells().flatMap((cell) => {
					const editable = cell.column.columnDef.meta?.editable;
					return editable && (editable.isEnabled?.(row.original) ?? true)
						? [{ row, cell }]
						: [];
				}),
	);
	const currentIndex = editableCells.findIndex(
		({ row, cell }) => row.id === rowId && cell.column.id === columnId,
	);
	if (currentIndex < 0) return;
	const adjacentCell =
		editableCells[currentIndex + (direction === "next" ? 1 : -1)];
	if (adjacentCell) {
		startEditingCell(rowState, adjacentCell.row, adjacentCell.cell);
	}
}

export function useHandlers<T extends { id: Key }>(state: DataGridState<T>) {
	const gridHandlers = useGridHandlers(state);
	return {
		setValue: gridHandlers.setValue,
		getCellNavigation:
			(table: Table<T>, rowState: DataGridTableRowState<T>) =>
			(rowId: string, columnId: string, direction: EditDirection) =>
				moveToAdjacentCell(table, rowState, rowId, columnId, direction),
	};
}
