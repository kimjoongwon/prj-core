"use client";

import type { DataGridConfig } from "@cocrepo/type";
import {
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { DataGrid as DataGridRoot } from "./DataGrid";
import { DataGridChangesState } from "./DataGridChangesState";
import {
	DataGridColumnsState,
	DataGridQueryState,
	DataGridSelectionState,
	DataGridState,
	type DataGridStateOptions,
} from "./DataGridState";
import {
	getGroupingColumnIds,
	getVisibleColumnConfigs,
	toColumnDefs,
} from "./internal/columnConfig";
import { DATA_GRID_GROUP_BY_QUERY_KEY } from "./internal/grouping";
import type { Key } from "./internal/rowKeys";
import { getQuerySortValues, getNextSortValues } from "./internal/sorting";

export interface DataGridProps<T extends { id: Key }> {
	config: DataGridConfig<T>;
	state: DataGridState;
	rows: T[];
	totalCount: number;
	isLoading?: boolean;
}

type DataGridCompound = (<T extends { id: Key }>(
	props: DataGridProps<T>,
) => ReactNode) &
	Pick<
		typeof DataGridRoot,
		"Toolbar" | "Panel" | "Table" | "Pagination" | "ActionBar"
	>;

export const DataGrid = observer(
	<T extends { id: Key },>({
		config,
		state,
		rows,
		totalCount,
	}: DataGridProps<T>) => {
		const selectedKeys = Array.from(
			state.selection?.selectedKeys ?? state.selectedKeys,
		);
		const selectedKeySet = new Set(selectedKeys);
		const renderedRows = [
			...rows
				.filter((row) => !state.changes.isDeleted(row.id))
				.map((row) => state.changes.getRow(row)),
			...state.changes
				.getCreatedRows<T>()
				.filter((row) => !rows.some(({ id }) => id === row.id)),
		];
		const grouping = getGroupingColumnIds(
			config.columns,
			state.columns,
			state.query.values,
		);
		const table = useReactTable({
			data: renderedRows,
			columns: toColumnDefs(
				getVisibleColumnConfigs(config.columns, state.columns),
				state.columns,
			),
			state: {
				expanded: state.expanded,
				grouping,
			},
			getRowId: (row) => String(row.id),
			getSubRows: config.getSubRows,
			getCoreRowModel: getCoreRowModel(),
			getExpandedRowModel: getExpandedRowModel(),
			getGroupedRowModel: getGroupedRowModel(),
			onExpandedChange: state.setExpanded,
		});
		const tableRows = table.getRowModel().rows;
		const headers = table.getFlatHeaders();
		const selectionMode =
			config.selection?.mode === "none" ? undefined : config.selection?.mode;
		const isAllVisibleRowsSelected =
			tableRows.length > 0 &&
			tableRows.every((row) => selectedKeySet.has(row.id));
		const isSomeVisibleRowsSelected = tableRows.some((row) =>
			selectedKeySet.has(row.id),
		);
		const take = Number(state.query.values.take) || 20;
		const skip = Number(state.query.values.skip) || 0;

		const setSelectedKeys = (nextSelectedKeys: string[]) => {
			const nextSelection = new Set(nextSelectedKeys);
			state.setSelectedKeys(nextSelection);
			state.selection?.setSelectedKeys?.(nextSelection);
			config.selection?.onSelectionChange?.(nextSelection);
		};

		return (
			<DataGridRoot>
				<DataGridRoot.Toolbar
					columns={config.columns}
					leftInputs={config.leftInputs ?? []}
					rightInputs={config.rightInputs ?? []}
					columnState={state.columns.toJSON()}
					queryValues={state.query.values}
					onColumnChange={(columns) => state.columns.restore(columns)}
					onQueryChange={(values) => {
						void state.query.setValues(values);
					}}
				/>
				<DataGridRoot.Panel
					columns={config.columns}
					grouping={grouping}
					rowGroupPanelShow={config.rowGroupPanelShow}
					onGroupingChange={(nextGrouping) => {
						state.columns.setGrouping(nextGrouping);
						void state.query.setValues({
							[DATA_GRID_GROUP_BY_QUERY_KEY]: nextGrouping,
							skip: 0,
						});
					}}
				/>
				<DataGridRoot.Table
					ariaLabel="데이터 테이블"
					columnWidths={table
						.getVisibleLeafColumns()
						.map((column) => column.getSize())}
					isSelectable={Boolean(selectionMode)}
				>
					<DataGridRoot.Table.Header
						headers={headers}
						isAllVisibleRowsSelected={isAllVisibleRowsSelected}
						isSomeVisibleRowsSelected={isSomeVisibleRowsSelected}
						selectionMode={selectionMode}
						sortValues={getQuerySortValues(state.query.values)}
						queryValues={state.query.values}
						onQueryChange={(values) => {
							void state.query.setValues(values);
						}}
						onColumnSizingChange={(columnId, size) =>
							state.columns.setColumnSizing(columnId, size)
						}
						t={(value) => value}
						onSortChange={(columnId, direction) => {
							void state.query.setValues({
								sort: getNextSortValues(columnId, direction),
								skip: 0,
							});
						}}
						onVisibleSelectionChange={(isSelected) => {
							setSelectedKeys(
								isSelected
									? Array.from(
											new Set([
												...selectedKeys,
												...tableRows.map((row) => row.id),
											]),
										)
									: selectedKeys.filter(
											(key) => !tableRows.some((row) => row.id === key),
										),
							);
						}}
					/>
					<DataGridRoot.Table.Body
						config={config}
						rows={tableRows}
						selectedKeys={selectedKeys}
						selectionMode={selectionMode}
						tableColumnCount={headers.length + (selectionMode ? 1 : 0)}
						t={(value) => value}
						isRowMoveEnabled={false}
						onCellValueChange={(row, field, value) =>
							state.changes.setValue(row, field, value)
						}
						onRowSelectionChange={(rowKey, isSelected) => {
							setSelectedKeys(
								isSelected
									? [...selectedKeys, rowKey]
									: selectedKeys.filter((key) => key !== rowKey),
							);
						}}
					/>
				</DataGridRoot.Table>
				<DataGridRoot.Pagination
					currentPage={Math.floor(skip / take) + 1}
					take={take}
					totalCount={totalCount}
					onPageChange={(page) => {
						void state.query.setValues({ skip: (page - 1) * take });
					}}
				/>
				<DataGridRoot.ActionBar
					selectedCount={selectedKeys.length}
					showCount={config.selection?.actionBar?.showCount}
				/>
			</DataGridRoot>
		);
	},
) as unknown as DataGridCompound;

DataGrid.Toolbar = DataGridRoot.Toolbar;
DataGrid.Panel = DataGridRoot.Panel;
DataGrid.Table = DataGridRoot.Table;
DataGrid.Pagination = DataGridRoot.Pagination;
DataGrid.ActionBar = DataGridRoot.ActionBar;

export * from "./cell";
export * from "./columns";
export * from "./editor";
export type { Key } from "./internal/rowKeys";
export { getDataGridRowKey } from "./internal/rowKeys";
export { DataGridChangesState };
export type { DataGridStateOptions };
export {
	DataGridColumnsState,
	DataGridQueryState,
	DataGridSelectionState,
	DataGridState,
};
