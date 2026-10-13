"use client";

import type {
	DataGridEditorConfig,
	DataGridEditRequest,
	DataGridEditValidationContext,
	DataGridEditValidationResult,
	SelectionConfig,
} from "@cocrepo/type";
import { flexRender, type Row, type RowData } from "@tanstack/react-table";
import { Observer } from "mobx-react-lite";
import { type ReactNode, useEffect } from "react";
import { EditorCell } from "../cell/EditorCell";
import { HierarchyCell } from "../cell/HierarchyCell";
import { SelectionCell } from "../cell/SelectionCell";
import type { DataGridRow, Key } from "../DataGrid";
import type { DataGridTableState } from "../DataGridTable/DataGridTable";
import { useHandlers } from "./useHandlers";

export type EditDirection = "next" | "previous";
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

export interface EditingCell {
	rowId: string;
	columnId: string;
	initialValue: unknown;
	draftValue: unknown;
	errorMessage?: string;
	isValidating: boolean;
}

/** 행의 공유 편집 데이터와 외부 편집 요청·클릭 설정입니다. */
export interface DataGridTableRowState<
	TData extends DataGridRow = DataGridRow,
> {
	editingCell: EditingCell | null;
	editRequest?: DataGridEditRequest;
	onClick?: (row: TData) => void;
}

const DATA_CELL_CLASS_NAME =
	"border-r border-b border-border px-3 py-0 align-middle text-[13px] text-foreground";
const CLICKABLE_ROW_CLASS_NAME =
	"cursor-pointer hover:bg-surface-hover focus-within:bg-surface-hover";
const DEFAULT_ROW_HOVER_CLASS_NAME = "hover:bg-surface-hover";

interface DataGridTableRowProps<T extends { id: Key }> {
	tableState: DataGridTableState<T>;
	state: DataGridTableRowState<T>;
	row: Row<T>;
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
	selectionGroupName: string;
}

/** TanStack Row를 DataGrid의 선택·편집 가능한 행으로 렌더링합니다. */
export const DataGridTableRow = <T extends { id: Key }>({
	tableState,
	state,
	row,
	selectionMode,
	onCellValueChange,
	onMoveToAdjacentCell,
	selectionGroupName,
}: DataGridTableRowProps<T>) => {
	const handlers = useHandlers(state);

	useEffect(() => {
		return handlers.observeEditRequests(tableState, row);
	}, [tableState, row.id, handlers.observeEditRequests]);

	return (
		<Observer>
			{() => (
				<tr
					aria-selected={selectionMode ? row.getIsSelected() : undefined}
					className={[
						"h-10 transition-colors",
						row.getIsSelected() && "bg-accent-soft",
						state.onClick
							? CLICKABLE_ROW_CLASS_NAME
							: DEFAULT_ROW_HOVER_CLASS_NAME,
					]
						.filter(Boolean)
						.join(" ")}
					{...handlers.getRowInteractionProps(row)}
				>
					{selectionMode ? (
						<SelectionCell
							row={row}
							selectionGroupName={selectionGroupName}
							selectionMode={selectionMode}
						/>
					) : null}
					{row.getVisibleCells().map((cell) => {
						const editable = cell.column.columnDef.meta?.editable;
						const { isEditable, isEditing, editorContext, cellProps } =
							handlers.getCellInteractions(
								row,
								cell,
								onCellValueChange,
								onMoveToAdjacentCell,
							);
						const content =
							isEditing && editable && editorContext ? (
								editable.editor && editable.editor.type !== "custom" ? (
									<EditorCell
										config={editable.editor}
										context={editorContext}
									/>
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
								aria-invalid={isEditing && Boolean(editorContext?.errorMessage)}
								className={[
									DATA_CELL_CLASS_NAME,
									!cell.column.columnDef.meta?.rowExpander &&
										"overflow-hidden whitespace-nowrap text-ellipsis",
									isEditable && !isEditing && "cursor-text",
								]
									.filter(Boolean)
									.join(" ")}
								tabIndex={isEditable && !isEditing ? 0 : undefined}
								{...cellProps}
							>
								{renderedContent}
							</td>
						);
					})}
				</tr>
			)}
		</Observer>
	);
};
