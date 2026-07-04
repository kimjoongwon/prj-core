"use client";

import type { DataGridState, InputConfig } from "@cocrepo/type";
import { InputRenderer } from "../InputRenderer";

export interface DataGridHeaderFilterProps {
	config: InputConfig;
	state: DataGridState;
}

export function DataGridHeaderFilterView({
	config,
	state,
}: DataGridHeaderFilterProps) {
	return (
		<div className="w-full min-w-0">
			<InputRenderer config={config} state={state} />
		</div>
	);
}
