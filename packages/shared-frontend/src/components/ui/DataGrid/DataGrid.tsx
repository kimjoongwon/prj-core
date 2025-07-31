import { Selection } from "@heroui/react";
import {
	ColumnDef,
	ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { action } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useState } from "react";
import { Table } from "../Table";
import { TableProps } from "../Table/Table";

export type Key = string | number;

type DataGridState = {
	selectedKeys: Key[] | null;
};

export type DataGridProps<T> = Omit<TableProps<T>, 'tableInstance'> & {
	state: DataGridState;
	columns: ColumnDef<T, any>[];
	data: (T & { id: Key })[];
};

export const DataGrid = observer(<T extends any>(props: DataGridProps<T>) => {
	const { data, columns, state, selectionMode, ...rest } = props;

	const [expanded, setExpanded] = useState<ExpandedState>({});

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

	const localState = useLocalObservable<{
		selection: Selection;
	}>(() => {
		return {
			selection: state.selectedKeys ? new Set(state.selectedKeys) : new Set(),
		};
	});

	const onSelectionChange = action((selection: Selection) => {
		localState.selection = selection;

		const allKeys = data.map((item) => item.id);
		let selectedKeys: Key[] = [];

		if (selection === "all") {
			selectedKeys = allKeys;
		} else {
			selectedKeys = Array.from(selection as Set<Key>);
		}

		if (selectionMode === "single") {
			state.selectedKeys = selectedKeys;
		} else {
			state.selectedKeys = selectedKeys;
		}
	});

	return (
		<Table
			{...rest}
			tableInstance={table}
			onSelectionChange={onSelectionChange}
			selectedKeys={localState.selection}
			selectionMode={selectionMode}
		/>
	);
});
