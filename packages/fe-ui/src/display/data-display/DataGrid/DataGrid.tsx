"use client";

import { type Selection, Spinner } from "@heroui/react";
import {
	type ColumnDef,
	type ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import type {
	MultiSortDescriptor,
	SortEvent,
} from "../Table/SortableColumnHeader";
import { Table, type TableProps } from "../Table/Table";

export type Key = string | number;

export type DataGridState = {
	/** 선택된 행의 키 목록 */
	selectedKeys: Key[] | null;
	/** 정렬 상태 (복합 정렬 지원) */
	sorting?: MultiSortDescriptor;
};

export type DataGridProps<T> = Omit<
	TableProps<T>,
	"tableInstance" | "sortDescriptor"
> & {
	/** DataGrid 상태 */
	state: DataGridState;
	/** 컬럼 정의 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columns: ColumnDef<T, any>[];
	/** 데이터 배열 (id 필드 필수) */
	data: (T & { id: Key })[];
	/** 정렬 변경 핸들러 */
	onSortChange?: (event: SortEvent) => void;
	/** 정렬 가능한 컬럼 ID 목록 */
	sortableColumns?: string[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 로딩 텍스트 */
	loadingContent?: React.ReactNode;
};

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

/**
 * DataGrid 컴포넌트
 *
 * React Table과 HeroUI를 기반으로 한 데이터 그리드입니다.
 * 선택, 확장, 복합 정렬, 로딩 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * const { sorting, onSortChange, sortBy, sortOrder } = useDataGridSort({
 *   defaultSort: [{ column: "createdAt", direction: "desc" }]
 * });
 * const { take, skip } = useDataGridPagination();
 * const { data, isLoading } = useGetUsers({
 *   take, skip,
 *   sortBy: sortBy.join(","),
 *   sortOrder: sortOrder.join(",")
 * });
 *
 * <DataGrid
 *   data={data?.items ?? []}
 *   columns={columns}
 *   state={{ selectedKeys: [], sorting }}
 *   onSortChange={onSortChange}
 *   sortableColumns={["name", "email", "createdAt"]}
 *   isLoading={isLoading}
 *   selectionMode="multiple"
 * />
 * ```
 *
 * @description
 * 복합 정렬:
 * - 일반 클릭: 단일 정렬 (asc → desc → 해제)
 * - Shift+클릭: 복합 정렬에 추가/토글
 * - Ctrl+클릭: 해당 컬럼 정렬 제거
 */
const DataGridComponent = <T extends object>(props: DataGridProps<T>) => {
	const {
		data,
		columns,
		state,
		selectionMode,
		onSortChange,
		sortableColumns,
		isLoading = false,
		loadingContent,
		classNames,
		...rest
	} = props;

	const [expanded, setExpanded] = useState<ExpandedState>({});
	const idCounts = data.reduce((counts, row) => {
		const id = String((row as T & { id: Key }).id ?? "row");
		counts.set(id, (counts.get(id) ?? 0) + 1);
		return counts;
	}, new Map<string, number>());
	const defaultSelection = state.selectedKeys
		? new Set(state.selectedKeys)
		: new Set<Key>();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row, index, parent) =>
			getDataGridRowKey(
				row as T & { id: Key },
				index,
				idCounts,
				parent?.id,
			),
		getSubRows: (row: T & { children?: T[] }) => row?.children || [],
		getExpandedRowModel: getExpandedRowModel(),
		onExpandedChange: setExpanded,
		state: {
			expanded,
		},
	});

	const onSelectionChange = (selection: Selection) => {
		return selection;
	};

	return (
		<div className="relative">
			<Table
				{...rest}
				tableInstance={table}
				classNames={{
					...classNames,
					wrapper: ["bg-transparent", "p-0", "shadow-none", classNames?.wrapper]
						.filter(Boolean)
						.join(" "),
				}}
				onSelectionChange={onSelectionChange}
				selectedKeys={defaultSelection}
				selectionMode={selectionMode}
				sortDescriptor={state.sorting}
				onSortChange={onSortChange}
				sortableColumns={sortableColumns}
			/>
			{/* 로딩 오버레이 */}
			{isLoading && (
				<div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10 rounded-lg">
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
