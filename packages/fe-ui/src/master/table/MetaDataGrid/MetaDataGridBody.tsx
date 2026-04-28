"use client";

import type {
	MetaDataGridColumnConfig,
	MetaDataGridConfig,
	MetaDataGridState,
} from "@cocrepo/type";
import type { ColumnDef } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import type { Key } from "../../../display/data-display/DataGrid";
import { DataGrid } from "../../../display/data-display/DataGrid";
import { getDataGridRowKey } from "../../../display/data-display/DataGrid/DataGrid";

interface MetaDataGridBodyProps<T extends object> {
	config: MetaDataGridConfig<T>;
	state: MetaDataGridState;
	rows: T[];
	isLoading?: boolean;
}

function toColumnDef<TData, TValue = unknown>(
	config: MetaDataGridColumnConfig<TData, TValue>,
): ColumnDef<TData, TValue> {
	const { field, label, isRequired, align, ...columnDefProps } = config;

	const accessorKey =
		"accessorKey" in columnDefProps
			? (columnDefProps.accessorKey as string)
			: (field as string);
	const header = "header" in columnDefProps ? columnDefProps.header : label;

	return {
		id: String(field),
		accessorKey,
		header: header as ColumnDef<TData, TValue>["header"],
		meta: {
			isRequired,
			align,
			label,
			...("meta" in columnDefProps ? columnDefProps.meta : {}),
		},
		...columnDefProps,
	} as ColumnDef<TData, TValue>;
}

function toColumnDefs<TData>(
	configs: MetaDataGridColumnConfig<TData, unknown>[],
): ColumnDef<TData, unknown>[] {
	return configs.map((config) => toColumnDef(config));
}

/**
 * MetaDataGrid 본문 영역 (DataGrid 래퍼)
 */
export const MetaDataGridBody = observer(
	<T extends object>({
		config,
		state,
		rows,
		isLoading,
	}: MetaDataGridBodyProps<T>) => {
		// MetaDataGridColumnConfig를 ColumnDef로 변환
		const columns = toColumnDefs(config.columns) as ColumnDef<T, unknown>[];
		const idCounts = (rows as (T & { id: Key })[]).reduce(
			(counts, row) => {
				const id = String(row.id ?? "row");
				counts.set(id, (counts.get(id) ?? 0) + 1);
				return counts;
			},
			new Map<string, number>(),
		);

		// 키 기반 행 맵 (onRowClick 매핑용)
		const rowMap = new Map(
			(rows as (T & { id: Key })[]).map((row, index) => [
				getDataGridRowKey(row, index, idCounts),
				row,
			]),
		);

		// 선택된 키 목록
		const selectedKeySet =
			state.selection?.selectedKeys ?? config.selection?.selectedKeys;
		const selectedKeys = selectedKeySet
			? Array.from(selectedKeySet)
			: null;

		const handleRowAction = (key: string | number | bigint) => {
			if (!config.onRowClick) {
				return;
			}

			const selectedRow = rowMap.get(String(key));
			if (selectedRow) {
				config.onRowClick(selectedRow);
			}
		};

		return (
			<DataGrid
				data={rows as (T & { id: Key })[]}
				columns={columns as ColumnDef<object, unknown>[]}
				state={{ selectedKeys }}
				selectionMode={
					config.selection?.mode === "multiple"
						? "multiple"
						: config.selection?.mode === "single"
							? "single"
							: undefined
				}
				classNames={
					config.onRowClick
						? {
								tr: "cursor-pointer hover:bg-content2",
							}
						: undefined
				}
				onRowAction={config.onRowClick ? handleRowAction : undefined}
				isLoading={isLoading}
			/>
		);
	},
);
