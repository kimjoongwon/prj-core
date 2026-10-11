"use client";

import {
	flexRender,
	type Header,
	type HeaderGroup,
	type Table,
} from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { Typography } from "../../data-display/Typography";
import { type Translate, translateNode } from "../../i18n";
import type { DataGridTableHeaderState, Key } from "../DataGrid";
import { ColumnResizerInput } from "../input/ColumnResizerInput";
import { ColumnSortInput } from "../input/ColumnSortInput";

const DATA_GRID_SELECT_ALL_LABEL = "현재 페이지 행 전체 선택";
const DATA_GRID_SELECTION_COLUMN_LABEL = "행 선택";
const HEADER_CELL_CLASS_NAME =
	"relative h-9 whitespace-nowrap border-r border-b border-border bg-surface-secondary px-3 py-0 text-[13px] font-semibold text-foreground";
const SELECTION_HEADER_CELL_CLASS_NAME =
	"h-9 w-10 border-r border-b border-border px-3 py-0 text-left align-middle";

export interface DataGridTableHeaderProps<T extends { id: Key }> {
	state: DataGridTableHeaderState;
	headerGroups: HeaderGroup<T>[];
	visibleRowKeys: string[];
	table: Table<T>;
}

function getHeaderLabel<T extends object>(header: Header<T, unknown>) {
	return flexRender(header.column.columnDef.header, header.getContext());
}

function getSelectionAriaChecked(
	isAllVisibleRowsSelected: boolean,
	isSomeVisibleRowsSelected: boolean,
) {
	if (isAllVisibleRowsSelected) return true;
	return isSomeVisibleRowsSelected ? "mixed" : false;
}

/** Header 전용 facade에서 정렬, filter, resize와 visible selection을 렌더링합니다. */
function DataGridTableHeaderView<T extends { id: Key }>({
	state,
	headerGroups,
	visibleRowKeys,
	table,
}: DataGridTableHeaderProps<T>) {
	const selectionMode = state.getSelectionMode();
	const isAllVisibleRowsSelected =
		state.isAllVisibleRowsSelected(visibleRowKeys);
	const isSomeVisibleRowsSelected =
		state.isSomeVisibleRowsSelected(visibleRowKeys);
	const t: Translate = (value) => value;
	const changeColumnSizing = (columnId: string, size: number | null) => {
		const column = table.getColumn(columnId);
		if (size == null) {
			column?.resetSize();
			return;
		}
		table.setColumnSizing((currentSizing) => ({
			...currentSizing,
			[columnId]: size,
		}));
	};

	return (
		<thead className="bg-surface-secondary">
			{headerGroups.map((headerGroup, rowIndex) => (
				<tr key={headerGroup.id}>
					{selectionMode ? (
						<th
							scope="col"
							className={SELECTION_HEADER_CELL_CLASS_NAME}
							rowSpan={headerGroups.length}
						>
							{rowIndex === 0 && selectionMode === "multiple" ? (
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
							) : rowIndex === 0 ? (
								<Typography className="sr-only" type="body-xs">
									{t(DATA_GRID_SELECTION_COLUMN_LABEL)}
								</Typography>
							) : null}
						</th>
					) : null}
					{headerGroup.headers.map((header) => {
						const label = header.isPlaceholder ? null : getHeaderLabel(header);
						const sortDirection = header.column.getIsSorted() || null;
						const isSortable = header.column.getCanSort();
						return (
							<th
								key={header.id}
								colSpan={header.colSpan}
								rowSpan={header.rowSpan}
								scope="col"
								className={HEADER_CELL_CLASS_NAME}
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
								{header.column.getCanResize() ? (
									<ColumnResizerInput
										columnId={header.column.id}
										maxSize={header.column.columnDef.maxSize}
										minSize={header.column.columnDef.minSize}
										onColumnSizingChange={changeColumnSizing}
									/>
								) : null}
							</th>
						);
					})}
				</tr>
			))}
		</thead>
	);
}

export const DataGridTableHeader = observer(
	DataGridTableHeaderView,
) as typeof DataGridTableHeaderView;
