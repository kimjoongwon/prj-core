"use client";

import type {
	DataGridColumnConfig,
	DataGridConfig,
	DataGridState as DataGridControllerState,
} from "@cocrepo/type";
import {
	type ColumnDef,
	type ExpandedState,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	type Header,
	useReactTable,
} from "@tanstack/react-table";
import { FileX } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Pagination } from "../control/Pagination/Pagination";
import { Table as HeroTable, Table } from "@heroui/react";
import type { Selection } from "react-aria-components";
import { Skeleton } from "../feedback/Skeleton/Skeleton";
import { translateNode, useT } from "../i18n";
import { InputRenderer } from "./InputRenderer";

export type Key = string | number;

export interface DataGridProps<T extends { id: Key }> {
	config: DataGridConfig<T>;
	state: DataGridControllerState;
	rows: T[];
	totalCount: number;
	isLoading?: boolean;
}

const DATA_GRID_DEFAULT_PAGE_SIZE = 20;
const DATA_GRID_EMPTY_MESSAGE = "데이터가 없습니다.";
const DATA_GRID_SKELETON_ROWS = [0, 1, 2, 3, 4];

function getColumnAlignClassName<T extends object>(column: ColumnDef<T, unknown>) {
	const align = column.meta?.align ?? "left";
	if (align === "left") {
		return undefined;
	}
	if (align === "right") {
		return "text-right";
	}
	return "text-center";
}

function getHeaderLabel<T extends object>(header: Header<T, unknown>) {
	return flexRender(header.column.columnDef.header, header.getContext());
}

function toColumnDef<TData, TValue = unknown>(
	config: DataGridColumnConfig<TData, TValue>,
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
	configs: DataGridColumnConfig<TData, unknown>[],
): ColumnDef<TData, unknown>[] {
	return configs.map((config) => toColumnDef(config));
}

function getSelectionMode<T extends { id: Key }>(
	config: DataGridConfig<T>,
): "single" | "multiple" | undefined {
	if (config.selection?.mode === "multiple") {
		return "multiple";
	}
	if (config.selection?.mode === "single") {
		return "single";
	}
	return undefined;
}

function getQueryNumber(value: unknown, fallback: number) {
	return typeof value === "number" ? value : fallback;
}

function getPageState(state: DataGridControllerState) {
	const take = getQueryNumber(
		state.query.values.take,
		DATA_GRID_DEFAULT_PAGE_SIZE,
	);
	const skip = getQueryNumber(state.query.values.skip, 0);

	return {
		take,
		skip,
		currentPage: Math.floor(skip / Math.max(take, 1)) + 1,
	};
}

function createIdCounts<T extends { id: Key }>(rows: T[]) {
	return rows.reduce((counts, row) => {
		const id = String(row.id ?? "row");
		counts.set(id, (counts.get(id) ?? 0) + 1);
		return counts;
	}, new Map<string, number>());
}

function createRowMap<T extends { id: Key }>(
	rows: T[],
	idCounts: Map<string, number>,
) {
	return new Map(
		rows.map((row, index) => [getDataGridRowKey(row, index, idCounts), row]),
	);
}

function selectionToKeySet<T extends { id: Key }>(
	selection: Selection,
	rows: T[],
) {
	if (selection === "all") {
		return new Set(rows.map((row) => String(row.id)));
	}

	return new Set(Array.from(selection as Set<Key>).map(String));
}

function getControlledSelectedKeys<T extends { id: Key }>(
	state: DataGridControllerState,
	config: DataGridConfig<T>,
) {
	return state.selection?.selectedKeys ?? config.selection?.selectedKeys;
}

export function getDataGridRowKey<T extends { id: Key }>(
	row: T,
	index: number,
	idCounts?: Map<string, number>,
	parentId?: string,
) {
	const baseId = String(row.id ?? "row");
	if (idCounts?.get(baseId) === 1) {
		return parentId ? `${parentId}/${baseId}` : baseId;
	}

	return `${parentId ?? "row"}:${baseId}:${index}`;
}

export const DataGrid = observer(
	<T extends { id: Key }>({
		config,
		state,
		rows,
		totalCount,
		isLoading = false,
	}: DataGridProps<T>) => {
		const t = useT();
		const [expanded, setExpanded] = useState<ExpandedState>({});
		const [localSelection, setLocalSelection] = useState<Selection>(
			new Set<Key>(),
		);
		const columns = toColumnDefs(config.columns) as ColumnDef<T, unknown>[];
		const idCounts = createIdCounts(rows);
		const rowMap = createRowMap(rows, idCounts);
		const controlledSelectedKeys = getControlledSelectedKeys(state, config);
		const localSelectedKeys = selectionToKeySet(localSelection, rows);
		const selectedKeySet = controlledSelectedKeys ?? localSelectedKeys;
		const selectionMode = getSelectionMode(config);
		const selectedTableKeys = selectionMode
			? (controlledSelectedKeys ?? localSelection)
			: undefined;
		const leftInputs = config.leftInputs ?? [];
		const rightInputs = config.rightInputs ?? [];
		const shouldRenderToolbar = leftInputs.length > 0 || rightInputs.length > 0;
		const { take, currentPage } = getPageState(state);
		const actionBarConfig = config.selection?.actionBar;
		const selectedCount = selectionMode ? selectedKeySet.size : 0;
		const shouldRenderActionBar = selectedCount > 0;
		const table = useReactTable({
			data: rows,
			columns,
			getCoreRowModel: getCoreRowModel(),
			getRowId: (row, index, parent) =>
				getDataGridRowKey(row, index, idCounts, parent?.id),
			getSubRows: (row: T & { children?: T[] }) => row.children || [],
			getExpandedRowModel: getExpandedRowModel(),
			onExpandedChange: setExpanded,
			state: {
				expanded,
			},
		});
		const headers = table.getHeaderGroups()[0]?.headers ?? [];
		const tableRows = table.getRowModel().rows;

		const handleRowAction = (key: string | number | bigint) => {
			if (!config.onRowClick) {
				return;
			}

			const selectedRow = rowMap.get(String(key));
			if (selectedRow) {
				config.onRowClick(selectedRow);
			}
		};
		const handleSelectionChange = (selection: Selection) => {
			if (!selectionMode) {
				return;
			}

			setLocalSelection(selection);
			const nextKeys = selectionToKeySet(selection, rows);

			state.selection?.setSelectedKeys?.(nextKeys);
			config.selection?.onSelectionChange?.(nextKeys);
		};
		const handlePageChange = (page: number) => {
			const newSkip = (page - 1) * take;
			void state.query.setValues({ skip: newSkip });
		};

		return (
			<>
				{shouldRenderToolbar && (
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
						<div className="flex flex-wrap items-center gap-2">
							{leftInputs.map((input) => (
								<InputRenderer key={input.id} config={input} state={state} />
							))}
						</div>
						<div className="flex items-center gap-2">
							{rightInputs.map((input) => (
								<InputRenderer key={input.id} config={input} state={state} />
							))}
						</div>
					</div>
				)}

				{isLoading ? (
					<div className="space-y-3">
						<div className="flex gap-4 p-4 bg-surface-secondary rounded-lg">
							<Skeleton className="w-8 h-4 rounded" />
							<Skeleton className="w-32 h-4 rounded" />
							<Skeleton className="w-48 h-4 rounded" />
							<Skeleton className="w-24 h-4 rounded" />
							<Skeleton className="w-20 h-4 rounded" />
						</div>
						{DATA_GRID_SKELETON_ROWS.map((index) => (
							<div
								key={index}
								className="flex gap-4 p-4 bg-surface rounded-lg"
							>
								<Skeleton className="w-8 h-4 rounded" />
								<Skeleton className="w-32 h-4 rounded" />
								<Skeleton className="w-48 h-4 rounded" />
								<Skeleton className="w-24 h-4 rounded" />
								<Skeleton className="w-20 h-4 rounded" />
							</div>
						))}
					</div>
				) : rows.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-muted">
						<FileX size={48} className="mb-4" />
						<p className="text-lg">
							{t(config.emptyMessage ?? DATA_GRID_EMPTY_MESSAGE)}
						</p>
					</div>
				) : (
						<div className="relative">
							<HeroTable
								aria-label={t("데이터 테이블")}
							>
								<Table.Content
									onRowAction={config.onRowClick ? handleRowAction : undefined}
									onSelectionChange={handleSelectionChange}
									selectedKeys={selectedTableKeys}
									selectionMode={selectionMode}
								>
								<Table.Header>
									{headers.map((header) => {
										const alignClassName = getColumnAlignClassName(
											header.column.columnDef,
										);

										return (
											<Table.Column
												key={header.id}
												className={alignClassName}
											>
												{header.isPlaceholder
													? null
												: translateNode(getHeaderLabel(header), t)}
										</Table.Column>
									);
								})}
							</Table.Header>
							<Table.Body>
								{tableRows.map((row) => (
									<Table.Row
										key={row.id}
										className={config.onRowClick ? "cursor-pointer" : undefined}
										onClick={
											config.onRowClick
												? () => handleRowAction(row.id)
												: undefined
										}
									>
										{row.getVisibleCells().map((cell) => (
											<Table.Cell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</Table.Cell>
										))}
										</Table.Row>
									))}
								</Table.Body>
								</Table.Content>
							</HeroTable>
						</div>
					)}

				<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 py-4">
					<span className="text-sm text-muted">
						{t("총")} {totalCount.toLocaleString()}
						{t("건")}
					</span>
					<Pagination
						totalCount={totalCount}
						limit={take}
						page={currentPage}
						onChange={handlePageChange}
						showControls
						size="sm"
					/>
				</div>

				{shouldRenderActionBar && (
					<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
						<div className="flex items-center gap-4 px-6 py-3 bg-surface-secondary rounded-full shadow-lg border border-border">
							{actionBarConfig?.showCount !== false && (
								<span className="text-sm font-medium text-foreground">
									{selectedCount}
									{t("개 선택됨")}
								</span>
							)}
							<div className="w-px h-6 bg-border" />
							<div className="flex items-center gap-2">
								{actionBarConfig?.actions?.map((action) => (
									<InputRenderer
										key={action.id}
										config={action}
										state={state}
									/>
								))}
							</div>
						</div>
					</div>
				)}
			</>
		);
	},
);
