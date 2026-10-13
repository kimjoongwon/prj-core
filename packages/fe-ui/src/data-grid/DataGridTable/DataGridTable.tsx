"use client";

import type {
	DataGridEditRequest,
	DataGridSelectionState,
	SelectionConfig,
} from "@cocrepo/type";
import {
	type ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	type Table,
	type TableOptions,
	useReactTable,
} from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { useId } from "react";
import type { DataGridRow, DataGridState } from "../DataGrid";
import { DataGridTableBody } from "../DataGridTableBody/DataGridTableBody";
import { DataGridTableContainer } from "../DataGridTableContainer/DataGridTableContainer";
import { DataGridTableHeader } from "../DataGridTableHeader/DataGridTableHeader";
import type { DataGridTableRowState } from "../DataGridTableRow/DataGridTableRow";
import { useHandlers } from "./useHandlers";

/** DataGridState.table의 컬럼과 외부 행 상호작용 설정입니다. */
export interface DataGridTableConfig<TData extends DataGridRow = DataGridRow> {
	columns: TableOptions<TData>["columns"];
	rows?: TData[];
	selection?: SelectionConfig;
	selectionSource?: DataGridSelectionState;
	getSubRows?: TableOptions<TData>["getSubRows"];
	row?: {
		onClick?: (row: TData) => void;
		editRequest?: DataGridEditRequest;
	};
}

/** TanStack 설정과 행 선택·펼침 데이터입니다. */
export interface DataGridTableState<TData extends DataGridRow = DataGridRow>
	extends DataGridTableConfig<TData> {
	rows: TData[];
	row: DataGridTableRowState<TData>;
	expandedRowIds: ExpandedState;
	selectedRowKeys: Set<string>;
	instance?: Table<TData>;
}

/** TanStack Table과 DataGrid의 table 영역을 렌더링합니다. */
export const DataGridTable = observer(
	<TData extends DataGridRow>({ state }: { state: DataGridState<TData> }) => {
		const selectionGroupName = useId();
		const handlers = useHandlers(state);
		const table = useReactTable({
			data: handlers.rowsWithChanges,
			columns: state.table.columns,
			state: {
				expanded: state.table.expandedRowIds,
				grouping: handlers.grouping,
				rowSelection: handlers.rowSelection,
				sorting: state.query.sort,
				pagination: handlers.pagination,
			},
			enableRowSelection: Boolean(
				state.table.selection && state.table.selection.mode !== "none",
			),
			enableMultiRowSelection: state.table.selection?.mode !== "single",
			getRowId: handlers.getRowId,
			getSubRows: state.table.getSubRows,
			getCoreRowModel: getCoreRowModel(),
			getExpandedRowModel: getExpandedRowModel(),
			getGroupedRowModel: getGroupedRowModel(),
			autoResetPageIndex: false,
			autoResetExpanded: false,
			onExpandedChange: handlers.changeExpandedRows,
			onRowSelectionChange: handlers.changeRowSelection,
			onGroupingChange: handlers.changeGrouping,
			onSortingChange: handlers.changeSorting,
			onPaginationChange: handlers.changeTablePagination,
		});
		state.table.instance = table;
		return (
			<DataGridTableContainer table={{ state: state.table, instance: table }}>
				<DataGridTableHeader state={state.table} table={table} />
				<DataGridTableBody
					state={state}
					table={table}
					rowState={state.table.row}
					selectionGroupName={selectionGroupName}
				/>
			</DataGridTableContainer>
		);
	},
);
