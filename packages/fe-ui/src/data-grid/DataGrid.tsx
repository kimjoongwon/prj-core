"use client";

import type {
	DataGridConfig,
	DataGridState as DataGridControllerState,
} from "@cocrepo/type";
import {
	type ColumnDef,
	type ExpandedState,
	type GroupingState,
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useT } from "../i18n";
import { DataGridActionBar } from "./DataGridActionBar";
import { DataGridGroupPanel } from "./DataGridGroupPanel";
import { DataGridLoading } from "./DataGridLoading";
import { DataGridPagination } from "./DataGridPagination";
import { DataGridTable } from "./DataGridTable";
import { DataGridToolbar } from "./DataGridToolbar";
import {
	getGroupingColumnIds,
	getVisibleColumnConfigs,
	toColumnDefs,
} from "./internal/columnConfig";
import type { DataGridBodyRow } from "./internal/grouping";
import { getPageState } from "./internal/pagination";
import {
	createIdCounts,
	getDataGridRowKey,
	getVisibleRowKeys,
	type Key,
} from "./internal/rowKeys";
import {
	getControlledSelectedKeys,
	getNextRowSelectedKeys,
	getNextVisibleRowSelectedKeys,
	getSelectionMode,
} from "./internal/selection";
import {
	type DataGridSortDirection,
	getNextSortValues,
	getQuerySortValues,
} from "./internal/sorting";

export type { Key } from "./internal/rowKeys";
export { getDataGridRowKey } from "./internal/rowKeys";

export interface DataGridProps<T extends { id: Key }> {
	config: DataGridConfig<T>;
	state: DataGridControllerState;
	rows: T[];
	totalCount: number;
	isLoading?: boolean;
}

/** TanStack Table model을 native table 태그로 렌더링하는 DataGrid입니다. */
export const DataGrid = observer(
	<T extends { id: Key }>({
		config,
		state,
		rows,
		totalCount,
		isLoading = false,
	}: DataGridProps<T>) => {
		const t = useT();
		const [expanded, setExpanded] = useState<ExpandedState>({});
		const [localSelectedKeys, setLocalSelectedKeys] = useState<Set<string>>(
			() => new Set<string>(),
		);
		const visibleColumnConfigs = getVisibleColumnConfigs(
			config.columns,
			state.columns,
		);
		const columns = toColumnDefs(
			visibleColumnConfigs,
			state.columns,
		) as ColumnDef<T, unknown>[];
		const idCounts = createIdCounts(rows);
		const controlledSelectedKeys = getControlledSelectedKeys(state, config);
		const selectedKeySet = controlledSelectedKeys ?? localSelectedKeys;
		const selectionMode = getSelectionMode(config);
		const { take, currentPage } = getPageState(state);
		const sortValues = getQuerySortValues(state);
		const grouping = getGroupingColumnIds(
			visibleColumnConfigs,
			state.columns,
			state.query.values,
		) as GroupingState;
		const hasGrouping = grouping.length > 0;
		const table = useReactTable({
			data: rows,
			columns,
			getCoreRowModel: getCoreRowModel(),
			getGroupedRowModel: hasGrouping ? getGroupedRowModel() : undefined,
			getRowId: (row, index, parent) =>
				getDataGridRowKey(row, index, idCounts, parent?.id),
			getExpandedRowModel: getExpandedRowModel(),
			onExpandedChange: setExpanded,
			autoResetAll: false,
			autoResetExpanded: false,
			groupedColumnMode: hasGrouping ? false : undefined,
			state: {
				expanded,
				grouping,
			},
		});
		const headers = table.getHeaderGroups()[0]?.headers ?? [];
		const tableRows = table.getRowModel().rows;
		const bodyRows: DataGridBodyRow<T>[] = tableRows;
		const visibleRowKeys = getVisibleRowKeys(tableRows);
		const isAllVisibleRowsSelected =
			selectionMode === "multiple" &&
			visibleRowKeys.length > 0 &&
			visibleRowKeys.every((rowKey) => selectedKeySet.has(rowKey));
		const isSomeVisibleRowsSelected =
			selectionMode === "multiple" &&
			visibleRowKeys.some((rowKey) => selectedKeySet.has(rowKey));

		const handleSelectionChange = (nextKeys: Set<string>) => {
			if (!selectionMode) {
				return;
			}

			setLocalSelectedKeys(nextKeys);
			state.selection?.setSelectedKeys?.(nextKeys);
			config.selection?.onSelectionChange?.(nextKeys);
		};
		const handleVisibleSelectionChange = (isSelected: boolean) => {
			if (selectionMode !== "multiple") {
				return;
			}

			handleSelectionChange(
				getNextVisibleRowSelectedKeys(
					selectedKeySet,
					visibleRowKeys,
					isSelected,
				),
			);
		};
		const handleRowSelectionChange = (rowKey: string, isSelected: boolean) => {
			if (!selectionMode) {
				return;
			}

			handleSelectionChange(
				getNextRowSelectedKeys(
					selectedKeySet,
					rowKey,
					selectionMode,
					isSelected,
				),
			);
		};
		const handlePageChange = (page: number) => {
			const newSkip = (page - 1) * take;
			void state.query.setValues({ skip: newSkip });
		};
		const handleSortChange = (
			columnId: string,
			currentDirection: DataGridSortDirection,
		) => {
			void state.query.setValues({
				sort: getNextSortValues(columnId, currentDirection),
				skip: 0,
			});
		};

		return (
			<>
				<DataGridToolbar
					columns={config.columns}
					leftInputs={config.leftInputs ?? []}
					rightInputs={config.rightInputs ?? []}
					state={state}
				/>
				<DataGridGroupPanel
					columns={visibleColumnConfigs}
					grouping={grouping}
					rowGroupPanelShow={config.rowGroupPanelShow}
					state={state}
				/>

				{isLoading ? (
					<DataGridLoading />
				) : (
					<DataGridTable
						config={config}
						headers={headers}
						isAllVisibleRowsSelected={isAllVisibleRowsSelected}
						isSomeVisibleRowsSelected={isSomeVisibleRowsSelected}
						rows={bodyRows}
						selectedKeySet={selectedKeySet}
						selectionMode={selectionMode}
						sortValues={sortValues}
						state={state}
						t={t}
						onRowSelectionChange={handleRowSelectionChange}
						onSortChange={handleSortChange}
						onVisibleSelectionChange={handleVisibleSelectionChange}
					/>
				)}

				<DataGridPagination
					totalCount={totalCount}
					take={take}
					currentPage={currentPage}
					onPageChange={handlePageChange}
				/>

				<DataGridActionBar
					actionBarConfig={config.selection?.actionBar}
					selectedCount={selectionMode ? selectedKeySet.size : 0}
					state={state}
				/>
			</>
		);
	},
);
