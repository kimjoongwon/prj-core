import { Selection } from "@heroui/react";
import {
	ColumnDef,
	ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Table, TableProps } from "../Table/Table";

export type Key = string | number;

type DataGridState = {
	selectedKeys: Key[] | null;
};

export type DataGridProps<T> = Omit<TableProps<T>, "tableInstance"> & {
	state: DataGridState;
	columns: ColumnDef<T, any>[];
	data: (T & { id: Key })[];
};

export const DataGrid = <T extends any>(props: DataGridProps<T>) => {
	const { data, columns, state, selectionMode, ...rest } = props;

	const [expanded, setExpanded] = useState<ExpandedState>({});
	const defaultSelection = state.selectedKeys
		? new Set(state.selectedKeys)
		: new Set<Key>();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSubRows: (row: any) => row?.children || [],
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
		<Table
			{...rest}
			tableInstance={table}
			onSelectionChange={onSelectionChange}
			selectedKeys={defaultSelection}
			selectionMode={selectionMode}
		/>
	);
};
