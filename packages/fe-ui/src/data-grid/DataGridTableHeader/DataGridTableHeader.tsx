"use client";

import type { Table } from "@tanstack/react-table";
import { Typography } from "../../data-display/Typography";
import { translateNode } from "../../i18n";
import type { DataGridRow } from "../DataGrid";
import type { DataGridTableState } from "../DataGridTable/DataGridTable";
import { ColumnResizerInput } from "../input/ColumnResizerInput";
import { ColumnSortInput } from "../input/ColumnSortInput";
import { useHandlers } from "./useHandlers";

export interface DataGridTableHeaderProps<T extends DataGridRow> {
	state: DataGridTableState<T>;
	table: Table<T>;
}

/** TanStack 중첩 헤더의 정렬·선택·너비 변경 UI를 렌더링합니다. */
export const DataGridTableHeader = <T extends DataGridRow>({
	state,
	table,
}: DataGridTableHeaderProps<T>) => {
	const handlers = useHandlers(state, table);
	const headerGroups = table.getHeaderGroups();
	const { selectionMode, isAllRowsSelected } = handlers;
	const t = handlers.translate;
	return (
		<thead className="bg-surface-secondary">
			{headerGroups.map((headerGroup, rowIndex) => (
				<tr key={headerGroup.id}>
					{selectionMode ? (
						<th
							scope="col"
							className="h-9 w-10 border-r border-b border-border px-3 py-0 text-left align-middle"
							rowSpan={headerGroups.length}
						>
							{rowIndex === 0 && selectionMode === "multiple" ? (
								<input
									aria-checked={handlers.selectionAriaChecked}
									checked={isAllRowsSelected}
									className="size-3.5 rounded border-border text-accent accent-current"
									onChange={table.getToggleAllRowsSelectedHandler()}
									ref={handlers.selectionCheckboxRef}
									type="checkbox"
								/>
							) : rowIndex === 0 ? (
								<Typography className="sr-only" type="body-xs">
									{t("행 선택")}
								</Typography>
							) : null}
						</th>
					) : null}
					{headerGroup.headers.map((header) => {
						const label = header.isPlaceholder
							? null
							: handlers.getHeaderLabel(header);
						const accessibleLabel = handlers.getHeaderAccessibleLabel(header);
						const sortDirection = header.column.getIsSorted() || null;
						const isSortable = header.column.getCanSort();
						return (
							<th
								key={header.id}
								aria-label={accessibleLabel ?? undefined}
								colSpan={header.colSpan}
								rowSpan={header.rowSpan}
								scope="col"
								className="relative h-9 whitespace-nowrap border-r border-b border-border bg-surface-secondary px-3 py-0 text-[13px] font-semibold text-foreground"
							>
								{label == null ? null : isSortable ? (
									<ColumnSortInput
										label={label}
										sortDirection={sortDirection}
										onToggle={handlers.toggleSorting(header.column)}
									/>
								) : (
									translateNode(label, t)
								)}
								{header.column.getCanResize() ? (
									<ColumnResizerInput
										columnId={header.column.id}
										maxSize={header.column.columnDef.maxSize}
										minSize={header.column.columnDef.minSize}
										onColumnSizingChange={handlers.changeColumnSizing}
									/>
								) : null}
							</th>
						);
					})}
				</tr>
			))}
		</thead>
	);
};
