import type {
	DataGridTableConfig,
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
import type { ExpandedState, Updater } from "@tanstack/react-table";
import { makeAutoObservable } from "mobx";
import { DataGridChangesState } from "./DataGridChangesState";
import { getGroupingColumnIds } from "../columns/columnConfig";
import { DATA_GRID_GROUP_BY_QUERY_KEY } from "./grouping";
import type { Key } from "../Table/rowKeys";
import type { DataGridSelectionMode } from "./selection";
import {
	getNextSortValues,
	getQuerySortValues,
	type DataGridSortDirection,
} from "./sorting";
import { getDataGridRowMoveEvent } from "../Table/TableBody/rowMove";

const objectPrototype = Object.prototype;

export interface DataGridStateOptions {
	queryStates: DataGridQueryStates;
	setQueryStates: DataGridSetQueryStates;
	columns?: Partial<DataGridColumnsStateSnapshot>;
	selection?: DataGridSelectionStateContract;
	changes?: DataGridChangesStateContract;
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

		makeAutoObservable(this, {}, { autoBind: true });
	}

	/** 원본 rows와 root changes를 합친 현재 렌더링 행을 반환합니다. */
	getRenderedRows<T extends { id: Key }>(rows: T[]) {
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

	getGrouping<T extends { id: Key }>(
		columns: DataGridTableConfig<T>["columns"],
	) {
		return getGroupingColumnIds(
			columns,
			this.root.columns,
			this.root.query.values,
		);
	}

	changeGrouping(grouping: string[]) {
		this.root.columns.setGrouping(grouping);
		return this.root.query.setValues({
			[DATA_GRID_GROUP_BY_QUERY_KEY]: grouping,
			skip: 0,
		});
	}
}

/** Table namespace의 책임별 facade를 보관합니다. */
export class DataGridTableState {
	readonly header: DataGridTableHeaderState;
	readonly body: DataGridTableBodyState;

	constructor(private readonly root: DataGridState) {
		makeAutoObservable(this, { root: false } as never, { autoBind: true });
		this.header = new DataGridTableHeaderState(root);
		this.body = new DataGridTableBodyState(root);
	}
}

/** Table header가 sort, resize, visibility와 visible selection을 위임하는 facade입니다. */
export class DataGridTableHeaderState {
	constructor(private readonly root: DataGridState) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	getSelectionMode<T extends { id: Key }>(
		config: DataGridTableConfig<T>,
	): DataGridSelectionMode {
		const selectionMode = config.selection?.mode;
		return selectionMode === "none" ? undefined : selectionMode;
	}

	get selectedKeys() {
		return Array.from(
			this.root.selection?.selectedKeys ?? this.root.selectedKeys,
		);
	}

	get sortValues() {
		return getQuerySortValues(this.root.query.values);
	}

	get rootQueryValues() {
		return this.root.query.values;
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

	changeVisibleSelection(
		visibleRowKeys: string[],
		isSelected: boolean,
		onSelectionChange?: (selectedKeys: Set<string>) => void,
	) {
		const nextSelectedKeys = isSelected
			? Array.from(new Set([...this.selectedKeys, ...visibleRowKeys]))
			: this.selectedKeys.filter((key) => !visibleRowKeys.includes(key));
		const nextSelection = new Set(nextSelectedKeys);
		if (this.root.selection?.setSelectedKeys) {
			this.root.selection.setSelectedKeys(nextSelection);
		} else {
			this.root.setSelectedKeys(nextSelection);
		}
		onSelectionChange?.(nextSelection);
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

	constructor(private readonly root: DataGridState) {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	get selectedKeys() {
		return Array.from(
			this.root.selection?.selectedKeys ?? this.root.selectedKeys,
		);
	}

	changeCellValue<T extends { id: Key }, TField extends keyof T>(
		row: T,
		field: TField,
		value: T[TField],
	) {
		this.root.changes.setValue(row, field, value);
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
		if (this.root.selection?.setSelectedKeys) {
			this.root.selection.setSelectedKeys(nextSelection);
		} else {
			this.root.setSelectedKeys(nextSelection);
		}
		onSelectionChange?.(nextSelection);
	}

	completeRowMove<T extends { id: Key }>(
		rows: Array<{
			id: string;
			depth: number;
			original: T;
			getIsGrouped: () => boolean;
			getParentRow: () => { id: string } | undefined;
		}>,
		activeRowId: string,
		overRowId: string,
		onRowMove?: DataGridTableConfig<T>["onRowMove"],
	) {
		if (!onRowMove || activeRowId === overRowId) return;
		const bodyRows = rows.filter((row) => !row.getIsGrouped());
		const moveItems = bodyRows.map((row) => ({
			id: row.id,
			parentId: row.getParentRow()?.id ?? null,
			depth: row.depth,
			original: row.original,
		}));
		const activeRow = bodyRows.find((row) => row.id === activeRowId);
		if (!activeRow) return;
		const event = getDataGridRowMoveEvent(moveItems, activeRowId, overRowId, {
			depth: activeRow.depth,
			parentId: activeRow.getParentRow()?.id ?? null,
		});
		if (event) onRowMove(event);
	}
}

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
		return (
			this.root.selection?.selectedKeys?.size ?? this.root.selectedKeys.size
		);
	}
}
