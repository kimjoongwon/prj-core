"use client";

import type { DataGridConfig, DataGridTableConfig } from "@cocrepo/type";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	type Table as TanStackTable,
	useReactTable,
} from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { DataGridActionBar } from "./DataGridActionBar";
import { DataGridContainer } from "./DataGridContainer";
import { DataGridGroupPanel } from "./DataGridGroupPanel";
import { DataGridLoading } from "./DataGridLoading";
import { DataGridPagination } from "./DataGridPagination";
import { DataGridToolbar } from "./DataGridToolbar";
import { Table, TableBody, TableContainer, TableHeader } from "./Table";
import { DataGridChangesState } from "./state/DataGridChangesState";
import {
	DataGridActionBarState,
	DataGridColumnsState,
	DataGridGroupPanelState,
	DataGridPaginationState,
	DataGridQueryState,
	DataGridSelectionState,
	DataGridState,
	DataGridTableBodyState,
	DataGridTableHeaderState,
	DataGridTableState,
	DataGridToolbarState,
	type DataGridStateOptions,
} from "./state/DataGridState";
import {
	getGroupingColumnIds,
	getVisibleColumnConfigs,
	toColumnDefs,
} from "./columns/columnConfig";
import { createDataGridRowKeyAdapter, type Key } from "./Table/rowKeys";

export interface DataGridProps<T extends { id: Key }> {
	config: DataGridConfig<T>;
	state: DataGridState;
	rows: T[];
	totalCount: number;
	isLoading?: boolean;
}

function DataGridTableContent<T extends { id: Key }>({
	config,
	state,
	table,
}: {
	config: DataGridTableConfig<T>;
	state: DataGridState;
	table: TanStackTable<T>;
}) {
	const tableColumnStateKey = JSON.stringify(state.columns.toJSON());
	const headers = table.getFlatHeaders();
	const rows = table.getRowModel().rows;
	const visibleRowKeys = table.getCoreRowModel().rows.map((row) => row.id);
	const selectionMode =
		config.selection?.mode === "none" ? undefined : config.selection?.mode;
	const tableColumnCount = headers.length + (selectionMode ? 1 : 0);

	return (
		<TableContainer
			ariaLabel="데이터 테이블"
			columnWidths={table
				.getVisibleLeafColumns()
				.map((column) => column.getSize())}
			isSelectable={Boolean(selectionMode)}
		>
			<TableHeader
				key={`header-${tableColumnStateKey}`}
				state={state.table.header}
				config={config}
				headers={headers}
				visibleRowKeys={visibleRowKeys}
			/>
			<TableBody
				key={`body-${tableColumnStateKey}`}
				state={state.table.body}
				config={config}
				rows={rows}
				selectionMode={selectionMode}
				tableColumnCount={tableColumnCount}
			/>
		</TableContainer>
	);
}

function DataGridRowMoveTableComposition<T extends { id: Key }>({
	config,
	state,
	table,
}: {
	config: DataGridTableConfig<T>;
	state: DataGridState;
	table: TanStackTable<T>;
}) {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor),
	);

	return (
		<DndContext
			collisionDetection={closestCenter}
			sensors={sensors}
			onDragEnd={({ active, over }) => {
				if (over) {
					state.table.body.completeRowMove(
						table.getRowModel().rows,
						String(active.id),
						String(over.id),
						config.onRowMove,
					);
				}
			}}
		>
			<DataGridTableContent config={config} state={state} table={table} />
		</DndContext>
	);
}

function DataGridTableComposition<T extends { id: Key }>({
	config,
	state,
	table,
}: {
	config: DataGridTableConfig<T>;
	state: DataGridState;
	table: TanStackTable<T>;
}) {
	return config.onRowMove ? (
		<DataGridRowMoveTableComposition
			config={config}
			state={state}
			table={table}
		/>
	) : (
		<DataGridTableContent config={config} state={state} table={table} />
	);
}

/** 완성형 API가 표준 compound 조립과 같은 root state를 사용하도록 연결합니다. */
const DataGridStandardComposition = observer(
	function DataGridStandardComposition<T extends { id: Key }>({
		config,
		state,
		rows,
		totalCount,
		isLoading,
	}: DataGridProps<T>) {
		const tableConfig = config.table;
		const renderedRows = state.getRenderedRows<T>(rows);
		const grouping = getGroupingColumnIds(
			tableConfig.columns,
			state.columns,
			state.query.values,
		);
		const getRowId = createDataGridRowKeyAdapter(renderedRows);
		const table = useReactTable({
			data: renderedRows,
			columns: toColumnDefs(
				getVisibleColumnConfigs(tableConfig.columns, state.columns),
				state.columns,
			),
			state: { expanded: state.expanded, grouping },
			getRowId,
			getSubRows: tableConfig.getSubRows,
			getCoreRowModel: getCoreRowModel(),
			getExpandedRowModel: getExpandedRowModel(),
			getGroupedRowModel: getGroupedRowModel(),
			autoResetExpanded: false,
			onExpandedChange: state.setExpanded,
		});

		if (isLoading) {
			return (
				<DataGridContainer>
					<DataGridLoading />
				</DataGridContainer>
			);
		}

		return (
			<DataGridContainer>
				<DataGridToolbar
					columns={tableConfig.columns}
					config={config.toolbar}
					state={state.toolbar}
				/>
				<DataGridGroupPanel
					columns={tableConfig.columns}
					config={config.groupPanel}
					state={state.groupPanel}
				/>
				<DataGridTableComposition
					config={tableConfig}
					state={state}
					table={table}
				/>
				<DataGridPagination state={state.pagination} totalCount={totalCount} />
				<DataGridActionBar
					state={state.actionBar}
					showCount={tableConfig.selection?.actionBar?.showCount}
				/>
			</DataGridContainer>
		);
	},
);

export const DataGrid = Object.assign(DataGridStandardComposition, {
	Container: DataGridContainer,
	Toolbar: DataGridToolbar,
	GroupPanel: DataGridGroupPanel,
	Pagination: DataGridPagination,
	ActionBar: DataGridActionBar,
	Loading: DataGridLoading,
});

export { Table };

export * from "./cell";
export * from "./columns";
export type { Key } from "./Table/rowKeys";
export {
	createDataGridRowKeyAdapter,
	getDataGridRowKey,
} from "./Table/rowKeys";
export { DataGridChangesState };
export type { DataGridStateOptions };
export {
	DataGridActionBarState,
	DataGridColumnsState,
	DataGridGroupPanelState,
	DataGridPaginationState,
	DataGridQueryState,
	DataGridSelectionState,
	DataGridState,
	DataGridTableBodyState,
	DataGridTableHeaderState,
	DataGridTableState,
	DataGridToolbarState,
};
