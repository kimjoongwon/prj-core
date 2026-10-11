"use client";

import type {
	DataGridEditRequest,
	DataGridExpandRequest,
	DataGridGroupPanelConfig,
	DataGridQueryStates,
	DataGridRowMoveEvent,
	DataGridSelectionState,
	DataGridSetQueryStates,
	DataGridToolbarConfig,
	InputConfig,
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
	type ColumnDef,
	type ExpandedState,
	type GroupingState,
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	type SortingState,
	type Updater,
	useReactTable,
} from "@tanstack/react-table";
import { makeAutoObservable, observable } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { getGroupableColumnItems } from "./columns/columnConfig";
import {
	DataGridActionBarView as DataGridActionBar,
	DataGridActionBarState,
} from "./DataGridActionBar/DataGridActionBar";
import { DataGridContainer } from "./DataGridContainer";
import {
	DataGridGroupPanelView as DataGridGroupPanel,
	DataGridGroupPanelState,
} from "./DataGridGroupPanel/DataGridGroupPanel";
import {
	DataGridPaginationView as DataGridPagination,
	DataGridPaginationState,
} from "./DataGridPagination/DataGridPagination";
import { DataGridTableBody } from "./DataGridTableBody/DataGridTableBody";
import { getDataGridRowMoveEvent } from "./DataGridTableBody/dataGridTableRowMove";
import { DataGridTableContainer } from "./DataGridTableContainer/DataGridTableContainer";
import { DataGridTableHeader } from "./DataGridTableHeader/DataGridTableHeader";
import {
	DataGridToolbar,
	DataGridToolbarState,
} from "./DataGridToolbar/DataGridToolbar";

const objectPrototype = Object.prototype;

export type Key = string | number | bigint;

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
	const pagination = state.pagination.toTablePaginationState();
	const groupableColumns = getGroupableColumnItems(state.table.columns);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor),
	);
	const table = useReactTable({
		data: renderedRows,
		columns: state.table.columns as unknown as ColumnDef<
			{ id: Key },
			unknown
		>[],
		state: { expanded: state.table.expanded, grouping, sorting, pagination },
		getRowId: (row) => String(row.id),
		getSubRows: state.table.getSubRows,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		// 페이지 초기화는 nuqs query가 소유하므로 행 재계산으로 내부 페이지 갱신을 예약하지 않습니다.
		autoResetPageIndex: false,
		autoResetExpanded: false,
		onExpandedChange: state.table.setExpanded,
		onGroupingChange: state.groupPanel.changeGrouping,
		onSortingChange: state.table.changeSorting,
		onPaginationChange: state.pagination.changeTablePagination,
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
			<DataGridToolbar
				leftInputs={state.toolbar.leftInputs}
				rightInputs={state.toolbar.rightInputs}
				state={state.toolbar}
			/>
			<DataGridGroupPanel
				groupableColumns={groupableColumns}
				grouping={grouping}
				show={state.groupPanel.show}
				state={state.groupPanel}
			/>
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
			<DataGridPagination state={state.pagination} table={table} />
			<DataGridActionBar
				state={state.actionBar}
				showCount={state.table.selection?.actionBar?.showCount}
			/>
		</DataGridContainer>
	);
});

function hasOwnField(value: Record<string, unknown>, field: string) {
	return objectPrototype.hasOwnProperty.call(value, field);
}

const DATA_GRID_GROUP_BY_QUERY_KEY = "groupBy";

type DataGridRow = { id: Key };

interface DataGridChangesSnapshot<TData extends { id: Key }> {
	created: TData[];
	updated: Array<{ id: Key; changes: Partial<TData> }>;
	deleted: Key[];
}

export class DataGridState {
	readonly querySetter: DataGridSetQueryStates;
	queryStates: DataGridQueryStates;
	rows: DataGridRow[];
	selection?: DataGridSelectionState;
	created: Array<{ id: Key }> = [];
	updated: Array<{ id: Key; changes: Record<string, unknown> }> = [];
	deleted: Key[] = [];
	private originalValues = new Map<Key, Record<string, unknown>>();
	readonly toolbar: DataGridToolbarState;
	readonly groupPanel: DataGridGroupPanelState;
	readonly table: DataGridTableState;
	readonly pagination: DataGridPaginationState;
	readonly actionBar: DataGridActionBarState;

	constructor({
		queryStates,
		setQueryStates,
		toolbar,
		leftInputs,
		rightInputs,
		groupPanel,
		table = { entity: "", columns: [] },
		rows = [],
		totalCount = 0,
		selection,
	}: {
		queryStates: DataGridQueryStates;
		setQueryStates: DataGridSetQueryStates;
		toolbar?: DataGridToolbarConfig;
		groupPanel?: DataGridGroupPanelConfig;
		table?: {
			entity: string;
			columns: ColumnDef<never, never>[];
			selection?: SelectionConfig;
			onRowClick?: (row: DataGridRow) => void;
			getSubRows?: (
				row: DataGridRow,
				index: number,
			) => DataGridRow[] | undefined;
			expandRequest?: DataGridExpandRequest;
			editRequest?: DataGridEditRequest;
			onRowMove?: (event: DataGridRowMoveEvent<DataGridRow>) => void;
			emptyMessage?: string;
		};
		rows?: DataGridRow[];
		leftInputs?: InputConfig[];
		rightInputs?: InputConfig[];
		totalCount?: number;
		selection?: DataGridSelectionState;
	}) {
		this.queryStates = queryStates;
		this.querySetter = setQueryStates;
		this.rows = rows;
		this.selection = selection;
		this.toolbar = new DataGridToolbarState(
			this,
			leftInputs ?? toolbar?.leftInputs,
			rightInputs ?? toolbar?.rightInputs,
		);
		this.groupPanel = new DataGridGroupPanelState(this, groupPanel);
		this.table = new DataGridTableState(this, table);
		this.pagination = new DataGridPaginationState(this, totalCount);
		this.actionBar = new DataGridActionBarState(this);

		makeAutoObservable<this, "originalValues">(
			this,
			{
				querySetter: false,
				queryStates: observable.ref,
				rows: observable.ref,
				selection: observable.ref,
				created: observable.ref,
				updated: observable.ref,
				deleted: observable.ref,
				originalValues: false,
				toolbar: false,
				groupPanel: false,
				table: false,
				pagination: false,
				actionBar: false,
				getRenderedRows: false,
			},
			{ autoBind: true },
		);
	}

	addRow<TData extends { id: Key }>(row: TData) {
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

	setValue<TData extends { id: Key }, TField extends keyof TData>(
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
		const currentChanges =
			updateIndex >= 0 ? { ...this.updated[updateIndex].changes } : {};
		if (Object.is(value, originalFields[fieldName])) {
			delete currentChanges[fieldName];
		} else {
			currentChanges[fieldName] = value;
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

	getRow<TData extends { id: Key }>(row: TData): TData {
		const createdRow = this.created.find(({ id }) => id === row.id);
		const update = this.updated.find(({ id }) => id === row.id);
		if (!createdRow && !update) return row;
		return {
			...row,
			...(createdRow ?? {}),
			...(update?.changes ?? {}),
		} as TData;
	}

	toJSON<TData extends { id: Key }>(): DataGridChangesSnapshot<TData> {
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
	getRenderedRows<T extends { id: Key }>(rows: T[]) {
		const createdRows = this.created as T[];
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
export class DataGridTableState {
	expanded: ExpandedState = {};
	selectedKeys = new Set<string>();
	entity: string;
	columns: ColumnDef<never, never>[];
	selection?: SelectionConfig;
	onRowClick?: (row: DataGridRow) => void;
	getSubRows?: (row: DataGridRow, index: number) => DataGridRow[] | undefined;
	expandRequest?: DataGridExpandRequest;
	editRequest?: DataGridEditRequest;
	onRowMove?: (event: DataGridRowMoveEvent<DataGridRow>) => void;
	emptyMessage?: string;
	readonly header: DataGridTableHeaderState;
	readonly body: DataGridTableBodyState;
	private rowMoveRows: Array<{
		id: string;
		depth: number;
		original: DataGridRow;
		getIsGrouped: () => boolean;
		getParentRow: () => { id: string } | undefined;
	}> = [];

	constructor(
		readonly state: DataGridState,
		{
			entity,
			columns,
			selection,
			onRowClick,
			getSubRows,
			expandRequest,
			editRequest,
			onRowMove,
			emptyMessage,
		}: {
			entity: string;
			columns: ColumnDef<never, never>[];
			selection?: SelectionConfig;
			onRowClick?: (row: DataGridRow) => void;
			getSubRows?: (
				row: DataGridRow,
				index: number,
			) => DataGridRow[] | undefined;
			expandRequest?: DataGridExpandRequest;
			editRequest?: DataGridEditRequest;
			onRowMove?: (event: DataGridRowMoveEvent<DataGridRow>) => void;
			emptyMessage?: string;
		},
	) {
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

	setRowMoveRows(rows: DataGridTableState["rowMoveRows"]) {
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
export class DataGridTableHeaderState {
	constructor(readonly state: DataGridState) {
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

/** Inline editor의 draft와 validation 상태를 유지합니다. */
export interface DataGridEditingCell {
	rowId: string;
	columnId: string;
	initialValue: unknown;
	draftValue: unknown;
	errorMessage?: string;
	isValidating: boolean;
}

export class DataGridEditingState {
	editingCell: DataGridEditingCell | null = null;

	constructor() {
		makeAutoObservable(
			this,
			{ editingCell: observable.ref },
			{ autoBind: true },
		);
	}

	setEditingCell(
		nextEditingCell:
			| DataGridEditingCell
			| null
			| ((current: DataGridEditingCell | null) => DataGridEditingCell | null),
	) {
		this.editingCell =
			typeof nextEditingCell === "function"
				? nextEditingCell(this.editingCell)
				: nextEditingCell;
	}
}

/** Table body가 row, selection, editing, hierarchy를 위임하는 facade입니다. */
export class DataGridTableBodyState {
	readonly editing = new DataGridEditingState();

	constructor(readonly state: DataGridState) {
		makeAutoObservable(this, { state: false }, { autoBind: true });
	}

	get selectedKeys() {
		return Array.from(
			this.state.selection?.selectedKeys ?? this.state.table.selectedKeys,
		);
	}

	changeCellValue<T extends { id: Key }, TField extends keyof T>(
		row: T,
		field: TField,
		value: T[TField],
	) {
		this.state.setValue(row, field, value);
	}

	changeRowSelection(
		rowKey: string,
		isSelected: boolean,
		onSelectionChange?: (selectedKeys: Set<string>) => void,
	) {
		const nextSelectedKeys = isSelected
			? [...this.selectedKeys, rowKey]
			: this.selectedKeys.filter((key) => key !== rowKey);
		const nextSelection = new Set(nextSelectedKeys);
		if (this.state.selection?.setSelectedKeys) {
			this.state.selection.setSelectedKeys(nextSelection);
		} else {
			this.state.table.setSelectedKeys(nextSelection);
		}
		onSelectionChange?.(nextSelection);
	}
}
