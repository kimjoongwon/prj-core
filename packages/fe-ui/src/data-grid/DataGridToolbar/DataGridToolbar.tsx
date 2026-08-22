"use client";

import type {
	DataGridColumnConfig,
} from "@cocrepo/type";
import { DataGridColumnSettings } from "../DataGridColumnSettings";
import { InputRenderer } from "../InputRenderer";
import type { Key } from "../Table/rowKeys";
import type { DataGridToolbarState } from "../state/DataGridToolbarState";

const DATA_GRID_COLUMN_SETTINGS_INPUT_ID = "__data-grid-column-settings";

export interface DataGridToolbarProps {
	state: DataGridToolbarState;
}

export function DataGridToolbarView({ state }: DataGridToolbarProps) {
	const config = state.config;
	const columns = config.columns as DataGridColumnConfig<{ id: Key }>[];
	const leftInputs = config.leftInputs ?? [];
	const rightInputs = config.rightInputs ?? [];
	const shouldRenderColumnSettings = columns.length > 0;
	const shouldRenderToolbar =
		leftInputs.length > 0 ||
		rightInputs.length > 0 ||
		shouldRenderColumnSettings;

	if (!shouldRenderToolbar) {
		return null;
	}

	return (
		<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
			<div className="flex flex-wrap items-center gap-2">
				{leftInputs.map((input) => (
					<InputRenderer key={input.id} config={input} queryValues={state.queryValues} onQueryChange={state.changeQuery} />
				))}
			</div>
			<div className="flex items-center gap-2">
				{rightInputs.map((input) => (
					<InputRenderer key={input.id} config={input} queryValues={state.queryValues} onQueryChange={state.changeQuery} />
				))}
				{shouldRenderColumnSettings ? (
					<DataGridColumnSettings
						columns={columns}
						columnState={state.columnState}
						onColumnChange={state.changeColumns}
						key={DATA_GRID_COLUMN_SETTINGS_INPUT_ID}
					/>
				) : null}
			</div>
		</div>
	);
}
