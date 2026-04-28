"use client";

import {
	cn,
	type Selection,
	Spinner,
	Table as HeroTable,
	type TableBodyProps,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	type TableProps as HeroTableProps,
	TableRow,
} from "@heroui/react";
import {
	type ColumnDef,
	type ExpandedState,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	type Header,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";

export type Key = string | number;

export type SortDirection = "asc" | "desc";

export type SortDescriptor = {
	column: string;
	direction: SortDirection;
};

export type MultiSortDescriptor = SortDescriptor[];

export type SortEvent = {
	column: string;
	shiftKey: boolean;
	ctrlKey: boolean;
};

export type DataGridState = {
	selectedKeys: Key[] | null;
	sorting?: MultiSortDescriptor;
};

export type DataGridProps<T extends object> = Omit<
	HeroTableProps,
	"sortDescriptor" | "onSortChange"
> & {
	state: DataGridState;
	columns: ColumnDef<T, unknown>[];
	data: (T & { id: Key })[];
	onSortChange?: (event: SortEvent) => void;
	sortableColumns?: string[];
	isLoading?: boolean;
	loadingContent?: ReactNode;
	tableBody?: Omit<TableBodyProps<T>, "children">;
};

interface SortableDataGridColumnHeaderProps {
	columnId: string;
	label: ReactNode;
	sortDescriptor?: MultiSortDescriptor;
	onSortChange?: (event: SortEvent) => void;
	sortable?: boolean;
}

function getColumnAlign<T extends object>(column: ColumnDef<T, unknown>) {
	const align = column.meta?.align ?? "left";
	if (align === "left") {
		return "start";
	}
	if (align === "right") {
		return "end";
	}
	return align;
}

function getHeaderLabel<T extends object>(header: Header<T, unknown>) {
	return flexRender(header.column.columnDef.header, header.getContext());
}

function resolveClassNameValue(className: unknown) {
	if (Array.isArray(className)) {
		return className.filter(Boolean).join(" ");
	}
	if (typeof className === "string") {
		return className;
	}
	return undefined;
}

function mergeWrapperClassName(className: unknown) {
	return ["bg-transparent", "p-0", "shadow-none", resolveClassNameValue(className)]
		.filter(Boolean)
		.join(" ");
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

const SortableDataGridColumnHeader = observer(
	function SortableDataGridColumnHeader({
		columnId,
		label,
		sortDescriptor = [],
		onSortChange,
		sortable = true,
	}: SortableDataGridColumnHeaderProps) {
		const currentSort = sortDescriptor.find((sort) => sort.column === columnId);
		const sortIndex = sortDescriptor.findIndex(
			(sort) => sort.column === columnId,
		);
		const isMultiSort = sortDescriptor.length > 1;

		const handleClick = (event: MouseEvent) => {
			if (!sortable || !onSortChange) {
				return;
			}

			onSortChange({
				column: columnId,
				shiftKey: event.shiftKey,
				ctrlKey: event.ctrlKey || event.metaKey,
			});
		};

		if (!sortable) {
			return <span>{label}</span>;
		}

		return (
			<button
				type="button"
				onClick={handleClick}
				className={cn(
					"flex items-center gap-1 transition-colors hover:text-foreground",
					currentSort ? "text-primary" : "text-foreground/70",
				)}
			>
				<span>{label}</span>
				<span className="flex items-center">
					{currentSort ? (
						<>
							{currentSort.direction === "asc" ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
							{isMultiSort && (
								<span className="ml-0.5 text-xs text-primary/70">
									{sortIndex + 1}
								</span>
							)}
						</>
					) : (
						<ChevronsUpDown className="h-4 w-4 opacity-50" />
					)}
				</span>
			</button>
		);
	},
);

const DataGridComponent = <T extends object>({
	data,
	columns,
	state,
	selectionMode,
	onSortChange,
	sortableColumns = [],
	isLoading = false,
	loadingContent,
	classNames,
	tableBody = {
		emptyContent: "데이터가 없습니다.",
	},
	onSelectionChange,
	...rest
}: DataGridProps<T>) => {
	const [expanded, setExpanded] = useState<ExpandedState>({});
	const [localSelection, setLocalSelection] = useState<Selection>(
		state.selectedKeys ? new Set(state.selectedKeys) : new Set<Key>(),
	);
	const idCounts = data.reduce((counts, row) => {
		const id = String(row.id ?? "row");
		counts.set(id, (counts.get(id) ?? 0) + 1);
		return counts;
	}, new Map<string, number>());
	const selectedKeys = state.selectedKeys
		? new Set(state.selectedKeys)
		: localSelection;
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row, index, parent) =>
			getDataGridRowKey(row as T & { id: Key }, index, idCounts, parent?.id),
		getSubRows: (row: T & { children?: T[] }) => row.children || [],
		getExpandedRowModel: getExpandedRowModel(),
		onExpandedChange: setExpanded,
		state: {
			expanded,
		},
	});
	const headers = table.getHeaderGroups()[0]?.headers ?? [];
	const rows = table.getRowModel().rows;
	const ariaLabel =
		typeof rest["aria-label"] === "string"
			? rest["aria-label"]
			: "데이터 테이블";
	const handleSelectionChange = (selection: Selection) => {
		setLocalSelection(selection);
		state.selectedKeys =
			selection === "all"
				? data.map((row) => row.id)
				: Array.from(selection as Set<Key>);
		onSelectionChange?.(selection);
	};

	return (
		<div className="relative">
			<HeroTable
				{...rest}
				aria-label={ariaLabel}
				classNames={{
					...classNames,
					wrapper: mergeWrapperClassName(classNames?.wrapper),
				}}
				onSelectionChange={handleSelectionChange}
				selectedKeys={selectedKeys}
				selectionMode={selectionMode}
			>
				<TableHeader>
					{headers.map((header) => {
						const align = getColumnAlign(header.column.columnDef);
						const isSortable = sortableColumns.includes(header.id);

						return (
							<TableColumn key={header.id} colSpan={header.colSpan} align={align}>
								{header.isPlaceholder ? null : isSortable && onSortChange ? (
									<SortableDataGridColumnHeader
										columnId={header.id}
										label={getHeaderLabel(header)}
										sortDescriptor={state.sorting}
										onSortChange={onSortChange}
										sortable
									/>
								) : (
									getHeaderLabel(header)
								)}
							</TableColumn>
						);
					})}
				</TableHeader>
				<TableBody {...tableBody}>
					{rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</HeroTable>
			{isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60">
					{loadingContent ?? (
						<div className="flex flex-col items-center gap-2">
							<Spinner size="lg" />
							<span className="text-sm text-default-500">로딩 중...</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export const DataGrid: typeof DataGridComponent = observer(DataGridComponent);
