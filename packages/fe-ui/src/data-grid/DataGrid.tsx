"use client";

import type {
	DataGridEditRequest,
	DataGridExpandRequest,
	DataGridQueryStates,
	DataGridRowMoveEvent,
	DataGridSelectionState,
	DataGridSetQueryStates,
	SelectionConfig,
} from "@cocrepo/type";
import type { DragEndEvent } from "@dnd-kit/core";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
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
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
	DataGridActionBar,
	DataGridActionBarState,
} from "./DataGridActionBar/DataGridActionBar";
import { DataGridContainer } from "./DataGridContainer";
import {
	DataGridGroupPanel,
	DataGridGroupPanelState,
} from "./DataGridGroupPanel/DataGridGroupPanel";
import {
	DataGridPagination,
	DataGridPaginationState,
} from "./DataGridPagination/DataGridPagination";
import {
	DataGridTableBody,
	DataGridTableBodyState,
} from "./DataGridTableBody/DataGridTableBody";
import { getDataGridRowMoveEvent } from "./DataGridTableBody/dataGridTableRowMove";
import { DataGridTableContainer } from "./DataGridTableContainer/DataGridTableContainer";
import { DataGridTableHeader } from "./DataGridTableHeader/DataGridTableHeader";
import {
	DataGridToolbar,
	DataGridToolbarState,
} from "./DataGridToolbar/DataGridToolbar";

const objectPrototype = Object.prototype;

export type Key = string | number | bigint;
type DataGridRow = { id: Key };
type DataGridColumns<TData extends DataGridRow> = NonNullable<
	TableOptions<TData>["columns"]
>;

export function DataGrid<TData extends { id: Key }>({
	state,
}: {
	state: DataGridState<TData>;
}) {
	const renderedRows = state.getRenderedRows(state.rows);

	useEffect(() => {
		state.table.applyExpansionRequest(state.table.expandRequest);
	}, [state, state.table.expandRequest?.requestId]);

	const grouping = state.table.getGroupingState();
	const querySort = state.queryStates.sort;
	const sortValues = Array.isArray(querySort)
		? querySort.filter((value): value is string => typeof value === "string")
		: typeof querySort === "string" && querySort.length > 0
			? [querySort]
			: [];
	const sorting: SortingState = sortValues.map((sortValue) => ({
		id: sortValue.startsWith("-") ? sortValue.slice(1) : sortValue,
		desc: sortValue.startsWith("-"),
	}));
	const pagination = state.pagination?.toTablePaginationState();
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor),
	);

	const table = useReactTable({
		data: renderedRows,
		columns: state.table.columns,
		state: { expanded: state.table.expanded, grouping, sorting, pagination },
		getRowId: (row) => String(row.id),
		getSubRows: state.table.getSubRows,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		autoResetPageIndex: false,
		autoResetExpanded: false,
		onExpandedChange: state.table.setExpanded,
		onGroupingChange: state.groupPanel?.changeGrouping,
		onSortingChange: state.table.changeSorting,
		onPaginationChange: state.pagination?.changeTablePagination,
	});

	const headerGroups = table.getHeaderGroups();
	const rows = table.getRowModel().rows;
	state.table.setRowMoveRows(rows);

	const visibleRowKeys = table.getCoreRowModel().rows.map((row) => row.id);
	const selectionMode =
		state.table.selection?.mode === "none"
			? undefined
			: state.table.selection?.mode;
	const tableColumnCount =
		table.getVisibleLeafColumns().length + (selectionMode ? 1 : 0);

	const tableContent = (
		<DataGridTableContainer
			columnWidths={table
				.getVisibleLeafColumns()
				.map((column) => column.getSize())}
			isSelectable={Boolean(selectionMode)}
		>
			<DataGridTableHeader
				state={state.table.header}
				headerGroups={headerGroups}
				visibleRowKeys={visibleRowKeys}
				table={table}
			/>
			<DataGridTableBody
				state={state.table.body}
				config={state.table}
				rows={rows}
				selectionMode={selectionMode}
				tableColumnCount={tableColumnCount}
			/>
		</DataGridTableContainer>
	);

	return (
		<DataGridContainer>
			{state.toolbar ? <DataGridToolbar state={state.toolbar} /> : null}
			{state.groupPanel ? (
				<DataGridGroupPanel state={state.groupPanel} />
			) : null}
			{state.table.onRowMove ? (
				<DndContext
					collisionDetection={closestCenter}
					sensors={sensors}
					onDragEnd={state.table.completeRowMove}
				>
					{tableContent}
				</DndContext>
			) : (
				tableContent
			)}
			{state.pagination ? (
				<DataGridPagination state={state.pagination} />
			) : null}
			{state.actionBar ? <DataGridActionBar state={state.actionBar} /> : null}
		</DataGridContainer>
	);
}

function hasOwnField(value: Record<string, unknown>, field: string) {
	return objectPrototype.hasOwnProperty.call(value, field);
}

const DATA_GRID_GROUP_BY_QUERY_KEY = "groupBy";
type DataGridTableRowMoveData<TData extends DataGridRow> = {
	id: string;
	depth: number;
	original: TData;
	getIsGrouped: () => boolean;
	getParentRow: () => { id: string } | undefined;
};

interface DataGridChangesSnapshot<TData extends { id: Key }> {
	created: TData[];
	updated: Array<{ id: Key; changes: Partial<TData> }>;
	deleted: Key[];
}

export class DataGridState<TData extends DataGridRow = DataGridRow> {
	queryStates: DataGridQueryStates;
	querySetter: DataGridSetQueryStates;
	rows: TData[] = [];
	selection?: DataGridSelectionState;
	created: TData[] = [];
	updated: Array<{ id: Key; changes: Partial<TData> }> = [];
	deleted: Key[] = [];
	originalValues = new Map<Key, Record<string, unknown>>();
	toolbar?: DataGridToolbarState;
	groupPanel?: DataGridGroupPanelState;
	table: DataGridTableState<TData>;
	pagination?: DataGridPaginationState;
	actionBar?: DataGridActionBarState;

	constructor({
		queryStates,
		setQueryStates,
		rows = [],
		toolbar,
		groupPanel,
		table,
		pagination,
		actionBar,
	}: {
		queryStates: DataGridQueryStates;
		setQueryStates: DataGridSetQueryStates;
		rows?: TData[];
		toolbar?: DataGridToolbarState;
		groupPanel?: DataGridGroupPanelState;
		table: DataGridTableOptions<TData>;
		pagination?: DataGridPaginationState;
		actionBar?: DataGridActionBarState;
	}) {
		this.queryStates = queryStates;
		this.querySetter = setQueryStates;
		this.rows = rows;
		this.toolbar = toolbar;
		this.groupPanel = groupPanel;
		this.table = new DataGridTableState(this, table);
		this.pagination = pagination;
		this.actionBar = actionBar;
		makeAutoObservable<this, "originalValues">(this, undefined, {
			autoBind: true,
		});
	}

	addRow(row: TData) {
		const createdIndex = this.created.findIndex(({ id }) => id === row.id);
		const nextRow = { ...row };
		this.created =
			createdIndex >= 0
				? this.created.map((createdRow, index) =>
						index === createdIndex ? nextRow : createdRow,
					)
				: [...this.created, nextRow];
		this.deleted = this.deleted.filter((rowId) => rowId !== row.id);
	}

	setValue<TField extends keyof TData>(
		row: TData,
		field: TField,
		value: TData[TField],
	) {
		const fieldName = String(field);
		const createdIndex = this.created.findIndex(({ id }) => id === row.id);
		if (createdIndex >= 0) {
			this.created = this.created.map((createdRow, index) =>
				index === createdIndex
					? { ...createdRow, [fieldName]: value }
					: createdRow,
			);
			return;
		}

		const originalFields = this.originalValues.get(row.id) ?? {};
		if (!hasOwnField(originalFields, fieldName)) {
			originalFields[fieldName] = row[field];
			this.originalValues.set(row.id, originalFields);
		}
		const updateIndex = this.updated.findIndex(({ id }) => id === row.id);
		const currentChanges: Partial<TData> =
			updateIndex >= 0 ? { ...this.updated[updateIndex].changes } : {};
		const currentChangeFields = currentChanges as Record<string, unknown>;
		if (Object.is(value, originalFields[fieldName])) {
			delete currentChangeFields[fieldName];
		} else {
			currentChangeFields[fieldName] = value;
		}
		if (Object.keys(currentChanges).length === 0) {
			this.updated = this.updated.filter(({ id }) => id !== row.id);
			return;
		}
		const nextUpdate = { id: row.id, changes: currentChanges };
		this.updated =
			updateIndex >= 0
				? this.updated.map((update, index) =>
						index === updateIndex ? nextUpdate : update,
					)
				: [...this.updated, nextUpdate];
	}

	deleteRow(rowId: Key) {
		const isCreated = this.created.some(({ id }) => id === rowId);
		if (isCreated) {
			this.created = this.created.filter(({ id }) => id !== rowId);
		} else if (!this.deleted.includes(rowId)) {
			this.deleted = [...this.deleted, rowId];
		}
		this.updated = this.updated.filter(({ id }) => id !== rowId);
		this.originalValues.delete(rowId);
	}

	clear() {
		this.created = [];
		this.updated = [];
		this.deleted = [];
		this.originalValues.clear();
	}

	getRow(row: TData): TData {
		const createdRow = this.created.find(({ id }) => id === row.id);
		const update = this.updated.find(({ id }) => id === row.id);
		if (!createdRow && !update) return row;
		return {
			...row,
			...(createdRow ?? {}),
			...(update?.changes ?? {}),
		} as TData;
	}

	toJSON(): DataGridChangesSnapshot<TData> {
		return {
			created: this.created.map((row) => ({ ...row })) as TData[],
			updated: this.updated.map((update) => ({
				id: update.id,
				changes: { ...update.changes } as Partial<TData>,
			})),
			deleted: [...this.deleted],
		};
	}

	/** 원본 행과 변경 내역을 합친 현재 렌더링 행을 반환합니다. */
	getRenderedRows(rows: TData[]) {
		const createdRows = this.created;
		return [
			...rows
				.filter((row) => !this.deleted.includes(row.id))
				.map((row) => this.getRow(row)),
			...createdRows
				.map((row) => ({ ...row }))
				.filter((createdRow) => !rows.some((row) => row.id === createdRow.id)),
		];
	}
}

/** Table namespace의 책임별 facade를 보관합니다. */
type DataGridTableOptions<TData extends DataGridRow> = {
	entity: string;
	columns: DataGridColumns<TData>;
	selection?: SelectionConfig;
	onRowClick?: (row: TData) => void;
	getSubRows?: (row: TData, index: number) => TData[] | undefined;
	expandRequest?: DataGridExpandRequest;
	editRequest?: DataGridEditRequest;
	onRowMove?: (event: DataGridRowMoveEvent<TData>) => void;
	emptyMessage?: string;
};

export class DataGridTableState<TData extends DataGridRow = DataGridRow> {
	expanded: ExpandedState = {};
	selectedKeys = new Set<string>();
	entity: string;
	columns: DataGridColumns<TData>;
	selection?: SelectionConfig;
	onRowClick?: (row: TData) => void;
	getSubRows?: (row: TData, index: number) => TData[] | undefined;
	expandRequest?: DataGridExpandRequest;
	editRequest?: DataGridEditRequest;
	onRowMove?: (event: DataGridRowMoveEvent<TData>) => void;
	emptyMessage?: string;
	readonly header: DataGridTableHeaderState<TData>;
	readonly body: DataGridTableBodyState<TData>;
	private rowMoveRows: DataGridTableRowMoveData<TData>[] = [];

	constructor(
		readonly state: DataGridState<TData>,
		options: DataGridTableOptions<TData>,
	) {
		const {
			entity,
			columns,
			selection,
			onRowClick,
			getSubRows,
			expandRequest,
			editRequest,
			onRowMove,
			emptyMessage,
		} = options;
		this.entity = entity;
		this.columns = columns;
		this.selection = selection;
		this.onRowClick = onRowClick;
		this.getSubRows = getSubRows;
		this.expandRequest = expandRequest;
		this.editRequest = editRequest;
		this.onRowMove = onRowMove;
		this.emptyMessage = emptyMessage;
		makeAutoObservable(
			this,
			{
				state: false,
				expanded: observable.ref,
				selectedKeys: observable.ref,
				entity: false,
				columns: observable.ref,
				selection: observable.ref,
				getGroupingState: false,
				onRowClick: false,
				getSubRows: false,
				expandRequest: observable.ref,
				editRequest: observable.ref,
				onRowMove: false,
				emptyMessage: false,
				header: false,
				body: false,
			},
			{ autoBind: true },
		);
		this.header = new DataGridTableHeaderState(state);
		this.body = new DataGridTableBodyState(state);
	}

	setExpanded(nextExpanded: Updater<ExpandedState>) {
		this.expanded =
			typeof nextExpanded === "function"
				? nextExpanded(this.expanded)
				: nextExpanded;
	}

	changeSorting(nextSorting: Updater<SortingState>) {
		const sortValues = Array.isArray(this.state.queryStates.sort)
			? this.state.queryStates.sort.filter(
					(value): value is string => typeof value === "string",
				)
			: typeof this.state.queryStates.sort === "string" &&
					this.state.queryStates.sort.length > 0
				? [this.state.queryStates.sort]
				: [];
		const currentSorting = sortValues.map((sortValue) => ({
			id: sortValue.startsWith("-") ? sortValue.slice(1) : sortValue,
			desc: sortValue.startsWith("-"),
		}));
		const updatedSorting =
			typeof nextSorting === "function"
				? nextSorting(currentSorting)
				: nextSorting;
		void this.state.querySetter({
			sort:
				updatedSorting.length === 0
					? null
					: updatedSorting.map(({ id, desc }) => (desc ? `-${id}` : id)),
			skip: 0,
		});
	}

	setRowMoveRows(rows: DataGridTableRowMoveData<TData>[]) {
		this.rowMoveRows = rows;
	}

	completeRowMove(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || !this.onRowMove || active.id === over.id) return;
		const bodyRows = this.rowMoveRows;
		const activeRow = bodyRows.find((row) => row.id === String(active.id));
		if (!activeRow) return;
		const moveEvent = getDataGridRowMoveEvent(
			bodyRows
				.filter((row) => !row.getIsGrouped())
				.map((row) => ({
					id: row.id,
					parentId: row.getParentRow()?.id ?? null,
					depth: row.depth,
					original: row.original,
				})),
			String(active.id),
			String(over.id),
			{
				depth: activeRow.depth,
				parentId: activeRow.getParentRow()?.id ?? null,
			},
		);
		if (moveEvent) this.onRowMove(moveEvent);
	}

	applyExpansionRequest(request: DataGridExpandRequest | undefined) {
		if (!request) return;

		const expandedRows =
			typeof this.expanded === "object" && this.expanded !== null
				? this.expanded
				: {};
		this.expanded = {
			...expandedRows,
			[String(request.rowId)]: true,
		};
	}

	setSelectedKeys(selectedKeys: Set<string>) {
		this.selectedKeys = selectedKeys;
	}

	getGroupingState(): GroupingState {
		const queryStates = this.state.queryStates;
		if (Object.hasOwn(queryStates, DATA_GRID_GROUP_BY_QUERY_KEY)) {
			const queryGrouping = queryStates[DATA_GRID_GROUP_BY_QUERY_KEY];
			return Array.isArray(queryGrouping)
				? queryGrouping.filter(
						(columnId): columnId is string => typeof columnId === "string",
					)
				: [];
		}

		return [];
	}
}

/** Table header가 sort, resize, visibility와 visible selection을 위임하는 facade입니다. */
export class DataGridTableHeaderState<TData extends { id: Key } = { id: Key }> {
	constructor(readonly state: DataGridState<TData>) {
		makeAutoObservable(this, { state: false }, { autoBind: true });
	}

	getSelectionMode(): Exclude<SelectionConfig["mode"], "none"> | undefined {
		const selectionMode = this.state.table.selection?.mode;
		return selectionMode === "none" ? undefined : selectionMode;
	}

	get selectedKeys() {
		return Array.from(
			this.state.selection?.selectedKeys ?? this.state.table.selectedKeys,
		);
	}

	get queryValues() {
		return this.state.queryStates;
	}

	isAllVisibleRowsSelected(visibleRowKeys: string[]) {
		const selectedKeySet = new Set(this.selectedKeys);
		return (
			visibleRowKeys.length > 0 &&
			visibleRowKeys.every((rowKey) => selectedKeySet.has(rowKey))
		);
	}

	isSomeVisibleRowsSelected(visibleRowKeys: string[]) {
		const selectedKeySet = new Set(this.selectedKeys);
		return visibleRowKeys.some((rowKey) => selectedKeySet.has(rowKey));
	}

	changeQuery(values: Record<string, unknown | null>) {
		return this.state.querySetter(values);
	}

	changeVisibleSelection(visibleRowKeys: string[], isSelected: boolean) {
		const nextSelectedKeys = isSelected
			? Array.from(new Set([...this.selectedKeys, ...visibleRowKeys]))
			: this.selectedKeys.filter((key) => !visibleRowKeys.includes(key));
		const nextSelection = new Set(nextSelectedKeys);
		if (this.state.selection?.setSelectedKeys) {
			this.state.selection.setSelectedKeys(nextSelection);
		} else {
			this.state.table.setSelectedKeys(nextSelection);
		}
		this.state.table.selection?.onSelectionChange?.(nextSelection);
	}
}

export default observer(DataGrid);
