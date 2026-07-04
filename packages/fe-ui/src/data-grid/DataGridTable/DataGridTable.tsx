"use client";

import type { DataGridConfig, DataGridState } from "@cocrepo/type";
import type { Header } from "@tanstack/react-table";
import type { Translate } from "../../i18n";
import { DataGridTableBody } from "../DataGridTableBody";
import { DataGridTableHeader } from "../DataGridTableHeader";
import type { DataGridBodyRow } from "../internal/grouping";
import type { Key } from "../internal/rowKeys";
import type { DataGridSelectionMode } from "../internal/selection";
import type { DataGridSortDirection } from "../internal/sorting";

export interface DataGridTableProps<T extends { id: Key }> {
	config: DataGridConfig<T>;
	headers: Header<T, unknown>[];
	isAllVisibleRowsSelected: boolean;
	isSomeVisibleRowsSelected: boolean;
	rows: DataGridBodyRow<T>[];
	selectedKeySet: Set<string>;
	selectionMode: DataGridSelectionMode;
	sortValues: string[];
	state: DataGridState;
	t: Translate;
	onRowSelectionChange: (rowKey: string, isSelected: boolean) => void;
	onSortChange: (
		columnId: string,
		currentDirection: DataGridSortDirection,
	) => void;
	onVisibleSelectionChange: (isSelected: boolean) => void;
}

export function DataGridTableView<T extends { id: Key }>({
	config,
	headers,
	isAllVisibleRowsSelected,
	isSomeVisibleRowsSelected,
	rows,
	selectedKeySet,
	selectionMode,
	sortValues,
	state,
	t,
	onRowSelectionChange,
	onSortChange,
	onVisibleSelectionChange,
}: DataGridTableProps<T>) {
	const tableColumnCount = headers.length + (selectionMode ? 1 : 0);

	return (
		<div className="relative">
			<div className="overflow-hidden rounded border border-[#d6dde7] bg-surface dark:border-white/10 dark:bg-neutral-900">
				<div className="overflow-x-auto">
					<table
						aria-label={t("데이터 테이블")}
						className="min-w-full border-collapse text-left"
					>
						<DataGridTableHeader
							headers={headers}
							isAllVisibleRowsSelected={isAllVisibleRowsSelected}
							isSomeVisibleRowsSelected={isSomeVisibleRowsSelected}
							selectionMode={selectionMode}
							sortValues={sortValues}
							state={state}
							t={t}
							onSortChange={onSortChange}
							onVisibleSelectionChange={onVisibleSelectionChange}
						/>
						<DataGridTableBody
							config={config}
							rows={rows}
							selectedKeySet={selectedKeySet}
							selectionMode={selectionMode}
							tableColumnCount={tableColumnCount}
							t={t}
							onRowSelectionChange={onRowSelectionChange}
						/>
					</table>
				</div>
			</div>
		</div>
	);
}
