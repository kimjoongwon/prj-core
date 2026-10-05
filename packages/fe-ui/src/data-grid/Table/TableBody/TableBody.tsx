"use client";

import type { DataGridEditTrigger, DataGridTableConfig } from "@cocrepo/type";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, type Row } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type CSSProperties, type KeyboardEvent, useEffect } from "react";
import { Typography } from "../../../data-display/Typography";
import { type Translate, translateNode } from "../../../i18n";
import { EditorCell } from "../../cell/EditorCell";
import { HierarchyCell } from "../../cell/HierarchyCell";
import { SelectionCell } from "../../cell/SelectionCell";
import { getColumnAlignClassName } from "../../columns/columnConfig";
import { DataGridEmptyRow } from "../../DataGridEmptyRow";
import type {
	DataGridEditingCell,
	DataGridEditingState,
	DataGridTableBodyState,
} from "../../state/DataGridState";
import type { DataGridBodyRow } from "../../state/grouping";
import type { DataGridSelectionMode } from "../../state/selection";
import { getColumnWidthStyle } from "../columnSizing";
import type { Key } from "../rowKeys";

const DATA_CELL_CLASS_NAME =
	"border-r border-b border-border px-3 py-0 align-middle text-[13px] text-foreground";
const GROUP_CELL_CLASS_NAME =
	"border-r border-b border-border bg-surface-secondary px-0 py-0 text-[13px] text-foreground";
const CLICKABLE_ROW_CLASS_NAME =
	"cursor-pointer hover:bg-surface-hover focus-within:bg-surface-hover";
const DEFAULT_ROW_HOVER_CLASS_NAME = "hover:bg-surface-hover";

export interface TableBodyProps<T extends { id: Key }> {
	state: DataGridTableBodyState;
	config: DataGridTableConfig<T>;
	rows: DataGridBodyRow<T>[];
	selectionMode: DataGridSelectionMode;
	tableColumnCount: number;
}

function getRowInteractionProps<T extends { id: Key }>(
	config: DataGridTableConfig<T>,
	row: Row<T>,
) {
	if (!config.onRowClick) {
		return {};
	}

	return {
		onClick: () => config.onRowClick?.(row.original),
		onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				config.onRowClick?.(row.original);
			}
		},
		tabIndex: 0,
	};
}

function getGroupColumn<T extends { id: Key }>(row: Row<T>) {
	return row
		.getAllCells()
		.find((cell) => cell.column.id === row.groupingColumnId)?.column;
}

function getGroupLabelText<T extends { id: Key }>(row: Row<T>) {
	const label = getGroupColumn(row)?.columnDef.meta?.label;
	return typeof label === "string" ? label : (row.groupingColumnId ?? "");
}

function formatGroupValue(value: unknown, t: Translate) {
	if (value === null || value === undefined) {
		return t("빈 값");
	}

	const text = String(value);
	return text.length > 0 ? text : t("빈 값");
}

function getGroupValue<T extends { id: Key }>(row: Row<T>, t: Translate) {
	return formatGroupValue(row.groupingValue, t);
}

function DataGridGroupRow<T extends { id: Key }>({
	row,
	tableColumnCount,
	t,
}: {
	row: Row<T>;
	tableColumnCount: number;
	t: Translate;
}) {
	const groupColumn = getGroupColumn(row);
	const groupLabel = translateNode(
		groupColumn?.columnDef.meta?.label ?? row.groupingColumnId ?? "",
		t,
	);
	const groupLabelText = getGroupLabelText(row);
	const groupValue = getGroupValue(row, t);
	const leafRowCount = row.getLeafRows().length;

	return (
		<tr key={row.id}>
			<td colSpan={tableColumnCount} className={GROUP_CELL_CLASS_NAME}>
				<button
					type="button"
					aria-expanded={row.getIsExpanded()}
					aria-label={`${groupLabelText} ${groupValue} 그룹 ${
						row.getIsExpanded() ? "접기" : "펼치기"
					}`}
					className="flex h-10 w-full items-center gap-2 px-3 text-left font-medium hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/40"
					onClick={row.getToggleExpandedHandler()}
					style={{ paddingLeft: `${12 + row.depth * 18}px` }}
				>
					<ChevronRight
						className={[
							"size-4 shrink-0 text-muted transition-transform",
							row.getIsExpanded() && "rotate-90",
						]
							.filter(Boolean)
							.join(" ")}
					/>
					<Typography className="text-[13px]" type="body-sm" weight="medium">
						{groupLabel}
					</Typography>
					<Typography className="text-[13px]" type="body-sm" weight="medium">
						{groupValue}
					</Typography>
					<Typography color="muted" type="body-xs" weight="normal">
						({leafRowCount})
					</Typography>
				</button>
			</td>
		</tr>
	);
}

interface DataGridDataRowProps<T extends { id: Key }> {
	config: DataGridTableConfig<T>;
	onCellValueChange?: <TField extends keyof T>(
		row: T,
		field: TField,
		value: T[TField],
	) => void;
	row: Row<T>;
	isSelected: boolean;
	selectionMode: DataGridSelectionMode;
	isRowMoveEnabled: boolean;
	activeRowId?: string | null;
	projectedDepth?: number | null;
	editingCell: DataGridEditingCell | null;
	onEditingCellChange: DataGridEditingState["setEditingCell"];
	onMoveToAdjacentCell: (
		rowId: string,
		columnId: string,
		direction: "next" | "previous",
	) => void;
	onRowSelectionChange: (rowKey: string, isSelected: boolean) => void;
}

type DataGridSortableRow = ReturnType<typeof useSortable>;

function DataGridDataRowView<T extends { id: Key }>({
	config,
	onCellValueChange,
	row,
	isSelected,
	selectionMode,
	activeRowId,
	projectedDepth,
	editingCell,
	onEditingCellChange,
	onMoveToAdjacentCell,
	onRowSelectionChange,
	sortableRow,
}: DataGridDataRowProps<T> & { sortableRow?: DataGridSortableRow }) {
	const rowStyle: CSSProperties | undefined = sortableRow
		? {
				transform: CSS.Transform.toString(sortableRow.transform),
				transition: sortableRow.transition,
				opacity: sortableRow.isDragging ? 0.55 : 1,
				position: sortableRow.isDragging ? "relative" : undefined,
				zIndex: sortableRow.isDragging ? 1 : undefined,
			}
		: undefined;
	useEffect(() => {
		const request = config.editRequest;
		if (request?.rowId !== row.id) {
			return;
		}

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

		onEditingCellChange({
			rowId: row.id,
			columnId: cell.column.id,
			initialValue: cell.getValue(),
			draftValue: cell.getValue(),
			isValidating: false,
		});
	}, [
		config.editRequest?.requestId,
		config.editRequest?.rowId,
		config.editRequest?.columnId,
		row.id,
		onEditingCellChange,
	]);

	return (
		<tr
			ref={sortableRow?.setNodeRef}
			aria-selected={selectionMode ? isSelected : undefined}
			className={[
				"h-10 transition-colors",
				isSelected && "bg-accent-soft",
				config.onRowClick
					? CLICKABLE_ROW_CLASS_NAME
					: DEFAULT_ROW_HOVER_CLASS_NAME,
			]
				.filter(Boolean)
				.join(" ")}
			style={rowStyle}
			{...getRowInteractionProps(config, row)}
		>
			{selectionMode ? (
				<SelectionCell
					entity={config.entity}
					isSelected={isSelected}
					rowKey={row.id}
					selectionMode={selectionMode}
					onSelectionChange={onRowSelectionChange}
				/>
			) : null}
			{row.getVisibleCells().map((cell) => {
				const alignClassName = getColumnAlignClassName(cell.column.columnDef);
				const editable = cell.column.columnDef.meta?.editable;
				const isEditable = Boolean(
					onCellValueChange &&
						editable &&
						(editable.isEnabled?.(row.original) ?? true),
				);
				const isEditing =
					isEditable &&
					editingCell?.rowId === row.id &&
					editingCell.columnId === cell.column.id;
				const triggers: DataGridEditTrigger[] = editable?.triggers ?? [
					"click",
					"enter",
					"f2",
				];
				const startEditing = () => {
					if (!isEditable) {
						return;
					}

					onEditingCellChange({
						rowId: row.id,
						columnId: cell.column.id,
						initialValue: cell.getValue(),
						draftValue: cell.getValue(),
						isValidating: false,
					});
				};
				const field = cell.column.id as keyof T;
				const finishEditing = async (direction?: "next" | "previous") => {
					if (!editingCell || !editable || editingCell.isValidating) {
						return;
					}

					const validationContext = {
						row: row.original,
						field: String(field),
						value: editingCell.draftValue,
						initialValue: editingCell.initialValue,
					};
					onEditingCellChange((current) =>
						current ? { ...current, isValidating: true } : current,
					);

					const errorMessage = await editable.validate?.(validationContext);
					if (errorMessage) {
						onEditingCellChange((current) =>
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
					onEditingCellChange(null);
					if (direction) {
						onMoveToAdjacentCell(row.id, cell.column.id, direction);
					}
				};
				const cancelEditing = async () => {
					if (!editingCell || !editable) {
						return;
					}

					await editable.onCancel?.({
						row: row.original,
						field: String(field),
						value: editingCell.draftValue,
						initialValue: editingCell.initialValue,
					});
					onEditingCellChange(null);
				};
				const updateDraftValue = (value: unknown) => {
					onEditingCellChange((current) =>
						current
							? { ...current, draftValue: value, errorMessage: undefined }
							: current,
					);
				};
				const content =
					isEditing && editable ? (
						editable.editor && editable.editor.type !== "custom" ? (
							<EditorCell
								config={editable.editor}
								context={{
									row: row.original,
									field: String(field),
									value: editingCell.draftValue,
									initialValue: editingCell.initialValue,
									errorMessage: editingCell.errorMessage,
									isValidating: editingCell.isValidating,
									onValueChange: updateDraftValue,
									onFinish: (direction) => void finishEditing(direction),
									onCancel: () => void cancelEditing(),
								}}
							/>
						) : (
							editable.render?.({
								row: row.original,
								value: editingCell.draftValue,
								initialValue: editingCell.initialValue,
								field: String(field),
								errorMessage: editingCell.errorMessage,
								isValidating: editingCell.isValidating,
								onValueChange: updateDraftValue,
								onFinish: (direction) => void finishEditing(direction),
								onCancel: () => void cancelEditing(),
							})
						)
					) : (
						flexRender(cell.column.columnDef.cell, cell.getContext())
					);
				const renderedContent = cell.column.columnDef.meta?.rowExpander ? (
					<HierarchyCell
						rowLabel={String(cell.getValue() ?? row.original.id)}
						depth={
							activeRowId === row.id && projectedDepth != null
								? projectedDepth
								: row.depth
						}
						canExpand={row.getCanExpand()}
						isExpanded={row.getIsExpanded()}
						onToggle={row.getToggleExpandedHandler()}
						dragHandle={
							sortableRow
								? {
										attributes: sortableRow.attributes,
										listeners: sortableRow.listeners,
									}
								: undefined
						}
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
							alignClassName,
							isEditable && !isEditing && "cursor-text",
						]
							.filter(Boolean)
							.join(" ")}
						style={getColumnWidthStyle(cell.column.columnDef)}
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
}

function SortableDataGridDataRow<T extends { id: Key }>(
	props: DataGridDataRowProps<T>,
) {
	const sortableRow = useSortable({ id: props.row.id });
	return <DataGridDataRowView {...props} sortableRow={sortableRow} />;
}

function DataGridDataRow<T extends { id: Key }>(
	props: DataGridDataRowProps<T>,
) {
	return props.isRowMoveEnabled ? (
		<SortableDataGridDataRow {...props} />
	) : (
		<DataGridDataRowView {...props} />
	);
}

function TableBodyView<T extends { id: Key }>({
	state,
	config,
	rows,
	selectionMode,
	tableColumnCount,
}: TableBodyProps<T>) {
	const rowConfig = config;
	const bodyRows = rows;
	const selectedKeys = state.selectedKeys;
	const t: Translate = (value) => value;
	const isRowMoveEnabled = Boolean(rowConfig.onRowMove);
	const activeRowId = undefined;
	const projectedDepth = undefined;
	const onCellValueChange = state.changeCellValue;
	const onRowSelectionChange = (rowKey: string, isSelected: boolean) =>
		state.changeRowSelection(
			rowKey,
			isSelected,
			rowConfig.selection?.onSelectionChange,
		);
	const selectedKeySet = new Set(selectedKeys);
	const editingCell = state.editing.editingCell;
	const sortableRowIds = bodyRows
		.filter((row) => !row.getIsGrouped())
		.map((row) => row.id);
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
						if (
							!onCellValueChange ||
							!editable ||
							!(editable.isEnabled?.(row.original) ?? true)
						) {
							return [];
						}

						return [{ row, cell }];
					}),
		);
		const currentIndex = editableCells.findIndex(
			({ row, cell }) => row.id === rowId && cell.column.id === columnId,
		);
		const next = editableCells[currentIndex + (direction === "next" ? 1 : -1)];
		if (!next) {
			return;
		}

		state.editing.setEditingCell({
			rowId: next.row.id,
			columnId: next.cell.column.id,
			initialValue: next.cell.getValue(),
			draftValue: next.cell.getValue(),
			isValidating: false,
		});
	};

	return (
		<SortableContext
			items={sortableRowIds}
			strategy={verticalListSortingStrategy}
		>
			<tbody>
				{bodyRows.length === 0 ? (
					<DataGridEmptyRow
						colSpan={tableColumnCount}
						emptyMessage={rowConfig.emptyMessage}
					/>
				) : (
					bodyRows.map((row) => {
						const isSelected = selectedKeySet.has(row.id);

						if (row.getIsGrouped()) {
							return (
								<DataGridGroupRow
									key={row.id}
									row={row}
									tableColumnCount={tableColumnCount}
									t={t}
								/>
							);
						}

						return (
							<DataGridDataRow
								key={row.id}
								config={rowConfig}
								onCellValueChange={onCellValueChange}
								row={row}
								isSelected={isSelected}
								selectionMode={selectionMode}
								isRowMoveEnabled={isRowMoveEnabled}
								activeRowId={activeRowId}
								projectedDepth={projectedDepth}
								editingCell={editingCell}
								onEditingCellChange={state.editing.setEditingCell}
								onMoveToAdjacentCell={moveToAdjacentCell}
								onRowSelectionChange={onRowSelectionChange}
							/>
						);
					})
				)}
			</tbody>
		</SortableContext>
	);
}

export const TableBody = observer(TableBodyView) as typeof TableBodyView;
