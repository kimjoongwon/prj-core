"use client";

import type {
	DataGridConfig,
	DataGridState as DataGridControllerState,
	DataGridRowData,
} from "@cocrepo/type";
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	type DragMoveEvent,
	type DragOverEvent,
	type DragStartEvent,
	KeyboardSensor,
	MeasuringStrategy,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
	type ColumnDef,
	type ExpandedState,
	type GroupingState,
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	type Row,
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
	type DataGridMoveItem,
	getDataGridRowMoveEvent,
	getDataGridRowMoveProjection,
	removeDataGridRowDescendants,
} from "./internal/rowMove";
import { getDataGridRows, getDataGridSubRows } from "./internal/rows";
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

const ROW_MOVE_MEASURING = {
	droppable: {
		strategy: MeasuringStrategy.Always,
	},
};

export type { Key } from "./internal/rowKeys";
export { getDataGridRowKey } from "./internal/rowKeys";

export interface DataGridProps<T extends { id: Key }> {
	config: DataGridConfig<T>;
	state: DataGridControllerState;
	rows: T[];
	totalCount: number;
	isLoading?: boolean;
}

function toMoveItems<T extends DataGridRowData>(
	rows: Row<T>[],
): DataGridMoveItem<T>[] {
	return rows.map((row) => ({
		id: row.id,
		parentId: row.parentId ?? null,
		depth: row.depth,
		original: row.original,
	}));
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
		const [activeRowId, setActiveRowId] = useState<string | null>(null);
		const [overRowId, setOverRowId] = useState<string | null>(null);
		const [dragOffset, setDragOffset] = useState(0);
		const sensors = useSensors(
			useSensor(PointerSensor, {
				activationConstraint: { distance: 4 },
			}),
			useSensor(KeyboardSensor, {
				coordinateGetter: sortableKeyboardCoordinates,
			}),
		);
		const visibleColumnConfigs = getVisibleColumnConfigs(
			config.columns,
			state.columns,
		);
		const columns = toColumnDefs(
			visibleColumnConfigs,
			state.columns,
		) as ColumnDef<T, unknown>[];
		const dataRows = getDataGridRows(rows, state.changes, config.getSubRows);
		const idCounts = createIdCounts(dataRows);
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
		const isRowMoveEnabled = Boolean(config.onRowMove) && !hasGrouping;
		const table = useReactTable({
			data: dataRows,
			columns,
			getCoreRowModel: getCoreRowModel(),
			getGroupedRowModel: hasGrouping ? getGroupedRowModel() : undefined,
			getRowId: (row, index, parent) =>
				getDataGridRowKey(row, index, idCounts, parent?.id),
			getSubRows: config.getSubRows
				? (row, index) =>
						getDataGridSubRows(
							row,
							index,
							config.getSubRows as (row: T, index: number) => T[] | undefined,
							state.changes,
						)
				: undefined,
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
		const visibleMoveItems = toMoveItems(tableRows);
		const movableItems =
			activeRowId && isRowMoveEnabled
				? removeDataGridRowDescendants(visibleMoveItems, activeRowId)
				: visibleMoveItems;
		const movableIds = new Set(movableItems.map((item) => item.id));
		const bodyRows: DataGridBodyRow<T>[] =
			activeRowId && isRowMoveEnabled
				? tableRows.filter(
						(row) => row.getIsGrouped() || movableIds.has(row.id),
					)
				: tableRows;
		const projection =
			isRowMoveEnabled && activeRowId && overRowId
				? getDataGridRowMoveProjection(
						visibleMoveItems,
						activeRowId,
						overRowId,
						dragOffset,
					)
				: null;
		const visibleRowKeys = getVisibleRowKeys(bodyRows);
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
		const resetRowMove = () => {
			setActiveRowId(null);
			setOverRowId(null);
			setDragOffset(0);
		};
		const handleDragStart = (event: DragStartEvent) => {
			const rowId = String(event.active.id);
			setActiveRowId(rowId);
			setOverRowId(rowId);
			setDragOffset(0);
		};
		const handleDragMove = (event: DragMoveEvent) => {
			setDragOffset(event.delta.x);
		};
		const handleDragOver = (event: DragOverEvent) => {
			setOverRowId(event.over ? String(event.over.id) : null);
		};
		const handleDragEnd = (event: DragEndEvent) => {
			const finalActiveId = String(event.active.id);
			const finalOverId = event.over ? String(event.over.id) : null;

			if (finalOverId) {
				const finalProjection = getDataGridRowMoveProjection(
					visibleMoveItems,
					finalActiveId,
					finalOverId,
					event.delta.x,
				);

				if (finalProjection) {
					const moveEvent = getDataGridRowMoveEvent(
						toMoveItems(table.getCoreRowModel().flatRows),
						finalActiveId,
						finalOverId,
						finalProjection,
					);

					if (moveEvent) {
						config.onRowMove?.(moveEvent);
					}
				}
			}

			resetRowMove();
		};

		const tableContent = isLoading ? (
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
				isRowMoveEnabled={isRowMoveEnabled}
				activeRowId={activeRowId}
				projectedDepth={projection?.depth}
				onRowSelectionChange={handleRowSelectionChange}
				onSortChange={handleSortChange}
				onVisibleSelectionChange={handleVisibleSelectionChange}
			/>
		);

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

				{isRowMoveEnabled && !isLoading ? (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						measuring={ROW_MOVE_MEASURING}
						onDragStart={handleDragStart}
						onDragMove={handleDragMove}
						onDragOver={handleDragOver}
						onDragEnd={handleDragEnd}
						onDragCancel={resetRowMove}
					>
						{tableContent}
					</DndContext>
				) : (
					tableContent
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
