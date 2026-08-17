import type {
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
	private setValuesDelegate: DataGridSetQueryStates;

	constructor(values: DataGridQueryStates, setValues: DataGridSetQueryStates) {
		this.values = values;
		this.setValuesDelegate = setValues;

		makeAutoObservable<this, "setValuesDelegate">(
			this,
			{
				setValuesDelegate: false,
			},
			{ autoBind: true },
		);
	}

	setValues(
		values: Record<string, unknown | null>,
		options?: { history?: "push" | "replace" },
	) {
		return this.setValuesDelegate(values, options);
	}

	sync(values: DataGridQueryStates, setValues: DataGridSetQueryStates) {
		this.values = values;
		this.setValuesDelegate = setValues;
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

		makeAutoObservable(this, {}, { autoBind: true });
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
