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
	type Row,
	useReactTable,
} from "@tanstack/react-table";
import { FileX } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Skeleton } from "../feedback/Skeleton/Skeleton";
import { translateNode, useT } from "../i18n";
import { Pagination } from "../navigation/Pagination/Pagination";
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
const DATA_GRID_SELECTION_COLUMN_LABEL = "행 선택";
const DATA_GRID_SELECT_ALL_LABEL = "현재 페이지 행 전체 선택";

function joinClassNames(...classNames: Array<string | false | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

function getColumnAlignClassName<T extends object>(
	column: ColumnDef<T, unknown>,
) {
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

function getControlledSelectedKeys<T extends { id: Key }>(
	state: DataGridControllerState,
	config: DataGridConfig<T>,
) {
	return state.selection?.selectedKeys ?? config.selection?.selectedKeys;
}

function getVisibleRowKeys<T extends { id: Key }>(tableRows: Row<T>[]) {
	return tableRows.map((row) => row.id);
}

function getNextRowSelectedKeys(
	currentKeys: Set<string>,
	rowKey: string,
	selectionMode: "single" | "multiple",
	isSelected: boolean,
) {
	if (selectionMode === "single") {
		return isSelected ? new Set<string>([rowKey]) : new Set<string>();
	}

	const nextKeys = new Set(currentKeys);
	if (isSelected) {
		nextKeys.add(rowKey);
	} else {
		nextKeys.delete(rowKey);
	}
	return nextKeys;
}

function getNextVisibleRowSelectedKeys(
	currentKeys: Set<string>,
	visibleRowKeys: string[],
	isSelected: boolean,
) {
	const nextKeys = new Set(currentKeys);

	for (const rowKey of visibleRowKeys) {
		if (isSelected) {
			nextKeys.add(rowKey);
		} else {
			nextKeys.delete(rowKey);
		}
	}

	return nextKeys;
}

/** 중복 id가 있는 행도 안전하게 식별할 수 있는 DataGrid row key를 만듭니다. */
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

/** TanStack Table model을 native table 태그로 렌더링하는 DataGrid입니다. */
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
		const [localSelectedKeys, setLocalSelectedKeys] = useState<Set<string>>(
			() => new Set<string>(),
		);
		const columns = toColumnDefs(config.columns) as ColumnDef<T, unknown>[];
		const idCounts = createIdCounts(rows);
		const controlledSelectedKeys = getControlledSelectedKeys(state, config);
		const selectedKeySet = controlledSelectedKeys ?? localSelectedKeys;
		const selectionMode = getSelectionMode(config);
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
		const visibleRowKeys = getVisibleRowKeys(tableRows);
		const isAllVisibleRowsSelected =
			selectionMode === "multiple" &&
			visibleRowKeys.length > 0 &&
			visibleRowKeys.every((rowKey) => selectedKeySet.has(rowKey));
		const isSomeVisibleRowsSelected =
			selectionMode === "multiple" &&
			visibleRowKeys.some((rowKey) => selectedKeySet.has(rowKey));

		const handleSelectionChange = (nextKeys: Set<string>) => {
			if (!selectionMode) {
				return;
			}

			setLocalSelectedKeys(nextKeys);
			state.selection?.setSelectedKeys?.(nextKeys);
			config.selection?.onSelectionChange?.(nextKeys);
		};
		const handleVisibleSelectionChange = (isSelected: boolean) => {
			if (selectionMode !== "multiple") {
				return;
			}

			handleSelectionChange(
				getNextVisibleRowSelectedKeys(
					selectedKeySet,
					visibleRowKeys,
					isSelected,
				),
			);
		};
		const handleRowSelectionChange = (rowKey: string, isSelected: boolean) => {
			if (!selectionMode) {
				return;
			}

			handleSelectionChange(
				getNextRowSelectedKeys(
					selectedKeySet,
					rowKey,
					selectionMode,
					isSelected,
				),
			);
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
							<div key={index} className="flex gap-4 p-4 bg-surface rounded-lg">
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
						<div className="overflow-hidden rounded-lg border border-border bg-surface">
							<div className="overflow-x-auto">
								<table
									aria-label={t("데이터 테이블")}
									className="min-w-full border-collapse text-left"
								>
									<thead className="bg-surface-secondary">
										<tr>
											{selectionMode ? (
												<th
													scope="col"
													className="w-12 px-4 py-3 text-left align-middle"
												>
													{selectionMode === "multiple" ? (
														<input
															aria-checked={
																isAllVisibleRowsSelected
																	? true
																	: isSomeVisibleRowsSelected
																		? "mixed"
																		: false
															}
															aria-label={t(DATA_GRID_SELECT_ALL_LABEL)}
															checked={isAllVisibleRowsSelected}
															className="size-4 rounded border-border text-accent accent-current"
															onChange={(event) =>
																handleVisibleSelectionChange(
																	event.currentTarget.checked,
																)
															}
															ref={(input) => {
																if (input) {
																	input.indeterminate =
																		!isAllVisibleRowsSelected &&
																		isSomeVisibleRowsSelected;
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

												return (
													<th
														key={header.id}
														scope="col"
														className={joinClassNames(
															"whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted",
															alignClassName,
														)}
													>
														{header.isPlaceholder
															? null
															: translateNode(getHeaderLabel(header), t)}
													</th>
												);
											})}
										</tr>
									</thead>
									<tbody>
										{tableRows.map((row) => {
											const isSelected = selectedKeySet.has(row.id);

											return (
												<tr
													key={row.id}
													aria-selected={selectionMode ? isSelected : undefined}
													className={joinClassNames(
														"border-t border-border transition-colors",
														isSelected && "bg-accent/5",
														config.onRowClick
															? "cursor-pointer hover:bg-surface-secondary/80 focus-within:bg-surface-secondary/80"
															: "hover:bg-surface-secondary/60",
													)}
													onClick={
														config.onRowClick
															? () => config.onRowClick?.(row.original)
															: undefined
													}
													onKeyDown={
														config.onRowClick
															? (event) => {
																	if (
																		event.key === "Enter" ||
																		event.key === " "
																	) {
																		event.preventDefault();
																		config.onRowClick?.(row.original);
																	}
																}
															: undefined
													}
													tabIndex={config.onRowClick ? 0 : undefined}
												>
													{selectionMode ? (
														<td className="w-12 px-4 py-3 align-middle">
															<input
																aria-label={t(DATA_GRID_SELECTION_COLUMN_LABEL)}
																checked={isSelected}
																className="size-4 border-border text-accent accent-current"
																name={`data-grid-${config.entity}-selection`}
																onChange={(event) =>
																	handleRowSelectionChange(
																		row.id,
																		event.currentTarget.checked,
																	)
																}
																onClick={(event) => event.stopPropagation()}
																type={
																	selectionMode === "single"
																		? "radio"
																		: "checkbox"
																}
															/>
														</td>
													) : null}
													{row.getVisibleCells().map((cell) => {
														const alignClassName = getColumnAlignClassName(
															cell.column.columnDef,
														);

														return (
															<td
																key={cell.id}
																className={joinClassNames(
																	"px-4 py-3 align-middle text-sm text-foreground",
																	alignClassName,
																)}
															>
																{flexRender(
																	cell.column.columnDef.cell,
																	cell.getContext(),
																)}
															</td>
														);
													})}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
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
