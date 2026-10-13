"use client";

import type {
	DataGridGroupPanelConfig,
	DataGridSetQueryStates,
	DataGridToolbarConfig,
} from "@cocrepo/type";
import type { SortingState } from "@tanstack/react-table";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	DataGridActionBar,
	type DataGridActionBarState,
} from "./DataGridActionBar/DataGridActionBar";
import { DataGridContainer } from "./DataGridContainer";
import {
	DataGridGroupPanel,
	type DataGridGroupPanelState,
} from "./DataGridGroupPanel/DataGridGroupPanel";
import {
	DataGridPagination,
	type DataGridPaginationState,
} from "./DataGridPagination/DataGridPagination";
import {
	DataGridTable,
	type DataGridTableConfig,
	type DataGridTableState,
} from "./DataGridTable/DataGridTable";
import type { DataGridTableRowState } from "./DataGridTableRow/DataGridTableRow";
import {
	DataGridToolbar,
	type DataGridToolbarState,
} from "./DataGridToolbar/DataGridToolbar";
import { parseQuery } from "./useHandlers";

/** query에 take 값이 없을 때 사용하는 기본 페이지 크기입니다. */
export const DATA_GRID_DEFAULT_PAGE_SIZE = 20;
export type Key = string | number | bigint;
export type DataGridRow = { id: Key };

/** nuqs의 원본 query를 해석한 필터·정렬·페이지 데이터입니다. */
export interface DataGridQueryState {
	filters: { [x: string]: unknown };
	sort: SortingState;
	pagination: { take: number; skip: number };
}

/** createDataGridState가 조립에 사용하는 DataGrid 전체 설정입니다. */
export interface DataGridStateConfig<TData extends DataGridRow = DataGridRow> {
	query?: { [x: string]: unknown };
	setQueryStates: DataGridSetQueryStates;
	pagination?: { totalCount?: number };
	actionBar?: { showCount?: boolean; actions?: ReactNode };
	toolbar?: DataGridToolbarConfig;
	groupPanel?: DataGridGroupPanelConfig;
	table?: DataGridTableConfig<TData>;
}

/** DataGrid의 데이터와 외부 주입 설정만 보유합니다. */
export interface DataGridState<TData extends DataGridRow = DataGridRow> {
	query: DataGridQueryState;
	querySetter: DataGridSetQueryStates;
	created: TData[];
	updated: Array<{ id: Key; changes: Partial<TData> }>;
	deleted: Key[];
	originalValues: Map<Key, Record<string, unknown>>;
	toolbar: DataGridToolbarState;
	groupPanel: DataGridGroupPanelState<TData>;
	table: DataGridTableState<TData>;
	pagination: DataGridPaginationState;
	actionBar: DataGridActionBarState<TData>;
}

/** 전체 상태를 조립하는 위치에서 각 데이터 객체를 observable로 초기화합니다. */
export function createDataGridState<TData extends DataGridRow = DataGridRow>({
	query: initialQuery,
	setQueryStates,
	pagination,
	actionBar,
	toolbar,
	groupPanel,
	table,
}: DataGridStateConfig<TData>): DataGridState<TData> {
	const query = observable<DataGridQueryState>(
		parseQuery(initialQuery),
		undefined,
		{ name: "DataGridQueryState" },
	);
	const tableState = observable<DataGridTableState<TData>>(
		{
			expandedRowIds: {},
			selectedRowKeys: new Set<string>(),
			rows: table?.rows ?? [],
			columns: table?.columns ?? [],
			selection: table?.selection,
			selectionSource: table?.selectionSource,
			getSubRows: table?.getSubRows,
			row: observable<DataGridTableRowState<TData>>(
				{
					editingCell: null,
					editRequest: table?.row?.editRequest,
					onClick: table?.row?.onClick,
				},
				{
					editingCell: observable.ref,
					editRequest: observable.ref,
					onClick: false,
				},
				{ name: "DataGridTableRowState" },
			),
			// TanStack 인스턴스는 라이브러리에서 관리하므로 observable 변환에서 제외합니다.
			instance: undefined,
		},
		{
			columns: observable.ref,
			selection: false,
			selectionSource: observable.ref,
			getSubRows: false,
			row: false,
			instance: false,
		},
		{ name: "DataGridTableState" },
	);
	return observable<DataGridState<TData>>(
		{
			query,
			querySetter: setQueryStates,
			created: [],
			updated: [],
			deleted: [],
			// handler를 여러 곳에서 사용해도 원본값을 공유하며 렌더 관찰에서는 제외합니다.
			originalValues: new Map<Key, Record<string, unknown>>(),
			table: tableState,
			toolbar: observable<DataGridToolbarState>(
				{
					query,
					querySetter: setQueryStates,
					leftInputs: toolbar?.leftInputs ?? [],
					rightInputs: toolbar?.rightInputs ?? [],
				},
				{
					query: false,
					querySetter: false,
					leftInputs: false,
					rightInputs: false,
				},
				{ name: "DataGridToolbarState" },
			),
			groupPanel: observable<DataGridGroupPanelState<TData>>(
				{
					query,
					querySetter: setQueryStates,
					table: tableState,
					show: groupPanel?.show,
				},
				{ query: false, querySetter: false, table: false, show: false },
				{ name: "DataGridGroupPanelState" },
			),
			pagination: observable<DataGridPaginationState>(
				{
					query,
					querySetter: setQueryStates,
					totalCount: pagination?.totalCount ?? 0,
				},
				{ query: false, querySetter: false },
				{ name: "DataGridPaginationState" },
			),
			actionBar: observable<DataGridActionBarState<TData>>(
				{
					table: tableState,
					showCount: actionBar?.showCount ?? true,
					actions: actionBar?.actions,
				},
				{ table: false, actions: observable.ref },
				{ name: "DataGridActionBarState" },
			),
		},
		{
			querySetter: false,
			originalValues: false,
			table: false,
			toolbar: false,
			groupPanel: false,
			pagination: false,
			actionBar: false,
		},
		{ name: "DataGridState" },
	);
}

/** DataGridState의 데이터와 영역 설정을 렌더링합니다. */
export function DataGrid<TData extends DataGridRow>({
	state,
}: {
	state: DataGridState<TData>;
}) {
	return (
		<DataGridContainer>
			<DataGridToolbar state={state.toolbar} />
			<DataGridGroupPanel state={state.groupPanel} />
			<DataGridTable state={state} />
			<DataGridPagination state={state.pagination} />
			<DataGridActionBar state={state.actionBar} />
		</DataGridContainer>
	);
}
export default observer(DataGrid);
