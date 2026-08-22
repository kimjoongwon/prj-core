"use client";

import type { DataGridConfig } from "@cocrepo/type";
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
	useReactTable,
} from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { DataGridActionBar } from "./DataGridActionBar";
import { DataGridContainer } from "./DataGridContainer";
import { DataGridGroupPanel } from "./DataGridGroupPanel";
import { DataGridPagination } from "./DataGridPagination";
import { DataGridToolbar } from "./DataGridToolbar";
import { TableBody } from "./Table/TableBody";
import { TableContainer } from "./Table/TableContainer";
import { TableFooter } from "./Table/TableFooter";
import { TableHeader } from "./Table/TableHeader";
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
	DataGridTableFooterState,
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
import type { Key } from "./Table/rowKeys";

export interface DataGridProps<T extends { id: Key }> {
	config: DataGridConfig<T>;
	state: DataGridState;
	rows: T[];
	totalCount: number;
	isLoading?: boolean;
}

function DataGridTableContent({ state }: { state: DataGridState }) {
	const tableColumnStateKey = JSON.stringify(state.columns.toJSON());

	return (
		<TableContainer
			ariaLabel="데이터 테이블"
			columnWidths={state.table.columnWidths}
			isSelectable={state.table.isSelectable}
		>
			<TableHeader
				key={`header-${tableColumnStateKey}`}
				state={state.table.header}
			/>
			<TableBody key={`body-${tableColumnStateKey}`} state={state.table.body} />
			<TableFooter state={state.table.footer} />
		</TableContainer>
	);
}

function DataGridRowMoveTableComposition({ state }: { state: DataGridState }) {
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
					state.table.body.completeRowMove(String(active.id), String(over.id));
				}
			}}
		>
			<DataGridTableContent state={state} />
		</DndContext>
	);
}

function DataGridTableComposition({ state }: { state: DataGridState }) {
	return state.table.body.config.onRowMove ? (
		<DataGridRowMoveTableComposition state={state} />
	) : (
		<DataGridTableContent state={state} />
	);
}

/** 완성형 API가 표준 compound 조립과 같은 root state를 사용하도록 연결합니다. */
const DataGridStandardComposition = observer(
	function DataGridStandardComposition<T extends { id: Key }>({
		config,
		state,
		rows,
		totalCount,
		isLoading = false,
	}: DataGridProps<T>) {
		state.syncRuntime({ config, rows, totalCount, isLoading });
		const renderedRows = state.getRenderedRows<T>(rows);
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
			state: { expanded: state.expanded, grouping },
			getRowId: (row) => String(row.id),
			getSubRows: config.getSubRows,
			getCoreRowModel: getCoreRowModel(),
			getExpandedRowModel: getExpandedRowModel(),
			getGroupedRowModel: getGroupedRowModel(),
			autoResetExpanded: false,
			onExpandedChange: state.setExpanded,
		});
		state.table.setTanStackTable(table);

		return (
			<DataGridContainer>
				<DataGridToolbar state={state.toolbar} />
				<DataGridGroupPanel state={state.groupPanel} />
				<DataGridTableComposition state={state} />
				<DataGridPagination state={state.pagination} />
				<DataGridActionBar state={state.actionBar} />
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
});

/** DataGrid와 독립된 native table compound namespace입니다. */
export const Table = {
	Container: TableContainer,
	Header: TableHeader,
	Body: TableBody,
	Footer: TableFooter,
};

export * from "./cell";
export * from "./columns";
export type { Key } from "./Table/rowKeys";
export { getDataGridRowKey } from "./Table/rowKeys";
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
	DataGridTableFooterState,
	DataGridTableHeaderState,
	DataGridTableState,
	DataGridToolbarState,
};
