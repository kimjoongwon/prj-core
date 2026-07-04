"use client";

import type {
	DataGridColumnConfig,
	DataGridState,
	InputConfig,
} from "@cocrepo/type";
import { DataGridColumnSettings } from "../DataGridColumnSettings";
import { InputRenderer } from "../InputRenderer";
import { DATA_GRID_COLUMN_SETTINGS_INPUT_ID } from "../internal/constants";
import type { Key } from "../internal/rowKeys";

export interface DataGridToolbarProps<T extends { id: Key }> {
	columns: DataGridColumnConfig<T>[];
	leftInputs: InputConfig[];
	rightInputs: InputConfig[];
	state: DataGridState;
}

export function DataGridToolbarView<T extends { id: Key }>({
	columns,
	leftInputs,
	rightInputs,
	state,
}: DataGridToolbarProps<T>) {
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
					<InputRenderer key={input.id} config={input} state={state} />
				))}
			</div>
			<div className="flex items-center gap-2">
				{rightInputs.map((input) => (
					<InputRenderer key={input.id} config={input} state={state} />
				))}
				{shouldRenderColumnSettings ? (
					<DataGridColumnSettings
						columns={columns}
						state={state}
						key={DATA_GRID_COLUMN_SETTINGS_INPUT_ID}
					/>
				) : null}
			</div>
		</div>
	);
}
