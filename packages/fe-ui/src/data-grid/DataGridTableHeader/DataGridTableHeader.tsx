"use client";

import type { DataGridState } from "@cocrepo/type";
import { flexRender, type Header } from "@tanstack/react-table";
import { type Translate, translateNode } from "../../i18n";
import { DataGridColumnResizer } from "../DataGridColumnResizer";
import { DataGridHeaderFilter } from "../DataGridHeaderFilter";
import { DataGridSortHeader } from "../DataGridSortHeader";
import { joinClassNames } from "../internal/classNames";
import { getColumnAlignClassName } from "../internal/columnConfig";
import { getColumnWidthStyle } from "../internal/columnSizing";
import {
	DATA_GRID_SELECT_ALL_LABEL,
	DATA_GRID_SELECTION_COLUMN_LABEL,
} from "../internal/constants";
import type { Key } from "../internal/rowKeys";
import type { DataGridSelectionMode } from "../internal/selection";
import type { DataGridSortDirection } from "../internal/sorting";
import { getSortDirection } from "../internal/sorting";

const HEADER_CELL_CLASS_NAME =
	"relative h-9 whitespace-nowrap border-r border-b border-[#d6dde7] bg-[#f8fafc] px-3 py-0 text-[13px] font-semibold text-[#374151] dark:border-white/10 dark:bg-neutral-800 dark:text-slate-200";
const HEADER_FILTER_CELL_CLASS_NAME =
	"border-r border-b border-[#d6dde7] bg-[#f8fafc] px-3 py-1.5 align-top dark:border-white/10 dark:bg-neutral-800";
const SELECTION_HEADER_CELL_CLASS_NAME =
	"h-9 w-10 border-r border-b border-[#d6dde7] px-3 py-0 text-left align-middle dark:border-white/10";
const SELECTION_FILTER_CELL_CLASS_NAME =
	"w-10 border-r border-b border-[#d6dde7] px-3 py-1.5 align-top dark:border-white/10";

export interface DataGridTableHeaderProps<T extends { id: Key }> {
	headers: Header<T, unknown>[];
	isAllVisibleRowsSelected: boolean;
	isSomeVisibleRowsSelected: boolean;
	selectionMode: DataGridSelectionMode;
	sortValues: string[];
	state: DataGridState;
	t: Translate;
	onSortChange: (
		columnId: string,
		currentDirection: DataGridSortDirection,
	) => void;
	onVisibleSelectionChange: (isSelected: boolean) => void;
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
	if (isAllVisibleRowsSelected) {
		return true;
	}
	return isSomeVisibleRowsSelected ? "mixed" : false;
}

export function DataGridTableHeaderView<T extends { id: Key }>({
	headers,
	isAllVisibleRowsSelected,
	isSomeVisibleRowsSelected,
	selectionMode,
	sortValues,
	state,
	t,
	onSortChange,
	onVisibleSelectionChange,
}: DataGridTableHeaderProps<T>) {
	const shouldRenderHeaderFilters = headers.some((header) =>
		getFloatingFilterInput(header),
	);

	return (
		<thead className="bg-[#f8fafc] dark:bg-neutral-800">
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
								className="size-3.5 rounded border-[#9ca3af] text-accent accent-current dark:border-white/20"
								onChange={(event) =>
									onVisibleSelectionChange(event.currentTarget.checked)
								}
								ref={(input) => {
									if (input) {
										input.indeterminate =
											!isAllVisibleRowsSelected && isSomeVisibleRowsSelected;
									}
								}}
								type="checkbox"
							/>
						) : (
							<span className="sr-only">
								{t(DATA_GRID_SELECTION_COLUMN_LABEL)}
							</span>
						)}
					</th>
				) : null}
				{headers.map((header) => {
					const alignClassName = getColumnAlignClassName(
						header.column.columnDef,
					);
					const label = header.isPlaceholder ? null : getHeaderLabel(header);
					const sortDirection = getSortDirection(header.column.id, sortValues);
					const isSortable = header.column.columnDef.meta?.isSortable === true;

					return (
						<th
							key={header.id}
							scope="col"
							className={joinClassNames(HEADER_CELL_CLASS_NAME, alignClassName)}
							style={getColumnWidthStyle(header.column.columnDef)}
						>
							{label == null ? null : isSortable ? (
								<DataGridSortHeader
									label={label}
									sortDirection={sortDirection}
									onToggle={() => onSortChange(header.column.id, sortDirection)}
								/>
							) : (
								translateNode(label, t)
							)}
							<DataGridColumnResizer
								columnId={header.column.id}
								maxSize={header.column.columnDef.maxSize}
								minSize={header.column.columnDef.minSize}
								state={state}
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
								className={joinClassNames(
									HEADER_FILTER_CELL_CLASS_NAME,
									alignClassName,
								)}
								style={getColumnWidthStyle(header.column.columnDef)}
							>
								{headerInput ? (
									<DataGridHeaderFilter config={headerInput} state={state} />
								) : null}
							</th>
						);
					})}
				</tr>
			) : null}
		</thead>
	);
}
