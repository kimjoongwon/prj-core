import type {
	DataGridConfig,
	DataGridChangesState as DataGridChangesStateContract,
	DataGridColumnsState as DataGridColumnsStateContract,
	DataGridColumnsStateSnapshot,
	DataGridExpandRequest,
	DataGridQueryState as DataGridQueryStateContract,
	DataGridQueryStates,
	DataGridSelectionState as DataGridSelectionStateContract,
	DataGridSetQueryStates,
	DataGridState as DataGridStateContract,
} from "@cocrepo/type";
import type {
	ExpandedState,
	Table as TanStackTable,
	Updater,
} from "@tanstack/react-table";
import { makeAutoObservable, observable, reaction } from "mobx";
import { DataGridChangesState } from "./DataGridChangesState";
import {
	getGroupingColumnIds,
	getVisibleColumnConfigs,
} from "../columns/columnConfig";
import { DATA_GRID_GROUP_BY_QUERY_KEY } from "./grouping";
import type { Key } from "../Table/rowKeys";
import type { DataGridSelectionMode } from "./selection";
import { getNextSortValues, getQuerySortValues, type DataGridSortDirection } from "./sorting";
import { getDataGridRowMoveEvent } from "../Table/TableBody/rowMove";

const objectPrototype = Object.prototype;

export interface DataGridStateOptions {
	queryStates: DataGridQueryStates;
	setQueryStates: DataGridSetQueryStates;
	columns?: Partial<DataGridColumnsStateSnapshot>;
	selection?: DataGridSelectionStateContract;
	changes?: DataGridChangesStateContract;
}

interface DataGridRuntime<T extends { id: Key }> {
	config: DataGridConfig<T>;
	rows: T[];
	totalCount: number;
	isLoading: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwnRecordKey(value: Record<string, unknown>, key: string) {
	return objectPrototype.hasOwnProperty.call(value, key);
}

function toStringArray(value: unknown) {
	return Array.isArray(value)
		? value.filter((item): item is string => typeof item === "string")
		: [];
}

function toUniqueStringArray(value: string[]) {
	return Array.from(new Set(value));
}

function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function toRecord<T>(
	value: unknown,
	isEntryValue: (entryValue: unknown) => entryValue is T,
) {
	if (!isRecord(value)) {
		return {};
	}

	return Object.fromEntries(
		Object.entries(value).filter((entry): entry is [string, T] =>
			isEntryValue(entry[1]),
		),
	);
}

export class DataGridColumnsState implements DataGridColumnsStateContract {
	order: string[] = [];
	visibility: Record<string, boolean> = {};
	sizing: Record<string, number> = {};
	grouping: string[] = [];
	isGroupingCustomized = false;

	constructor(snapshot?: Partial<DataGridColumnsStateSnapshot>) {
		makeAutoObservable(this, {}, { autoBind: true });
		this.restore(snapshot);
	}

	setOrder(order: string[]) {
		this.order = [...order];
	}

	setVisibility(visibility: Record<string, boolean>) {
		this.visibility = { ...visibility };
	}

	setColumnVisibility(columnId: string, isVisible: boolean) {
		this.visibility = {
			...this.visibility,
			[columnId]: isVisible,
		};
	}

	setSizing(sizing: Record<string, number>) {
		this.sizing = { ...sizing };
	}

	setColumnSizing(columnId: string, size: number | null) {
		const nextSizing = { ...this.sizing };
		if (size == null) {
			delete nextSizing[columnId];
		} else {
			nextSizing[columnId] = size;
		}
		this.sizing = nextSizing;
	}

	setGrouping(grouping: string[]) {
		this.grouping = toUniqueStringArray(grouping);
		this.isGroupingCustomized = true;
	}

	setColumnGrouping(columnId: string, isGrouped: boolean) {
		const nextGrouping = this.grouping.filter((id) => id !== columnId);
		this.grouping = isGrouped ? [...nextGrouping, columnId] : nextGrouping;
		this.isGroupingCustomized = true;
	}

	restore(snapshot?: unknown) {
		if (!isRecord(snapshot)) {
			return;
		}

		this.order = toStringArray(snapshot.order);
		this.visibility = toRecord(snapshot.visibility, isBoolean);
		this.sizing = toRecord(snapshot.sizing, isFiniteNumber);
		this.grouping = toUniqueStringArray(toStringArray(snapshot.grouping));
		this.isGroupingCustomized = hasOwnRecordKey(snapshot, "grouping");
	}

	toJSON(): DataGridColumnsStateSnapshot {
		return {
			order: [...this.order],
			visibility: { ...this.visibility },
			sizing: { ...this.sizing },
			grouping: [...this.grouping],
		};
	}
}

export class DataGridSelectionState implements DataGridSelectionStateContract {
	selectedKeys = new Set<string>();

	constructor(selectedKeys?: Set<string>) {
		this.selectedKeys = selectedKeys ?? new Set<string>();

		makeAutoObservable(this, {}, { autoBind: true });
	}

	setSelectedKeys(keys: Set<string>) {
		this.selectedKeys = keys;
	}

	clear() {
		this.selectedKeys = new Set<string>();
	}
}

export class DataGridQueryState implements DataGridQueryStateContract {
	values: DataGridQueryStates;
	setValues: DataGridSetQueryStates;

	constructor(values: DataGridQueryStates, setValues: DataGridSetQueryStates) {
		this.values = values;
		this.setValues = setValues;

		makeAutoObservable<this, "setValues">(
			this,
			{
				setValues: false,
			},
			{ autoBind: true },
		);
	}

	sync(values: DataGridQueryStates, setValues: DataGridSetQueryStates) {
		this.values = values;
		this.setValues = setValues;
	}
}

export class DataGridState implements DataGridStateContract {
	columns: DataGridColumnsState;
	query: DataGridQueryState;
	selection?: DataGridSelectionStateContract;
	changes: DataGridChangesStateContract;
	expanded: ExpandedState = {};
	selectedKeys = new Set<string>();
	activeRowId: string | null = null;
	overRowId: string | null = null;
	dragOffset = 0;
	readonly toolbar: DataGridToolbarState;
	readonly groupPanel: DataGridGroupPanelState;
	readonly table: DataGridTableState;
	readonly pagination: DataGridPaginationState;
	readonly actionBar: DataGridActionBarState;
	private runtime?: DataGridRuntime<{ id: Key }>;

	constructor({
		columns,
		queryStates,
		setQueryStates,
		selection,
		changes,
	}: DataGridStateOptions) {
		this.columns = new DataGridColumnsState(columns);
		this.query = new DataGridQueryState(queryStates, setQueryStates);
		this.selection = selection;
		this.changes = changes ?? new DataGridChangesState();
		this.toolbar = new DataGridToolbarState(this);
		this.groupPanel = new DataGridGroupPanelState(this);
		this.table = new DataGridTableState(this);
		this.pagination = new DataGridPaginationState(this);
		this.actionBar = new DataGridActionBarState(this);

		makeAutoObservable<this, "runtime">(
			this,
			{ runtime: observable.ref },
			{ autoBind: true },
		);
	}

	/** 표준 compound 조립이 참조할 외부 렌더 입력을 root에 한 번 연결합니다. */
	syncRuntime<T extends { id: Key }>(runtime: DataGridRuntime<T>) {
		if (this.hasRuntime(runtime)) {
			return;
		}

		this.runtime = runtime as unknown as DataGridRuntime<{ id: Key }>;
	}

	hasRuntime<T extends { id: Key }>(runtime: DataGridRuntime<T>) {
		const currentRuntime = this.runtime as
			| DataGridRuntime<T>
			| undefined;
		return (
			currentRuntime?.config === runtime.config &&
			currentRuntime.rows === runtime.rows &&
			currentRuntime.totalCount === runtime.totalCount &&
			currentRuntime.isLoading === runtime.isLoading
		);
	}

	getRuntime<T extends { id: Key }>() {
		if (!this.runtime) {
			throw new Error("DataGridState에는 렌더링할 config와 rows가 필요합니다.");
		}

		return this.runtime as unknown as DataGridRuntime<T>;
	}

	/** 원본 rows와 root changes를 합친 현재 렌더링 행을 반환합니다. */
	getRenderedRows<T extends { id: Key }>(runtimeRows?: T[]) {
		const rows = runtimeRows ?? this.getRuntime<T>().rows;
		return [
			...rows
				.filter((row) => !this.changes.isDeleted(row.id))
				.map((row) => this.changes.getRow(row)),
			...this.changes
				.getCreatedRows<T>()
				.filter((createdRow) => !rows.some((row) => row.id === createdRow.id)),
		];
	}

	applyExpansionRequest(request: DataGridExpandRequest | undefined) {
		if (!request) {
			return;
		}

		const expandedRows =
			typeof this.expanded === "object" && this.expanded !== null
				? this.expanded
				: {};
		this.expanded = {
			...expandedRows,
			[String(request.rowId)]: true,
		};
	}

	setExpanded(nextExpanded: Updater<ExpandedState>) {
		this.expanded =
			typeof nextExpanded === "function"
				? nextExpanded(this.expanded)
				: nextExpanded;
		this.table.syncExpandedState(this.expanded);
	}

	setSelectedKeys(selectedKeys: Set<string>) {
		this.selectedKeys = selectedKeys;
	}

	startRowMove(rowId: string) {
		this.activeRowId = rowId;
		this.overRowId = rowId;
		this.dragOffset = 0;
	}

	setOverRow(rowId: string | null) {
		this.overRowId = rowId;
	}

	setDragOffset(dragOffset: number) {
		this.dragOffset = dragOffset;
	}

	resetRowMove() {
		this.activeRowId = null;
		this.overRowId = null;
		this.dragOffset = 0;
	}

	syncQuery(
		queryStates: DataGridQueryStates,
		setQueryStates: DataGridSetQueryStates,
	) {
		this.query.sync(queryStates, setQueryStates);
	}

	syncSelection(selection?: DataGridSelectionStateContract) {
		this.selection = selection;
	}
}

/** Toolbar가 query 입력과 column preference에 접근하는 facade입니다. */
export class DataGridToolbarState {
	constructor(private readonly root: DataGridState) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	get config() {
		return this.root.getRuntime().config;
	}

	get queryValues() {
		return this.root.query.values;
	}

	get columnState() {
		return this.root.columns.toJSON();
	}

	changeQuery(values: Record<string, unknown | null>) {
		return this.root.query.setValues(values);
	}

	changeColumns(columns: DataGridColumnsStateSnapshot) {
		this.root.columns.restore(columns);
	}
}

/** Group panel의 grouping 표시와 변경만 위임하는 facade입니다. */
export class DataGridGroupPanelState {
	constructor(private readonly root: DataGridState) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	get config() {
		return this.root.getRuntime().config;
	}

	get grouping() {
		return getGroupingColumnIds(
			this.config.columns,
			this.root.columns,
			this.root.query.values,
		);
	}

	changeGrouping(grouping: string[]) {
		this.root.columns.setGrouping(grouping);
		this.root.table.getTanStackTable().setOptions((currentOptions) => ({
			...currentOptions,
			state: { ...currentOptions.state, grouping },
		}));
		return this.root.query.setValues({
			[DATA_GRID_GROUP_BY_QUERY_KEY]: grouping,
			skip: 0,
		});
	}
}

/** Table namespace의 shared runtime facade입니다. */
export class DataGridTableState {
	readonly header: DataGridTableHeaderState;
	readonly body: DataGridTableBodyState;
	readonly footer: DataGridTableFooterState;
	private tanStackTable?: TanStackTable<{ id: Key }>;

	constructor(private readonly root: DataGridState) {
		makeAutoObservable(
			this,
			{ root: false, tanStackTable: false } as never,
			{ autoBind: true },
		);
		this.header = new DataGridTableHeaderState(root, this);
		this.body = new DataGridTableBodyState(root, this);
		this.footer = new DataGridTableFooterState();

		reaction(
			() => [
				this.root.changes.created,
				this.root.changes.updated,
				this.root.changes.deleted,
			],
			() => this.syncChangedRows(),
		);
	}

	setTanStackTable<T extends { id: Key }>(table: TanStackTable<T>) {
		this.tanStackTable = table as unknown as TanStackTable<{ id: Key }>;
	}

	getTanStackTable<T extends { id: Key }>() {
		if (!this.tanStackTable) {
			throw new Error("DataGrid table runtime이 아직 연결되지 않았습니다.");
		}

		return this.tanStackTable as unknown as TanStackTable<T>;
	}

	/** controlled expanded state를 runtime table에만 반영합니다. */
	syncExpandedState(expanded: ExpandedState) {
		this.getTanStackTable().setOptions((currentOptions) => ({
			...currentOptions,
			state: {
				...currentOptions.state,
				expanded,
			},
		}));
	}

	/** root changes가 바뀔 때 runtime table의 data만 최신 행으로 교체합니다. */
	syncChangedRows() {
		if (!this.tanStackTable) {
			return;
		}

		this.tanStackTable.setOptions((currentOptions) => ({
			...currentOptions,
			data: this.root.getRenderedRows(),
		}));
	}

	get columnWidths() {
		return this.getTanStackTable().getVisibleLeafColumns().map((column) => column.getSize());
	}

	get isSelectable() {
		return Boolean(this.header.selectionMode);
	}
}

/** Table header가 sort, resize, visibility와 visible selection을 위임하는 facade입니다. */
export class DataGridTableHeaderState {
	constructor(
		private readonly root: DataGridState,
		private readonly table: DataGridTableState,
	) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	get headers() {
		this.root.columns.order;
		this.root.columns.visibility;
		this.root.columns.sizing;
		const visibleColumnIds = new Set(
			getVisibleColumnConfigs(
				this.root.getRuntime().config.columns,
				this.root.columns,
			).map((column) => String(column.field)),
		);

		return this.table
			.getTanStackTable()
			.getFlatHeaders()
			.filter((header) => visibleColumnIds.has(header.column.id));
	}

	get selectionMode(): DataGridSelectionMode {
		const selectionMode = this.root.getRuntime().config.selection?.mode;
		return selectionMode === "none" ? undefined : selectionMode;
	}

	get selectedKeys() {
		return Array.from(this.root.selection?.selectedKeys ?? this.root.selectedKeys);
	}

	get sortValues() {
		return getQuerySortValues(this.root.query.values);
	}

	get rootQueryValues() {
		return this.root.query.values;
	}

	get isAllVisibleRowsSelected() {
		const tableRows = this.table.getTanStackTable().getCoreRowModel().rows;
		const selectedKeySet = new Set(this.selectedKeys);
		return tableRows.length > 0 && tableRows.every((row) => selectedKeySet.has(row.id));
	}

	get isSomeVisibleRowsSelected() {
		const selectedKeySet = new Set(this.selectedKeys);
		return this.table.getTanStackTable().getCoreRowModel().rows.some((row) => selectedKeySet.has(row.id));
	}

	changeQuery(values: Record<string, unknown | null>) {
		return this.root.query.setValues(values);
	}

	changeColumnSizing(columnId: string, size: number | null) {
		this.root.columns.setColumnSizing(columnId, size);
	}

	changeSort(columnId: string, direction: DataGridSortDirection) {
		return this.root.query.setValues({
			sort: getNextSortValues(columnId, direction),
			skip: 0,
		});
	}

	changeVisibleSelection(isSelected: boolean) {
		const visibleRowKeys = this.table.getTanStackTable().getCoreRowModel().rows.map((row) => row.id);
		const nextSelectedKeys = isSelected
			? Array.from(new Set([...this.selectedKeys, ...visibleRowKeys]))
			: this.selectedKeys.filter((key) => !visibleRowKeys.includes(key));
		const nextSelection = new Set(nextSelectedKeys);
		if (this.root.selection?.setSelectedKeys) {
			this.root.selection.setSelectedKeys(nextSelection);
		} else {
			this.root.setSelectedKeys(nextSelection);
		}
		this.root.getRuntime().config.selection?.onSelectionChange?.(nextSelection);
	}
}

/** Inline editor의 draft와 validation 상태를 단일 root tree에서 유지합니다. */
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
		makeAutoObservable(this, {}, { autoBind: true });
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

	constructor(
		private readonly root: DataGridState,
		private readonly table: DataGridTableState,
	) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	get config() {
		return this.root.getRuntime().config;
	}

	get rows() {
		// TanStack row model은 facade가 직접 보관하지 않습니다. canonical root state를
		// 의존성으로 읽어 grouping 또는 expanded 변경 시 같은 table instance에서 다시 계산합니다.
		this.root.getRuntime();
		this.root.columns.grouping.length;
		this.root.columns.order;
		this.root.columns.visibility;
		this.root.columns.sizing;
		this.root.expanded;
		this.root.changes.created;
		this.root.changes.updated;
		this.root.changes.deleted;
		return this.table.getTanStackTable().getRowModel().rows;
	}

	get selectedKeys() {
		return Array.from(this.root.selection?.selectedKeys ?? this.root.selectedKeys);
	}

	get selectionMode() {
		return this.table.header.selectionMode;
	}

	get tableColumnCount() {
		return this.table.header.headers.length + (this.selectionMode ? 1 : 0);
	}

	changeCellValue<T extends { id: Key }, TField extends keyof T>(
		row: T,
		field: TField,
		value: T[TField],
	) {
		this.root.changes.setValue(row, field, value);
	}

	changeRowSelection(rowKey: string, isSelected: boolean) {
		const nextSelectedKeys = isSelected
			? [...this.selectedKeys, rowKey]
			: this.selectedKeys.filter((key) => key !== rowKey);
		const nextSelection = new Set(nextSelectedKeys);
		if (this.root.selection?.setSelectedKeys) {
			this.root.selection.setSelectedKeys(nextSelection);
		} else {
			this.root.setSelectedKeys(nextSelection);
		}
		this.config.selection?.onSelectionChange?.(nextSelection);
	}

	completeRowMove(activeRowId: string, overRowId: string) {
		if (!this.config.onRowMove || activeRowId === overRowId) return;
		const bodyRows = this.rows.filter((row) => !row.getIsGrouped());
		const moveItems = bodyRows.map((row) => ({ id: row.id, parentId: row.getParentRow()?.id ?? null, depth: row.depth, original: row.original }));
		const activeRow = bodyRows.find((row) => row.id === activeRowId);
		if (!activeRow) return;
		const event = getDataGridRowMoveEvent(moveItems, activeRowId, overRowId, { depth: activeRow.depth, parentId: activeRow.getParentRow()?.id ?? null });
		if (event) this.config.onRowMove(event);
	}
}

/** 실제 footer 요구가 생길 때 확장할 비어 있는 facade입니다. */
export class DataGridTableFooterState {}

/** Pagination이 query의 skip/take와 total count를 위임하는 facade입니다. */
export class DataGridPaginationState {
	constructor(private readonly root: DataGridState) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	get take() {
		return Number(this.root.query.values.take) || 20;
	}

	get skip() {
		return Number(this.root.query.values.skip) || 0;
	}

	get totalCount() {
		return this.root.getRuntime().totalCount;
	}

	get currentPage() {
		return Math.floor(this.skip / this.take) + 1;
	}

	changePage(page: number) {
		return this.root.query.setValues({ skip: (page - 1) * this.take });
	}
}

/** Action bar가 선택 결과만 표현하도록 제한하는 facade입니다. */
export class DataGridActionBarState {
	constructor(private readonly root: DataGridState) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	get selectedCount() {
		return this.root.selection?.selectedKeys?.size ?? this.root.selectedKeys.size;
	}

	get showCount() {
		return this.root.getRuntime().config.selection?.actionBar?.showCount;
	}
}
