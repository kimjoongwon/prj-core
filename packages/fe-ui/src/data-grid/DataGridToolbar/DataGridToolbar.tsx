"use client";

import type { DataGridColumnSettingItem, InputConfig } from "@cocrepo/type";
import type { RowData, Table as TanStackTable } from "@tanstack/react-table";
import { DataGridColumnSettings } from "../DataGridColumnSettings";
import { InputRenderer } from "../input/InputRenderer";
import type { DataGridToolbarState } from "../state/DataGridToolbarState";

const DATA_GRID_COLUMN_SETTINGS_INPUT_ID = "__data-grid-column-settings";

export interface DataGridToolbarProps<TData extends RowData> {
	state: DataGridToolbarState;
	leftInputs?: InputConfig[];
	rightInputs?: InputConfig[];
	settingsColumns: DataGridColumnSettingItem[];
	table: TanStackTable<TData>;
}

export function DataGridToolbarView<TData extends RowData>({
	state,
	leftInputs = [],
	rightInputs = [],
	settingsColumns,
	table,
}: DataGridToolbarProps<TData>) {
	const shouldRenderColumnSettings = settingsColumns.length > 0;
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
				{shouldRenderColumnSettings ? (
					<DataGridColumnSettings
						columns={settingsColumns}
						table={table}
						key={DATA_GRID_COLUMN_SETTINGS_INPUT_ID}
					/>
				) : null}
			</div>
		</div>
	);
}
