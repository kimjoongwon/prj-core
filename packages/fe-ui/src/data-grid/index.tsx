"use client";

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
	type SortingState,
	type Updater,
	useReactTable,
} from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
	getColumnSettingItems,
	getGroupableColumnItems,
	toColumnDefs,
} from "./columns/columnConfig";
import { DataGridActionBar } from "./DataGridActionBar";
import { DataGridContainer } from "./DataGridContainer";
import { DataGridGroupPanel } from "./DataGridGroupPanel";
import { DataGridPagination } from "./DataGridPagination";
import { DataGridToolbar } from "./DataGridToolbar";
import { DataGridChangesState } from "./state/DataGridChangesState";
import {
	DataGridActionBarState,
	DataGridGroupPanelState,
	DataGridPaginationState,
	DataGridSelectionState,
	DataGridState,
	DataGridTableBodyState,
	DataGridTableHeaderState,
	DataGridTableState,
	DataGridToolbarState,
} from "./state/DataGridState";
import { getQuerySortValue, getTableSortingState } from "./state/sorting";
import { Table, TableBody, TableContainer, TableHeader } from "./Table";
import { createDataGridRowKeyAdapter, type Key } from "./Table/rowKeys";

export const DataGrid = observer(function DataGrid({
	state,
}: {
	state: DataGridState;
}) {
	const renderedRows = state.getRenderedRows<{ id: Key }>(
		state.rows as { id: Key }[],
	);
	useEffect(() => {
		state.table.applyExpansionRequest(state.table.expandRequest);
	}, [state, state.table.expandRequest?.requestId]);
	const grouping = state.table.getGroupingState();
	const sorting = getTableSortingState(state.queryStates);
	const pagination = state.pagination.toTablePaginationState();
	const settingsColumns = getColumnSettingItems(state.table.columns);
	const groupableColumns = getGroupableColumnItems(state.table.columns);
	const getRowId = createDataGridRowKeyAdapter(renderedRows);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor),
	);
	const table = useReactTable({
		data: renderedRows,
		columns: toColumnDefs<{ id: Key }>(state.table.columns),
		state: { expanded: state.table.expanded, grouping, sorting, pagination },
		getRowId,
		getSubRows: state.table.getSubRows,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		// 페이지 초기화는 nuqs query가 소유하므로 행 재계산으로 내부 페이지 갱신을 예약하지 않습니다.
		autoResetPageIndex: false,
		autoResetExpanded: false,
		onExpandedChange: state.table.setExpanded,
		onGroupingChange: (nextGrouping) =>
			state.groupPanel.changeGrouping(
				typeof nextGrouping === "function"
					? nextGrouping(grouping)
					: nextGrouping,
			),
		onSortingChange: (nextSorting: Updater<SortingState>) => {
			const updatedSorting =
				typeof nextSorting === "function" ? nextSorting(sorting) : nextSorting;
			void state.querySetter({
				sort: getQuerySortValue(updatedSorting),
				skip: 0,
			});
		},
		onPaginationChange: state.pagination.changeTablePagination,
	});
	const headers = table
		.getFlatHeaders()
		.filter((header) => header.column.getIsVisible());
	const rows = table.getRowModel().rows;
	const visibleRowKeys = table.getCoreRowModel().rows.map((row) => row.id);
	const selectionMode =
		state.table.selection?.mode === "none"
			? undefined
			: state.table.selection?.mode;
	const tableColumnCount = headers.length + (selectionMode ? 1 : 0);
	const tableContent = (
		<TableContainer
			ariaLabel="데이터 테이블"
			columnWidths={table
				.getVisibleLeafColumns()
				.map((column) => column.getSize())}
			isSelectable={Boolean(selectionMode)}
		>
			<TableHeader
				state={state.table.header}
				headers={headers}
				visibleRowKeys={visibleRowKeys}
				onColumnSizingChange={(columnId, size) => {
					const column = table.getColumn(columnId);
					if (size == null) {
						column?.resetSize();
						return;
					}
					table.setColumnSizing((currentSizing) => ({
						...currentSizing,
						[columnId]: size,
					}));
				}}
			/>
			<TableBody
				state={state.table.body}
				config={state.table}
				rows={rows}
				selectionMode={selectionMode}
				tableColumnCount={tableColumnCount}
			/>
		</TableContainer>
	);
	const tableRegion = state.table.onRowMove ? (
		<DndContext
			collisionDetection={closestCenter}
			sensors={sensors}
			onDragEnd={({ active, over }) => {
				if (over) {
					state.table.body.completeRowMove(
						table.getRowModel().rows,
						String(active.id),
						String(over.id),
						state.table.onRowMove,
					);
				}
			}}
		>
			{tableContent}
		</DndContext>
	) : (
		tableContent
	);

	return (
		<DataGridContainer>
			<DataGridToolbar
				leftInputs={state.toolbar.leftInputs}
				rightInputs={state.toolbar.rightInputs}
				settingsColumns={settingsColumns}
				table={table}
				state={state.toolbar}
			/>
			<DataGridGroupPanel
				groupableColumns={groupableColumns}
				grouping={grouping}
				show={state.groupPanel.show}
				state={state.groupPanel}
			/>
			{tableRegion}
			<DataGridPagination state={state.pagination} table={table} />
			<DataGridActionBar
				state={state.actionBar}
				showCount={state.table.selection?.actionBar?.showCount}
			/>
		</DataGridContainer>
	);
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
export {
	DataGridActionBarState,
	DataGridGroupPanelState,
	DataGridPaginationState,
	DataGridSelectionState,
	DataGridState,
	DataGridTableBodyState,
	DataGridTableHeaderState,
	DataGridTableState,
	DataGridToolbarState,
};
