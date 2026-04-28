import type {
	MetaDataGridQueryStates,
	MetaDataGridSelectionState,
	MetaDataGridSetQueryStates,
	MetaDataGridState,
} from "@cocrepo/type";
import { makeAutoObservable } from "mobx";

export interface MetaDataGridStateModelOptions {
	queryStates: MetaDataGridQueryStates;
	setQueryStates: MetaDataGridSetQueryStates;
	selection?: MetaDataGridSelectionState;
}

export class MetaDataGridQueryStateModel {
	values: MetaDataGridQueryStates;
	private setValuesDelegate: MetaDataGridSetQueryStates;

	constructor(
		values: MetaDataGridQueryStates,
		setValues: MetaDataGridSetQueryStates,
	) {
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

	sync(values: MetaDataGridQueryStates, setValues: MetaDataGridSetQueryStates) {
		this.values = values;
		this.setValuesDelegate = setValues;
	}
}

export class MetaDataGridStateModel implements MetaDataGridState {
	query: MetaDataGridQueryStateModel;
	selection?: MetaDataGridSelectionState;

	constructor({
		queryStates,
		setQueryStates,
		selection,
	}: MetaDataGridStateModelOptions) {
		this.query = new MetaDataGridQueryStateModel(queryStates, setQueryStates);
		this.selection = selection;

		makeAutoObservable(this, {}, { autoBind: true });
	}

	syncQuery(
		queryStates: MetaDataGridQueryStates,
		setQueryStates: MetaDataGridSetQueryStates,
	) {
		this.query.sync(queryStates, setQueryStates);
	}

	syncSelection(selection?: MetaDataGridSelectionState) {
		this.selection = selection;
	}
}
