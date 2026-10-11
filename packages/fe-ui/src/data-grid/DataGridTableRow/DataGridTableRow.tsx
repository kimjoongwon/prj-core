"use client";

import type {
	DataGridEditorConfig,
	DataGridEditValidationContext,
	DataGridEditValidationResult,
	SelectionConfig,
} from "@cocrepo/type";
import { flexRender, type Row, type RowData } from "@tanstack/react-table";
import { makeAutoObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";
import { type KeyboardEvent, type ReactNode, useEffect } from "react";
import { EditorCell } from "../cell/EditorCell";
import { HierarchyCell } from "../cell/HierarchyCell";
import { SelectionCell } from "../cell/SelectionCell";
import type { Key } from "../DataGrid";
import type { DataGridTableState } from "../DataGridTable/DataGridTable";

type EditDirection = "next" | "previous";
type EditTrigger = "click" | "doubleClick" | "enter" | "f2";

interface DataGridTableRowEditorContext<TData, TValue> {
	row: TData;
	field: string;
	value: TValue;
	initialValue: TValue;
	errorMessage?: string;
	isValidating: boolean;
	onValueChange: (value: TValue) => void;
	onFinish: (direction?: EditDirection) => void;
	onCancel: () => void;
}

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		label?: ReactNode;
		rowExpander?: boolean;
		editable?: {
			triggers?: EditTrigger[];
			isEnabled?: (row: TData) => boolean;
			validate?: (
				context: DataGridEditValidationContext<TData, TValue>,
			) => DataGridEditValidationResult | Promise<DataGridEditValidationResult>;
			onCommit?: (
				context: DataGridEditValidationContext<TData, TValue>,
			) => void | Promise<void>;
			onCancel?: (
				context: DataGridEditValidationContext<TData, TValue>,
			) => void | Promise<void>;
			editor?: DataGridEditorConfig;
			render?: (
				context: DataGridTableRowEditorContext<TData, TValue>,
			) => ReactNode;
		};
	}
}

interface EditingCell {
	rowId: string;
	columnId: string;
	initialValue: unknown;
	draftValue: unknown;
	errorMessage?: string;
	isValidating: boolean;
}

/** DataGrid 행의 편집 상태를 보유합니다. */
export class DataGridTableRowState {
	editingCell: EditingCell | null = null;

	constructor() {
		makeAutoObservable(
			this,
			{ editingCell: observable.ref },
			{ autoBind: true },
		);
	}

	setEditingCell(
		nextEditingCell:
			| EditingCell
			| null
			| ((current: EditingCell | null) => EditingCell | null),
	) {
		this.editingCell =
			typeof nextEditingCell === "function"
				? nextEditingCell(this.editingCell)
				: nextEditingCell;
	}
}

const DATA_CELL_CLASS_NAME =
	"border-r border-b border-border px-3 py-0 align-middle text-[13px] text-foreground";
const CLICKABLE_ROW_CLASS_NAME =
	"cursor-pointer hover:bg-surface-hover focus-within:bg-surface-hover";
const DEFAULT_ROW_HOVER_CLASS_NAME = "hover:bg-surface-hover";

function getRowInteractionProps<T extends { id: Key }>(
	tableState: DataGridTableState<T>,
	row: Row<T>,
) {
	if (!tableState.onRowClick) return {};
	return {
		onClick: () => tableState.onRowClick?.(row.original),
		onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				tableState.onRowClick?.(row.original);
			}
		},
		tabIndex: 0,
	};
}

interface DataGridTableRowProps<T extends { id: Key }> {
	tableState: DataGridTableState<T>;
	state: DataGridTableRowState;
	row: Row<T>;
	isSelected: boolean;
	selectionMode: Exclude<SelectionConfig["mode"], "none"> | undefined;
	onCellValueChange?: <TField extends keyof T>(
		row: T,
		field: TField,
		value: T[TField],
	) => void;
	onMoveToAdjacentCell: (
		rowId: string,
		columnId: string,
		direction: "next" | "previous",
	) => void;
	onRowSelectionChange: (rowKey: string, isSelected: boolean) => void;
	selectionGroupName: string;
}

/** TanStack Row를 DataGrid의 선택·편집 가능한 행으로 렌더링합니다. */
export const DataGridTableRow = observer(
	<T extends { id: Key }>({
		tableState,
		state,
		row,
		isSelected,
		selectionMode,
		onCellValueChange,
		onMoveToAdjacentCell,
		onRowSelectionChange,
		selectionGroupName,
	}: DataGridTableRowProps<T>) => {
		const editingCell =
			state.editingCell?.rowId === row.id ? state.editingCell : null;

		useEffect(() => {
			const request = tableState.editRequest;
			if (request?.rowId !== row.id) return;

			const cell = row
				.getVisibleCells()
				.find((candidate) => candidate.column.id === request.columnId);
			const editable = cell?.column.columnDef.meta?.editable;
			if (
				!cell ||
				!editable ||
				(editable.isEnabled?.(row.original) ?? true) === false
			) {
				return;
			}

			state.setEditingCell({
				rowId: row.id,
				columnId: cell.column.id,
				initialValue: cell.getValue(),
				draftValue: cell.getValue(),
				isValidating: false,
			});
		}, [
			tableState.editRequest?.requestId,
			tableState.editRequest?.rowId,
			tableState.editRequest?.columnId,
			row.id,
			state.setEditingCell,
		]);

		return (
			<tr
				aria-selected={selectionMode ? isSelected : undefined}
				className={[
					"h-10 transition-colors",
					isSelected && "bg-accent-soft",
					tableState.onRowClick
						? CLICKABLE_ROW_CLASS_NAME
						: DEFAULT_ROW_HOVER_CLASS_NAME,
				]
					.filter(Boolean)
					.join(" ")}
				{...getRowInteractionProps(tableState, row)}
			>
				{selectionMode ? (
					<SelectionCell
						isSelected={isSelected}
						rowKey={row.id}
						selectionGroupName={selectionGroupName}
						selectionMode={selectionMode}
						onSelectionChange={onRowSelectionChange}
					/>
				) : null}
				{row.getVisibleCells().map((cell) => {
					const editable = cell.column.columnDef.meta?.editable;
					const isEditable = Boolean(
						onCellValueChange &&
							editable &&
							(editable.isEnabled?.(row.original) ?? true),
					);
					const isEditing =
						isEditable && editingCell?.columnId === cell.column.id;
					const triggers: EditTrigger[] = editable?.triggers ?? [
						"click",
						"enter",
						"f2",
					];
					const startEditing = () => {
						if (!isEditable) return;
						state.setEditingCell({
							rowId: row.id,
							columnId: cell.column.id,
							initialValue: cell.getValue(),
							draftValue: cell.getValue(),
							isValidating: false,
						});
					};
					const field = cell.column.id as keyof T;
					const finishEditing = async (direction?: "next" | "previous") => {
						if (!editingCell || !editable || editingCell.isValidating) return;
						const validationContext = {
							row: row.original,
							field: String(field),
							value: editingCell.draftValue,
							initialValue: editingCell.initialValue,
						};
						state.setEditingCell((current) =>
							current ? { ...current, isValidating: true } : current,
						);
						const errorMessage = await editable.validate?.(validationContext);
						if (errorMessage) {
							state.setEditingCell((current) =>
								current
									? { ...current, errorMessage, isValidating: false }
									: current,
							);
							return;
						}
						onCellValueChange?.(
							row.original,
							field,
							editingCell.draftValue as T[keyof T],
						);
						await editable.onCommit?.(validationContext);
						state.setEditingCell(null);
						if (direction)
							onMoveToAdjacentCell(row.id, cell.column.id, direction);
					};
					const cancelEditing = async () => {
						if (!editingCell || !editable) return;
						await editable.onCancel?.({
							row: row.original,
							field: String(field),
							value: editingCell.draftValue,
							initialValue: editingCell.initialValue,
						});
						state.setEditingCell(null);
					};
					const updateDraftValue = (value: unknown) =>
						state.setEditingCell((current) =>
							current
								? { ...current, draftValue: value, errorMessage: undefined }
								: current,
						);
					const editorContext = editingCell
						? {
								row: row.original,
								field: String(field),
								value: editingCell.draftValue,
								initialValue: editingCell.initialValue,
								errorMessage: editingCell.errorMessage,
								isValidating: editingCell.isValidating,
								onValueChange: updateDraftValue,
								onFinish: (direction?: "next" | "previous") =>
									void finishEditing(direction),
								onCancel: () => void cancelEditing(),
							}
						: undefined;
					const content =
						isEditing && editable && editorContext ? (
							editable.editor && editable.editor.type !== "custom" ? (
								<EditorCell config={editable.editor} context={editorContext} />
							) : (
								editable.render?.({ ...editorContext })
							)
						) : (
							flexRender(cell.column.columnDef.cell, cell.getContext())
						);
					const renderedContent = cell.column.columnDef.meta?.rowExpander ? (
						<HierarchyCell
							rowLabel={String(cell.getValue() ?? row.original.id)}
							depth={row.depth}
							canExpand={row.getCanExpand()}
							isExpanded={row.getIsExpanded()}
							onToggle={row.getToggleExpandedHandler()}
						>
							{content}
						</HierarchyCell>
					) : (
						content
					);

					return (
						<td
							key={cell.id}
							aria-label={
								isEditable
									? `${String(cell.column.columnDef.meta?.label ?? cell.column.id)} 편집`
									: undefined
							}
							aria-invalid={isEditing && Boolean(editingCell.errorMessage)}
							className={[
								DATA_CELL_CLASS_NAME,
								!cell.column.columnDef.meta?.rowExpander &&
									"overflow-hidden whitespace-nowrap text-ellipsis",
								isEditable && !isEditing && "cursor-text",
							]
								.filter(Boolean)
								.join(" ")}
							tabIndex={isEditable && !isEditing ? 0 : undefined}
							onClick={
								isEditable && !isEditing && triggers.includes("click")
									? (event) => {
											event.stopPropagation();
											startEditing();
										}
									: undefined
							}
							onDoubleClick={
								isEditable && !isEditing && triggers.includes("doubleClick")
									? (event) => {
											event.stopPropagation();
											startEditing();
										}
									: undefined
							}
							onKeyDown={
								isEditable && !isEditing
									? (event) => {
											if (
												(event.key === "Enter" && triggers.includes("enter")) ||
												(event.key === "F2" && triggers.includes("f2"))
											) {
												event.preventDefault();
												event.stopPropagation();
												startEditing();
											}
										}
									: undefined
							}
						>
							{renderedContent}
						</td>
					);
				})}
			</tr>
		);
	},
);
