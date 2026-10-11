"use client";

import type { SelectionConfig } from "@cocrepo/type";
import { flexRender, type Header, type Table } from "@tanstack/react-table";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { Typography } from "../../data-display/Typography";
import { type Translate, translateNode } from "../../i18n";
import type { DataGridState, Key } from "../DataGrid";
import { ColumnResizerInput } from "../input/ColumnResizerInput";
import { ColumnSortInput } from "../input/ColumnSortInput";

/** Table 헤더의 query와 선택 상호작용 상태를 관리합니다. */
export class DataGridTableHeaderState<TData extends { id: Key } = { id: Key }> {
	constructor(readonly state: DataGridState<TData>) {
		makeAutoObservable(this, { state: false }, { autoBind: true });
	}

	getSelectionMode(): Exclude<SelectionConfig["mode"], "none"> | undefined {
		const selectionMode = this.state.table.selection?.mode;
		return selectionMode === "none" ? undefined : selectionMode;
	}

	get selectedKeys() {
		return Array.from(
			this.state.selection?.selectedKeys ?? this.state.table.selectedRowKeys,
		);
	}

	get queryValues() {
		return this.state.query.filters;
	}

	isAllVisibleRowsSelected(visibleRowKeys: string[]) {
		const selectedKeySet = new Set(this.selectedKeys);
		return (
			visibleRowKeys.length > 0 &&
			visibleRowKeys.every((rowKey) => selectedKeySet.has(rowKey))
		);
	}

	isSomeVisibleRowsSelected(visibleRowKeys: string[]) {
		const selectedKeySet = new Set(this.selectedKeys);
		return visibleRowKeys.some((rowKey) => selectedKeySet.has(rowKey));
	}

	changeQuery(values: Record<string, unknown | null>) {
		return this.state.querySetter(values);
	}

	changeVisibleSelection(visibleRowKeys: string[], isSelected: boolean) {
		const nextSelectedKeys = isSelected
			? Array.from(new Set([...this.selectedKeys, ...visibleRowKeys]))
			: this.selectedKeys.filter((key) => !visibleRowKeys.includes(key));
		const nextSelection = new Set(nextSelectedKeys);
		if (this.state.selection?.setSelectedKeys) {
			this.state.selection.setSelectedKeys(nextSelection);
		} else {
			this.state.table.setSelectedRowKeys(nextSelection);
		}
		this.state.table.selection?.onSelectionChange?.(nextSelection);
	}
}

export interface DataGridTableHeaderProps<T extends { id: Key }> {
	state: DataGridTableHeaderState<T>;
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
export const DataGridTableHeader = observer(
	<T extends { id: Key }>({ state, table }: DataGridTableHeaderProps<T>) => {
		const headerGroups = table.getHeaderGroups();
		const visibleRowKeys = table.getCoreRowModel().rows.map((row) => row.id);
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
								className="h-9 w-10 border-r border-b border-border px-3 py-0 text-left align-middle"
								rowSpan={headerGroups.length}
							>
								{rowIndex === 0 && selectionMode === "multiple" ? (
									<input
										aria-checked={getSelectionAriaChecked(
											isAllVisibleRowsSelected,
											isSomeVisibleRowsSelected,
										)}
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
													!isAllVisibleRowsSelected &&
													isSomeVisibleRowsSelected;
										}}
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
								: getHeaderLabel(header);
							const sortDirection = header.column.getIsSorted() || null;
							const isSortable = header.column.getCanSort();
							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									rowSpan={header.rowSpan}
									scope="col"
									className="relative h-9 whitespace-nowrap border-r border-b border-border bg-surface-secondary px-3 py-0 text-[13px] font-semibold text-foreground"
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
	},
);
