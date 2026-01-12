"use client";

import {
	Table as HeroTable,
	type TableProps as HeroTableProps,
	TableBody,
	type TableBodyProps,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import {
	flexRender,
	type Table as ReactTableProps,
} from "@tanstack/react-table";
import {
	SortableColumnHeader,
	type MultiSortDescriptor,
	type SortEvent,
} from "./SortableColumnHeader";

export type TableProps<T> = {
	tableInstance: ReactTableProps<T>;
	tableBody?: Omit<TableBodyProps<T>, "children">;
	/** 정렬 상태 (복합 정렬 지원) */
	sortDescriptor?: MultiSortDescriptor;
	/** 정렬 변경 핸들러 */
	onSortChange?: (event: SortEvent) => void;
	/** 정렬 가능한 컬럼 ID 목록 */
	sortableColumns?: string[];
} & Omit<HeroTableProps, "sortDescriptor" | "onSortChange">;

export const Table = <T extends object>({
	tableInstance,
	selectedKeys,
	onSelectionChange,
	tableBody = {
		emptyContent: "데이터가 없습니다.",
	},
	sortDescriptor,
	onSortChange,
	sortableColumns = [],
	...rest
}: TableProps<T>) => {
	const headers = tableInstance?.getHeaderGroups?.()?.[0]?.headers || [];

	const isSortable = (columnId: string) => {
		return sortableColumns.includes(columnId);
	};

	return (
		<HeroTable
			{...rest}
			onSelectionChange={onSelectionChange}
			selectedKeys={selectedKeys}
		>
			<TableHeader>
				{headers.map((header) => (
					<TableColumn key={header.id} colSpan={header.colSpan}>
						{header.isPlaceholder ? null : isSortable(header.id) &&
						  onSortChange ? (
							<SortableColumnHeader
								columnId={header.id}
								label={flexRender(
									header.column.columnDef.header,
									header.getContext(),
								)}
								sortDescriptor={sortDescriptor}
								onSortChange={onSortChange}
								sortable
							/>
						) : (
							flexRender(header.column.columnDef.header, header.getContext())
						)}
					</TableColumn>
				))}
			</TableHeader>
			<TableBody {...tableBody}>
				{tableInstance.getRowModel().rows.map((row) => (
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
	);
};
