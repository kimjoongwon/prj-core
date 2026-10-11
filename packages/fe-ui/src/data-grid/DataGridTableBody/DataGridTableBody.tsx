"use client";

import { type Table } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import type { DataGridState, Key } from "../DataGrid";
import { DataGridTableGroupRow } from "../DataGridTableGroupRow/DataGridTableGroupRow";
import {
	DataGridTableRow,
	type DataGridTableRowState,
} from "../DataGridTableRow/DataGridTableRow";

/** TanStack row model을 일반 행과 그룹 행 컴포넌트로 연결합니다. */
export const DataGridTableBody = observer(
	<T extends { id: Key }>({
		state,
		table,
		rowState,
		selectionGroupName,
	}: {
		state: DataGridState<T>;
		table: Table<T>;
		rowState: DataGridTableRowState;
		selectionGroupName: string;
	}) => {
		const tableState = state.table;
		const bodyRows = table.getRowModel().rows;
		const selectionMode =
			tableState.selection?.mode === "none"
				? undefined
				: tableState.selection?.mode;
		const tableColumnCount =
			table.getVisibleLeafColumns().length + (selectionMode ? 1 : 0);
		const selectedKeys = Array.from(
			state.selection?.selectedKeys ?? tableState.selectedRowKeys,
		);
		const selectedKeySet = new Set(selectedKeys);
		const onRowSelectionChange = (rowKey: string, isSelected: boolean) => {
			const nextSelectedKeys = isSelected
				? [...selectedKeys, rowKey]
				: selectedKeys.filter((key) => key !== rowKey);
			const nextSelection = new Set(nextSelectedKeys);
			if (state.selection?.setSelectedKeys) {
				state.selection.setSelectedKeys(nextSelection);
			} else {
				tableState.setSelectedRowKeys(nextSelection);
			}
			tableState.selection?.onSelectionChange?.(nextSelection);
		};
		const moveToAdjacentCell = (
			rowId: string,
			columnId: string,
			direction: "next" | "previous",
		) => {
			const editableCells = bodyRows.flatMap((row) =>
				row.getIsGrouped()
					? []
					: row.getVisibleCells().flatMap((cell) => {
							const editable = cell.column.columnDef.meta?.editable;
							if (!editable || !(editable.isEnabled?.(row.original) ?? true)) {
								return [];
							}
							return [{ row, cell }];
						}),
			);
			const currentIndex = editableCells.findIndex(
				({ row, cell }) => row.id === rowId && cell.column.id === columnId,
			);
			const next =
				editableCells[currentIndex + (direction === "next" ? 1 : -1)];
			if (!next) return;
			rowState.setEditingCell({
				rowId: next.row.id,
				columnId: next.cell.column.id,
				initialValue: next.cell.getValue(),
				draftValue: next.cell.getValue(),
				isValidating: false,
			});
		};

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
							isSelected={selectedKeySet.has(row.id)}
							selectionMode={selectionMode}
							onCellValueChange={state.setValue}
							onMoveToAdjacentCell={moveToAdjacentCell}
							onRowSelectionChange={onRowSelectionChange}
							selectionGroupName={selectionGroupName}
						/>
					),
				)}
			</tbody>
		);
	},
);
