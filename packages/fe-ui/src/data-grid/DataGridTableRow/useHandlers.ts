"use client";

import type { Cell, Row } from "@tanstack/react-table";
import { action, reaction, runInAction } from "mobx";
import type { KeyboardEvent } from "react";
import type { DataGridRow } from "../DataGrid";
import type {
	DataGridTableRowState,
	EditDirection,
	EditingCell,
} from "./DataGridTableRow";

type CellValueChange<T> = <TField extends keyof T>(
	row: T,
	field: TField,
	value: T[TField],
) => void;

type AdjacentCellMove = (
	rowId: string,
	columnId: string,
	direction: EditDirection,
) => void;

export const setEditingCell = action(
	"DataGridTableRow.setEditingCell",
	<T extends DataGridRow>(
		state: DataGridTableRowState<T>,
		nextEditingCell:
			| EditingCell
			| null
			| ((current: EditingCell | null) => EditingCell | null),
	) => {
		state.editingCell =
			typeof nextEditingCell === "function"
				? nextEditingCell(state.editingCell)
				: nextEditingCell;
	},
);

export function getEditingCell<T extends DataGridRow>(
	state: DataGridTableRowState<T>,
	row: Row<T>,
	cell: Cell<T, unknown>,
) {
	return state.editingCell?.rowId === row.id &&
		state.editingCell.columnId === cell.column.id
		? state.editingCell
		: null;
}

export const startEditingCell = action(
	"DataGridTableRow.startEditingCell",
	<T extends DataGridRow>(
		state: DataGridTableRowState<T>,
		row: Row<T>,
		cell: Cell<T, unknown>,
	) => {
		const editable = cell.column.columnDef.meta?.editable;
		if (!editable || !(editable.isEnabled?.(row.original) ?? true)) return;
		const initialValue = cell.getValue();
		state.editingCell = {
			rowId: row.id,
			columnId: cell.column.id,
			initialValue,
			draftValue: initialValue,
			isValidating: false,
		};
	},
);

export function openRequestedCell<T extends DataGridRow>(
	state: DataGridTableRowState<T>,
	row: Row<T>,
	request = state.editRequest,
) {
	if (request?.rowId !== row.id) return;
	const requestedCell = row
		.getVisibleCells()
		.find((candidate) => candidate.column.id === request.columnId);
	if (requestedCell) startEditingCell(state, row, requestedCell);
}

export function getRowInteractionProps<T extends DataGridRow>(
	state: DataGridTableRowState<T>,
	row: Row<T>,
) {
	if (!state.onClick) return {};
	return {
		onClick: () => state.onClick?.(row.original),
		onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				state.onClick?.(row.original);
			}
		},
		tabIndex: 0,
	};
}

export async function finishEditingCell<T extends DataGridRow>(
	state: DataGridTableRowState<T>,
	row: Row<T>,
	cell: Cell<T, unknown>,
	onCellValueChange: CellValueChange<T> | undefined,
	onMoveToAdjacentCell: AdjacentCellMove,
	direction?: EditDirection,
) {
	const editingCell = getEditingCell(state, row, cell);
	const editable = cell.column.columnDef.meta?.editable;
	if (!editingCell || !editable || editingCell.isValidating) return;
	const field = cell.column.id as keyof T;
	const validationContext = {
		row: row.original,
		field: String(field),
		value: editingCell.draftValue,
		initialValue: editingCell.initialValue,
	};
	setEditingCell(state, { ...editingCell, isValidating: true });
	const validatingCell = state.editingCell;
	try {
		const errorMessage = await editable.validate?.(validationContext);
		// 공유 편집 상태가 다른 셀로 이동하면 이전 검증 결과를 적용하지 않습니다.
		if (state.editingCell !== validatingCell) return;
		if (errorMessage) {
			runInAction(() => {
				state.editingCell = {
					...editingCell,
					errorMessage,
					isValidating: false,
				};
			});
			return;
		}
		onCellValueChange?.(
			row.original,
			field,
			editingCell.draftValue as T[keyof T],
		);
		await editable.onCommit?.(validationContext);
		if (state.editingCell !== validatingCell) return;
		runInAction(() => {
			state.editingCell = null;
		});
		if (direction) onMoveToAdjacentCell(row.id, cell.column.id, direction);
	} catch (error) {
		runInAction(() => {
			if (state.editingCell === validatingCell) {
				state.editingCell = { ...editingCell, isValidating: false };
			}
		});
		throw error;
	}
}

export async function cancelEditingCell<T extends DataGridRow>(
	state: DataGridTableRowState<T>,
	row: Row<T>,
	cell: Cell<T, unknown>,
) {
	const editingCell = getEditingCell(state, row, cell);
	const editable = cell.column.columnDef.meta?.editable;
	if (!editingCell || !editable) return;
	await editable.onCancel?.({
		row: row.original,
		field: cell.column.id,
		value: editingCell.draftValue,
		initialValue: editingCell.initialValue,
	});
	runInAction(() => {
		if (state.editingCell === editingCell) state.editingCell = null;
	});
}

export function getCellInteractions<T extends DataGridRow>(
	state: DataGridTableRowState<T>,
	row: Row<T>,
	cell: Cell<T, unknown>,
	onCellValueChange: CellValueChange<T> | undefined,
	onMoveToAdjacentCell: AdjacentCellMove,
) {
	const editable = cell.column.columnDef.meta?.editable;
	const isEditable = Boolean(
		onCellValueChange &&
			editable &&
			(editable.isEnabled?.(row.original) ?? true),
	);
	const editingCell = getEditingCell(state, row, cell);
	const isEditing = isEditable && editingCell !== null;
	const triggers = editable?.triggers ?? ["click", "enter", "f2"];
	const startEditing = () => {
		if (isEditable) startEditingCell(state, row, cell);
	};
	const onStartEditing = (event: { stopPropagation: () => void }) => {
		event.stopPropagation();
		startEditing();
	};
	const editorContext = editingCell
		? {
				row: row.original,
				field: cell.column.id,
				value: editingCell.draftValue,
				initialValue: editingCell.initialValue,
				errorMessage: editingCell.errorMessage,
				isValidating: editingCell.isValidating,
				onValueChange: action((draftValue: unknown) => {
					const currentEditingCell = getEditingCell(state, row, cell);
					if (currentEditingCell) {
						state.editingCell = {
							...currentEditingCell,
							draftValue,
							errorMessage: undefined,
						};
					}
				}),
				onFinish: (direction?: EditDirection) =>
					void finishEditingCell(
						state,
						row,
						cell,
						onCellValueChange,
						onMoveToAdjacentCell,
						direction,
					),
				onCancel: () => void cancelEditingCell(state, row, cell),
			}
		: undefined;
	return {
		isEditable,
		isEditing,
		editorContext,
		cellProps: {
			onClick:
				isEditable && !isEditing && triggers.includes("click")
					? onStartEditing
					: undefined,
			onDoubleClick:
				isEditable && !isEditing && triggers.includes("doubleClick")
					? onStartEditing
					: undefined,
			onKeyDown:
				isEditable && !isEditing
					? (event: KeyboardEvent<HTMLTableCellElement>) => {
							if (
								(event.key === "Enter" && triggers.includes("enter")) ||
								(event.key === "F2" && triggers.includes("f2"))
							) {
								event.preventDefault();
								onStartEditing(event);
							}
						}
					: undefined,
		},
	};
}

export function useHandlers<T extends DataGridRow>(
	state: DataGridTableRowState<T>,
) {
	return {
		getRowInteractionProps: (row: Row<T>) => getRowInteractionProps(state, row),
		observeEditRequests: (row: Row<T>) =>
			reaction(
				() => state.editRequest,
				(request) => openRequestedCell(state, row, request),
				{ fireImmediately: true },
			),
		getCellInteractions: (
			row: Row<T>,
			cell: Cell<T, unknown>,
			onCellValueChange: CellValueChange<T> | undefined,
			onMoveToAdjacentCell: AdjacentCellMove,
		) =>
			getCellInteractions(
				state,
				row,
				cell,
				onCellValueChange,
				onMoveToAdjacentCell,
			),
	};
}
