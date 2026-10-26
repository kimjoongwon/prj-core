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

/** state를 바꾸지 않고 렌더링에만 적용하는 Table 입력입니다. 지정하지 않은 값은 state.table 설정을 사용합니다. */
export interface DataGridTableDisplayConfig<
	TData extends DataGridRow = DataGridRow,
> {
	rows?: TData[];
	columns?: TableOptions<TData>["columns"];
	getSubRows?: TableOptions<TData>["getSubRows"];
	getRowsWithChanges?: (
		state: DataGridState<TData>,
		sourceRows: TData[],
	) => TData[];
}

/** TanStack 설정과 행 선택·펼침 데이터입니다. */
export interface DataGridTableState<TData extends DataGridRow = DataGridRow>
	extends DataGridTableConfig<TData> {
	rows: TData[];
	row: DataGridTableRowState<TData>;
	expandedRowIds: ExpandedState;
	selectedRowKeys: Set<string>;
}

/** TanStack Table과 DataGrid의 table 영역을 렌더링합니다. */
export const DataGridTable = observer(
	<TData extends DataGridRow>({
		state,
		table: displayTable,
	}: {
		state: DataGridState<TData>;
		table?: DataGridTableDisplayConfig<TData>;
	}) => {
		const selectionGroupName = useId();
		const handlers = useHandlers(state);
		const sourceRows = displayTable?.rows ?? state.table.rows;
		const columns = displayTable?.columns ?? state.table.columns;
		const getSubRows = displayTable?.getSubRows ?? state.table.getSubRows;
		const table = useReactTable({
			data: handlers.getRowsWithChanges(
				sourceRows,
				displayTable?.getRowsWithChanges,
			),
			columns,
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
			getSubRows,
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
