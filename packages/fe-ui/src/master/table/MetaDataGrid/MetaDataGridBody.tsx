"use client";

import type {
	InputConfig,
	MetaDataGridColumnConfig,
	MetaDataGridConfig,
	MetaDataGridState,
} from "@cocrepo/type";
import type { ColumnDef } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import type { Key } from "../../../display/data-display/DataGrid";
import { DataGrid } from "../../../display/data-display/DataGrid";
import { getDataGridRowKey } from "../../../display/data-display/DataGrid/DataGrid";
import { InputRenderer } from "./InputRenderer";

interface MetaDataGridBodyProps<T extends object> {
	config: MetaDataGridConfig<T>;
	state: MetaDataGridState;
	rows: T[];
	isLoading?: boolean;
}

interface MetaDataGridColumnHeaderProps {
	field: string;
	label: ReactNode;
	filter?: InputConfig;
	state: MetaDataGridState;
}

const MetaDataGridColumnHeader = observer(function MetaDataGridColumnHeader({
	field,
	label,
	filter,
	state,
}: MetaDataGridColumnHeaderProps) {
	if (!filter) {
		return <>{label}</>;
	}

	const queryKey = filter.props?.queryKey ?? field;
	const filterConfig: InputConfig = {
		...filter,
		props: {
			...filter.props,
			queryKey,
			placement: "column-header",
		},
	};

	return (
		<div className="flex min-w-0 flex-col gap-2 py-1">
			<div className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-default-500">
				{label}
			</div>
			<InputRenderer config={filterConfig} state={state} />
		</div>
	);
});

function isColumnHeaderInput(input: InputConfig) {
	return (
		input.props?.placement === "column-header" &&
		(input.type === "search" || input.type === "select")
	);
}

function resolveColumnFilter(
	field: string,
	index: number,
	filter: InputConfig | undefined,
	headerInputs: InputConfig[],
) {
	if (filter) {
		return filter;
	}

	const exactInput = headerInputs.find(
		(input) => (input.props?.queryKey ?? input.id) === field,
	);
	if (exactInput) {
		return exactInput;
	}

	return index === 0 ? headerInputs[0] : undefined;
}

function toColumnDef<TData, TValue = unknown>(
	config: MetaDataGridColumnConfig<TData, TValue>,
	state: MetaDataGridState,
	headerInputs: InputConfig[],
	index: number,
): ColumnDef<TData, TValue> {
	const { field, label, isRequired, align, filter, ...columnDefProps } = config;

	const accessorKey =
		"accessorKey" in columnDefProps
			? (columnDefProps.accessorKey as string)
			: (field as string);

	const headerLabel = (
		"header" in columnDefProps && typeof columnDefProps.header !== "function"
			? columnDefProps.header
			: label
	) as ReactNode;
	const fallbackHeader =
		"header" in columnDefProps ? columnDefProps.header : label;
	const resolvedFilter = resolveColumnFilter(
		String(field),
		index,
		filter,
		headerInputs,
	);
	const header = resolvedFilter ? (
		<MetaDataGridColumnHeader
			field={String(field)}
			label={headerLabel}
			filter={resolvedFilter}
			state={state}
		/>
	) : (
		fallbackHeader
	);

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
	state: MetaDataGridState,
	headerInputs: InputConfig[],
): ColumnDef<TData, unknown>[] {
	return configs.map((config, index) =>
		toColumnDef(config, state, headerInputs, index),
	);
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
		const headerInputs = [
			...(config.leftInputs ?? []),
			...(config.rightInputs ?? []),
		].filter(isColumnHeaderInput);
		const columns = toColumnDefs(
			config.columns,
			state,
			headerInputs,
		) as ColumnDef<T, unknown>[];
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
