import type * as DataGridTypes from "@cocrepo/type";
import type {
	DataGridExpandRequest,
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import type {
	ExpandedState,
	GroupingState,
	PaginationState,
	Updater,
} from "@tanstack/react-table";
import { makeAutoObservable, observable } from "mobx";
import type { Key } from "../Table/rowKeys";
import { getDataGridRowMoveEvent } from "../Table/TableBody/rowMove";
import { DataGridChangesState } from "./DataGridChangesState";
import { DATA_GRID_GROUP_BY_QUERY_KEY } from "./grouping";
import type { DataGridSelectionMode } from "./selection";

const emptyInputConfigs: InputConfig[] = [];

type DataGridRow = { id: Key };

export class DataGridSelectionState
	implements DataGridTypes.DataGridSelectionState
{
	selectedKeys = new Set<string>();

	constructor(selectedKeys?: Set<string>) {
		this.selectedKeys = selectedKeys ?? new Set<string>();

		makeAutoObservable(
			this,
			{ selectedKeys: observable.ref },
			{ autoBind: true },
		);
	}

	setSelectedKeys(keys: Set<string>) {
		this.selectedKeys = keys;
	}

	clear() {
		this.selectedKeys = new Set<string>();
	}
}

export class DataGridState {
	readonly querySetter: DataGridSetQueryStates;
	queryStates: DataGridQueryStates;
	rows: DataGridRow[];
	selection?: DataGridTypes.DataGridSelectionState;
	changes: DataGridChangesState;
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
		changes,
	}: {
		queryStates: DataGridQueryStates;
		setQueryStates: DataGridSetQueryStates;
		toolbar?: DataGridTypes.DataGridToolbarConfig;
		groupPanel?: DataGridTypes.DataGridGroupPanelConfig;
		table?: {
			entity: string;
			// biome-ignore lint/suspicious/noExplicitAny: DataGrid columns may carry different row TValue and edit callbacks.
			columns: DataGridTypes.DataGridColumnConfig<any>[];
			selection?: DataGridTypes.SelectionConfig;
			onRowClick?: (row: DataGridRow) => void;
			getSubRows?: (
				row: DataGridRow,
				index: number,
			) => DataGridRow[] | undefined;
			expandRequest?: DataGridExpandRequest;
			editRequest?: DataGridTypes.DataGridEditRequest;
			onRowMove?: (
				event: DataGridTypes.DataGridRowMoveEvent<DataGridRow>,
			) => void;
			emptyMessage?: string;
		};
		rows?: DataGridRow[];
		leftInputs?: InputConfig[];
		rightInputs?: InputConfig[];
		totalCount?: number;
		selection?: DataGridTypes.DataGridSelectionState;
		changes?: DataGridChangesState;
	}) {
		this.queryStates = queryStates;
		this.querySetter = setQueryStates;
		this.rows = rows;
		this.selection = selection;
		this.changes = changes ?? new DataGridChangesState();
		this.toolbar = new DataGridToolbarState(
			this,
			leftInputs ?? toolbar?.leftInputs,
			rightInputs ?? toolbar?.rightInputs,
		);
		this.groupPanel = new DataGridGroupPanelState(this, groupPanel);
		this.table = new DataGridTableState(this, table);
		this.pagination = new DataGridPaginationState(this, totalCount);
		this.actionBar = new DataGridActionBarState(this);

		makeAutoObservable(
			this,
			{
				querySetter: false,
				queryStates: observable.ref,
				rows: observable.ref,
				selection: observable.ref,
				changes: observable.ref,
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

	/** 원본 행과 변경 내역을 합친 현재 렌더링 행을 반환합니다. */
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
}

/** Toolbar가 query 입력에 접근하는 facade입니다. */
export class DataGridToolbarState {
	leftInputs = emptyInputConfigs;
	rightInputs = emptyInputConfigs;

	constructor(
		readonly state: DataGridState,
		leftInputs = emptyInputConfigs,
		rightInputs = emptyInputConfigs,
	) {
		this.leftInputs = leftInputs;
		this.rightInputs = rightInputs;
		makeAutoObservable(
			this,
			{
				state: false,
				leftInputs: false,
				rightInputs: false,
			},
			{ autoBind: true },
		);
	}

	get queryValues() {
		return this.state.queryStates;
	}

	changeQuery(values: Record<string, unknown | null>) {
		return this.state.querySetter(values);
	}
}

/** Group panel의 grouping 표시와 변경만 위임하는 facade입니다. */
export class DataGridGroupPanelState {
	show?: DataGridTypes.DataGridGroupPanelConfig["show"];

	constructor(
		readonly state: DataGridState,
		config: DataGridTypes.DataGridGroupPanelConfig = {},
	) {
		this.show = config.show;
		makeAutoObservable(this, { state: false, show: false }, { autoBind: true });
	}

	changeGrouping(grouping: string[]) {
		return this.state.querySetter({
			[DATA_GRID_GROUP_BY_QUERY_KEY]: grouping,
			skip: 0,
		});
	}
}

/** Table namespace의 책임별 facade를 보관합니다. */
export class DataGridTableState {
	expanded: ExpandedState = {};
	selectedKeys = new Set<string>();
	entity: string;
	// biome-ignore lint/suspicious/noExplicitAny: DataGrid columns may carry different row TValue and edit callbacks.
	// biome-ignore lint/suspicious/noExplicitAny: DataGrid columns may carry different row TValue and edit callbacks.
	columns: DataGridTypes.DataGridColumnConfig<any>[];
	selection?: DataGridTypes.SelectionConfig;
	onRowClick?: (row: DataGridRow) => void;
	getSubRows?: (row: DataGridRow, index: number) => DataGridRow[] | undefined;
	expandRequest?: DataGridExpandRequest;
	editRequest?: DataGridTypes.DataGridEditRequest;
	onRowMove?: (event: DataGridTypes.DataGridRowMoveEvent<DataGridRow>) => void;
	emptyMessage?: string;
	readonly header: DataGridTableHeaderState;
	readonly body: DataGridTableBodyState;

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
			// biome-ignore lint/suspicious/noExplicitAny: DataGrid columns may carry different row TValue and edit callbacks.
			columns: DataGridTypes.DataGridColumnConfig<any>[];
			selection?: DataGridTypes.SelectionConfig;
			onRowClick?: (row: DataGridRow) => void;
			getSubRows?: (
				row: DataGridRow,
				index: number,
			) => DataGridRow[] | undefined;
			expandRequest?: DataGridExpandRequest;
			editRequest?: DataGridTypes.DataGridEditRequest;
			onRowMove?: (
				event: DataGridTypes.DataGridRowMoveEvent<DataGridRow>,
			) => void;
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

		return this.columns
			.filter((column) => column.rowGroup === true)
			.map(({ field }) => String(field));
	}
}

/** Table header가 sort, resize, visibility와 visible selection을 위임하는 facade입니다. */
export class DataGridTableHeaderState {
	constructor(readonly state: DataGridState) {
		makeAutoObservable(this, { state: false }, { autoBind: true });
	}

	getSelectionMode(): DataGridSelectionMode {
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
	activeRowId: string | null = null;
	overRowId: string | null = null;
	dragOffset = 0;

	constructor(readonly state: DataGridState) {
		makeAutoObservable(this, { state: false }, { autoBind: true });
	}

	get selectedKeys() {
		return Array.from(
			this.state.selection?.selectedKeys ?? this.state.table.selectedKeys,
		);
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

	changeCellValue<T extends { id: Key }, TField extends keyof T>(
		row: T,
		field: TField,
		value: T[TField],
	) {
		this.state.changes.setValue(row, field, value);
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
		onRowMove?: (event: DataGridTypes.DataGridRowMoveEvent<T>) => void,
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
	totalCount = 0;

	constructor(
		readonly state: DataGridState,
		totalCount = 0,
	) {
		this.totalCount = totalCount;
		makeAutoObservable(this, { state: false }, { autoBind: true });
	}

	toTablePaginationState(): PaginationState {
		const skip = Number(this.state.queryStates.skip) || 0;
		const pageSize = Number(this.state.queryStates.take) || 20;

		return {
			pageIndex: Math.floor(skip / pageSize),
			pageSize,
		};
	}

	changeTablePagination(nextPagination: Updater<PaginationState>) {
		const currentPagination = this.toTablePaginationState();
		const updatedPagination =
			typeof nextPagination === "function"
				? nextPagination(currentPagination)
				: nextPagination;

		return this.state.querySetter({
			skip: updatedPagination.pageIndex * updatedPagination.pageSize,
			take: updatedPagination.pageSize,
		});
	}

	setTotalCount(totalCount: number) {
		this.totalCount = totalCount;
	}
}

/** Action bar가 선택 결과만 표현하도록 제한하는 facade입니다. */
export class DataGridActionBarState {
	constructor(readonly state: DataGridState) {
		makeAutoObservable(this, { state: false }, { autoBind: true });
	}

	get selectedCount() {
		return (
			this.state.selection?.selectedKeys?.size ??
			this.state.table.selectedKeys.size
		);
	}
}
