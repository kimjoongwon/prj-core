"use client";

import { flexRender, type Header } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { Typography } from "../../../data-display/Typography";
import { type Translate, translateNode } from "../../../i18n";
import { getColumnAlignClassName } from "../../columns/columnConfig";
import { ColumnFilterInput } from "../../input/ColumnFilterInput";
import { ColumnResizerInput } from "../../input/ColumnResizerInput";
import { ColumnSortInput } from "../../input/ColumnSortInput";
import type { DataGridTableHeaderState } from "../../state/table/DataGridTableHeaderState";
import { getColumnWidthStyle } from "../columnSizing";
import type { Key } from "../rowKeys";

const DATA_GRID_SELECT_ALL_LABEL = "현재 페이지 행 전체 선택";
const DATA_GRID_SELECTION_COLUMN_LABEL = "행 선택";
const HEADER_CELL_CLASS_NAME =
	"relative h-9 whitespace-nowrap border-r border-b border-border bg-surface-secondary px-3 py-0 text-[13px] font-semibold text-foreground";
const HEADER_FILTER_CELL_CLASS_NAME =
	"border-r border-b border-border bg-surface-secondary px-3 py-1.5 align-top";
const SELECTION_HEADER_CELL_CLASS_NAME =
	"h-9 w-10 border-r border-b border-border px-3 py-0 text-left align-middle";
const SELECTION_FILTER_CELL_CLASS_NAME =
	"w-10 border-r border-b border-border px-3 py-1.5 align-top";

export interface TableHeaderProps<T extends { id: Key }> {
	state: DataGridTableHeaderState;
	headers: Header<T, unknown>[];
	visibleRowKeys: string[];
	onColumnSizingChange: (columnId: string, size: number | null) => void;
}

function getHeaderLabel<T extends object>(header: Header<T, unknown>) {
	return flexRender(header.column.columnDef.header, header.getContext());
}

function getFloatingFilterInput<T extends object>(header: Header<T, unknown>) {
	return header.column.columnDef.meta?.floatingFilter === true
		? header.column.columnDef.meta.headerInput
		: undefined;
}

function getSelectionAriaChecked(
	isAllVisibleRowsSelected: boolean,
	isSomeVisibleRowsSelected: boolean,
) {
	if (isAllVisibleRowsSelected) return true;
	return isSomeVisibleRowsSelected ? "mixed" : false;
}

/** Header 전용 facade에서 정렬, filter, resize와 visible selection을 렌더링합니다. */
function TableHeaderView<T extends { id: Key }>({
	state,
	headers,
	visibleRowKeys,
	onColumnSizingChange,
}: TableHeaderProps<T>) {
	const selectionMode = state.getSelectionMode();
	const isAllVisibleRowsSelected =
		state.isAllVisibleRowsSelected(visibleRowKeys);
	const isSomeVisibleRowsSelected =
		state.isSomeVisibleRowsSelected(visibleRowKeys);
	const shouldRenderHeaderFilters = headers.some((header) =>
		getFloatingFilterInput(header),
	);
	const t: Translate = (value) => value;

	return (
		<thead className="bg-surface-secondary">
			<tr>
				{selectionMode ? (
					<th scope="col" className={SELECTION_HEADER_CELL_CLASS_NAME}>
						{selectionMode === "multiple" ? (
							<input
								aria-checked={getSelectionAriaChecked(
									isAllVisibleRowsSelected,
									isSomeVisibleRowsSelected,
								)}
								aria-label={t(DATA_GRID_SELECT_ALL_LABEL)}
								checked={isAllVisibleRowsSelected}
								className="size-3.5 rounded border-border text-accent accent-current"
								onChange={(event) =>
									state.changeVisibleSelection(
										visibleRowKeys,
										event.currentTarget.checked,
									)
								}
								ref={(input) => {
									if (input)
										input.indeterminate =
											!isAllVisibleRowsSelected && isSomeVisibleRowsSelected;
								}}
								type="checkbox"
							/>
						) : (
							<Typography className="sr-only" type="body-xs">
								{t(DATA_GRID_SELECTION_COLUMN_LABEL)}
							</Typography>
						)}
					</th>
				) : null}
				{headers.map((header) => {
					const alignClassName = getColumnAlignClassName(
						header.column.columnDef,
					);
					const label = header.isPlaceholder ? null : getHeaderLabel(header);
					const sortDirection = header.column.getIsSorted() || null;
					const isSortable = header.column.columnDef.meta?.isSortable === true;
					return (
						<th
							key={header.id}
							scope="col"
							className={[HEADER_CELL_CLASS_NAME, alignClassName]
								.filter(Boolean)
								.join(" ")}
							style={getColumnWidthStyle(header.column.getSize())}
						>
							{label == null ? null : isSortable ? (
								<ColumnSortInput
									label={label}
									sortDirection={sortDirection}
									onToggle={() => header.column.toggleSorting()}
								/>
							) : (
								translateNode(label, t)
							)}
							<ColumnResizerInput
								columnId={header.column.id}
								maxSize={header.column.columnDef.maxSize}
								minSize={header.column.columnDef.minSize}
								onColumnSizingChange={onColumnSizingChange}
							/>
						</th>
					);
				})}
			</tr>
			{shouldRenderHeaderFilters ? (
				<tr>
					{selectionMode ? (
						<th scope="col" className={SELECTION_FILTER_CELL_CLASS_NAME} />
					) : null}
					{headers.map((header) => {
						const headerInput = getFloatingFilterInput(header);
						const alignClassName = getColumnAlignClassName(
							header.column.columnDef,
						);
						return (
							<th
								key={`${header.id}-filter`}
								scope="col"
								className={[HEADER_FILTER_CELL_CLASS_NAME, alignClassName]
									.filter(Boolean)
									.join(" ")}
								style={getColumnWidthStyle(header.column.getSize())}
							>
								{headerInput ? (
									<ColumnFilterInput
										config={headerInput}
										queryValues={state.queryValues}
										onQueryChange={state.changeQuery}
									/>
								) : null}
							</th>
						);
					})}
				</tr>
			) : null}
		</thead>
	);
}

export const TableHeader = observer(TableHeaderView) as typeof TableHeaderView;
