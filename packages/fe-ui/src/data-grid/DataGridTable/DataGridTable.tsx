"use client";

import type { DataGridEditRequest, SelectionConfig } from "@cocrepo/type";
import {
	type ExpandedState,
	type GroupingState,
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	type SortingState,
	type TableOptions,
	type Updater,
	useReactTable,
} from "@tanstack/react-table";
import { makeAutoObservable, observable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useId } from "react";
import type { DataGridState, Key } from "../DataGrid";
import { DataGridTableBody } from "../DataGridTableBody/DataGridTableBody";
import { DataGridTableContainer } from "../DataGridTableContainer/DataGridTableContainer";
import {
	DataGridTableHeader,
	DataGridTableHeaderState,
} from "../DataGridTableHeader/DataGridTableHeader";
import { DataGridTableRowState } from "../DataGridTableRow/DataGridTableRow";

type DataGridRow = { id: Key };
type DataGridColumns<TData extends DataGridRow> = NonNullable<
	TableOptions<TData>["columns"]
>;

/** DataGrid의 TanStack Table 설정과 행 상호작용 상태를 구성합니다. */
export class DataGridTableState<TData extends DataGridRow = DataGridRow> {
	expandedRowIds: ExpandedState = {};
	selectedRowKeys = new Set<string>();
	columns: DataGridColumns<TData>;
	selection?: SelectionConfig;
	onRowClick?: (row: TData) => void;
	getSubRows?: TableOptions<TData>["getSubRows"];
	editRequest?: DataGridEditRequest;
	header: DataGridTableHeaderState<TData>;

	constructor(
		readonly state: DataGridState<TData>,
		columns: DataGridColumns<TData>,
		header: DataGridTableHeaderState<TData>,
		selection?: SelectionConfig,
		onRowClick?: (row: TData) => void,
		getSubRows?: TableOptions<TData>["getSubRows"],
		editRequest?: DataGridEditRequest,
	) {
		this.columns = columns;
		this.selection = selection;
		this.onRowClick = onRowClick;
		this.getSubRows = getSubRows;
		this.editRequest = editRequest;
		makeAutoObservable(this, undefined, { autoBind: true });
		this.header = header;
	}

	/** TanStack Table의 확장 상태 변경을 반영합니다. */
	changeExpandedRows(nextExpanded: Updater<ExpandedState>) {
		this.expandedRowIds =
			typeof nextExpanded === "function"
				? nextExpanded(this.expandedRowIds)
				: nextExpanded;
	}

	/** 정렬 변경을 query에 기록하고 첫 페이지부터 다시 조회하도록 합니다. */
	changeSorting(nextSorting: Updater<SortingState>) {
		const currentSorting = this.state.query.sort;
		const updatedSorting =
			typeof nextSorting === "function"
				? nextSorting(currentSorting)
				: nextSorting;
		void this.state.querySetter({
			sort:
				updatedSorting.length === 0
					? null
					: this.state.query.getSortQueryValues(updatedSorting),
			skip: 0,
		});
	}

	/** 지정한 행이 확장 상태가 되도록 설정합니다. */
	ensureRowExpanded(rowId: Key) {
		if (this.expandedRowIds === true) return;
		this.expandedRowIds = {
			...this.expandedRowIds,
			[String(rowId)]: true,
		};
	}

	/** 선택된 행 키 집합을 갱신합니다. */
	setSelectedRowKeys(selectedRowKeys: Set<string>) {
		this.selectedRowKeys = selectedRowKeys;
	}

	/** query의 groupBy 값을 TanStack Table grouping 상태로 반환합니다. */
	getGrouping(): GroupingState {
		const queryFilters = this.state.query.filters;
		if (Object.hasOwn(queryFilters, "groupBy")) {
			const queryGrouping = queryFilters.groupBy;
			return Array.isArray(queryGrouping)
				? queryGrouping.filter(
						(columnId): columnId is string => typeof columnId === "string",
					)
				: [];
		}
		return [];
	}
}

/** TanStack Table과 DataGrid의 table 영역을 렌더링합니다. */
export const DataGridTable = observer(
	<TData extends DataGridRow>({ state }: { state: DataGridState<TData> }) => {
		const selectionGroupName = useId();
		const rowState = useLocalObservable(() => new DataGridTableRowState());
		const rowsWithChanges = state.combineRowsWithChanges(state.rows);
		const table = useReactTable({
			data: rowsWithChanges,
			columns: state.table.columns,
			state: {
				expanded: state.table.expandedRowIds,
				grouping: state.table.getGrouping(),
				sorting: state.query.sort,
				pagination: state.pagination?.toTablePaginationState(),
			},
			getRowId: (row) => String(row.id),
			getSubRows: state.table.getSubRows,
			getCoreRowModel: getCoreRowModel(),
			getExpandedRowModel: getExpandedRowModel(),
			getGroupedRowModel: getGroupedRowModel(),
			autoResetPageIndex: false,
			autoResetExpanded: false,
			onExpandedChange: state.table.changeExpandedRows,
			onGroupingChange: state.groupPanel?.changeGrouping,
			onSortingChange: state.table.changeSorting,
			onPaginationChange: state.pagination?.changeTablePagination,
		});

		return (
			<DataGridTableContainer table={{ state: state.table, instance: table }}>
				<DataGridTableHeader state={state.table.header} table={table} />
				<DataGridTableBody
					state={state}
					table={table}
					rowState={rowState}
					selectionGroupName={selectionGroupName}
				/>
			</DataGridTableContainer>
		);
	},
);
