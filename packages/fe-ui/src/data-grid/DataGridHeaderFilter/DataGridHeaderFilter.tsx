"use client";

import type { DataGridQueryStates, InputConfig } from "@cocrepo/type";
import { InputRenderer } from "../InputRenderer";

export interface DataGridHeaderFilterProps {
	config: InputConfig;
	queryValues: DataGridQueryStates;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

export function DataGridHeaderFilterView({
	config,
	queryValues,
	onQueryChange,
}: DataGridHeaderFilterProps) {
	return (
		<div className="w-full min-w-0">
			<InputRenderer config={config} queryValues={queryValues} onQueryChange={onQueryChange} />
		</div>
	);
}
