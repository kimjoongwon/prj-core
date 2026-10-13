"use client";

import type { DataGridQueryState, InputConfig } from "@cocrepo/type";
import { InputRenderer } from "../InputRenderer";

export interface ColumnFilterInputProps {
	config: InputConfig;
	queryValues: DataGridQueryState;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

export function ColumnFilterInput({
	config,
	queryValues,
	onQueryChange,
}: ColumnFilterInputProps) {
	return (
		<div className="w-full min-w-0">
			<InputRenderer
				config={config}
				queryValues={queryValues}
				onQueryChange={onQueryChange}
			/>
		</div>
	);
}
