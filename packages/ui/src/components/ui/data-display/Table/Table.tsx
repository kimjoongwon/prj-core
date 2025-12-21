import {
	Table as HeroTable,
	TableProps as HeroTableProps,
	TableBody,
	TableBodyProps,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { flexRender, Table as ReactTableProps } from "@tanstack/react-table";

export type TableProps<T> = {
	tableInstance: ReactTableProps<T>;
	tableBody?: Omit<TableBodyProps<T>, "children">;
} & HeroTableProps;

export const Table = <T extends any>({
	tableInstance,
	selectedKeys,
	onSelectionChange,
	tableBody = {
		emptyContent: "데이터가 없습니다.",
	},
	...rest
}: TableProps<T>) => {
	const headers = tableInstance?.getHeaderGroups?.()?.[0]?.headers || [];

	return (
		<HeroTable
			{...rest}
			onSelectionChange={onSelectionChange}
			selectedKeys={selectedKeys}
		>
			<TableHeader>
				{headers.map((header) => (
					<TableColumn key={header.id} colSpan={header.colSpan}>
						{header.isPlaceholder
							? null
							: flexRender(header.column.columnDef.header, header.getContext())}
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
