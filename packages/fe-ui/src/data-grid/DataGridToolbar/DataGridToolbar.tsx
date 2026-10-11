"use client";

import type { InputConfig } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import type { DataGridState } from "../DataGrid";
import { InputRenderer } from "../input/InputRenderer";

const emptyInputConfigs: InputConfig[] = [];

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

export interface DataGridToolbarProps {
	state: DataGridToolbarState;
	leftInputs?: InputConfig[];
	rightInputs?: InputConfig[];
}

export function DataGridToolbarView({
	state,
	leftInputs = [],
	rightInputs = [],
}: DataGridToolbarProps) {
	const shouldRenderToolbar = leftInputs.length > 0 || rightInputs.length > 0;

	if (!shouldRenderToolbar) {
		return null;
	}

	return (
		<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
			<div className="flex flex-wrap items-center gap-2">
				{leftInputs.map((input) => (
					<InputRenderer
						key={input.id}
						config={input}
						queryValues={state.queryValues}
						onQueryChange={state.changeQuery}
					/>
				))}
			</div>
			<div className="flex items-center gap-2">
				{rightInputs.map((input) => (
					<InputRenderer
						key={input.id}
						config={input}
						queryValues={state.queryValues}
						onQueryChange={state.changeQuery}
					/>
				))}
			</div>
		</div>
	);
}

export const DataGridToolbar = observer(
	DataGridToolbarView,
) as typeof DataGridToolbarView;
