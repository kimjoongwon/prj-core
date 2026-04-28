import type {
	DataGridQueryStates,
	DataGridSelectionState,
	DataGridSetQueryStates,
	DataGridState,
} from "@cocrepo/type";
import { makeAutoObservable } from "mobx";

export interface DataGridStateModelOptions {
	queryStates: DataGridQueryStates;
	setQueryStates: DataGridSetQueryStates;
	selection?: DataGridSelectionState;
}

export class DataGridSelectionStateModel implements DataGridSelectionState {
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

export class DataGridQueryStateModel {
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

export class DataGridStateModel implements DataGridState {
	query: DataGridQueryStateModel;
	selection?: DataGridSelectionState;

	constructor({
		queryStates,
		setQueryStates,
		selection,
	}: DataGridStateModelOptions) {
		this.query = new DataGridQueryStateModel(queryStates, setQueryStates);
		this.selection = selection;

		makeAutoObservable(this, {}, { autoBind: true });
	}

	syncQuery(
		queryStates: DataGridQueryStates,
		setQueryStates: DataGridSetQueryStates,
	) {
		this.query.sync(queryStates, setQueryStates);
	}

	syncSelection(selection?: DataGridSelectionState) {
		this.selection = selection;
	}
}
