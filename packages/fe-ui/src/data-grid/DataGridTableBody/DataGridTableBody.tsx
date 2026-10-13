"use client";

import { type Table } from "@tanstack/react-table";
import type { DataGridState, Key } from "../DataGrid";
import { DataGridTableGroupRow } from "../DataGridTableGroupRow/DataGridTableGroupRow";
import {
	DataGridTableRow,
	type DataGridTableRowState,
} from "../DataGridTableRow/DataGridTableRow";
import { useHandlers } from "./useHandlers";

/** TanStack row model을 일반 행과 그룹 행 컴포넌트로 연결합니다. */
export const DataGridTableBody = <T extends { id: Key }>({
	state,
	table,
	rowState,
	selectionGroupName,
}: {
	state: DataGridState<T>;
	table: Table<T>;
	rowState: DataGridTableRowState<T>;
	selectionGroupName: string;
}) => {
	const handlers = useHandlers(state);
	const tableState = state.table;
	const bodyRows = table.getRowModel().rows;
	const selectionMode =
		tableState.selection?.mode === "none"
			? undefined
			: tableState.selection?.mode;
	const tableColumnCount =
		table.getVisibleLeafColumns().length + (selectionMode ? 1 : 0);
	const moveToAdjacentCell = handlers.getCellNavigation(table, rowState);

	return (
		<tbody>
			{bodyRows.map((row) =>
				row.getIsGrouped() ? (
					<DataGridTableGroupRow
						key={row.id}
						row={row}
						columnCount={tableColumnCount}
					/>
				) : (
					<DataGridTableRow
						key={row.id}
						tableState={tableState}
						state={rowState}
						row={row}
						selectionMode={selectionMode}
						onCellValueChange={handlers.setValue}
						onMoveToAdjacentCell={moveToAdjacentCell}
						selectionGroupName={selectionGroupName}
					/>
				),
			)}
		</tbody>
	);
};
