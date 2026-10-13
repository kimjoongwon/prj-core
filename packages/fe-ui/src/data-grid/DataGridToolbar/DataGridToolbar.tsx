"use client";

import type { DataGridSetQueryStates, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { DataGridQueryState } from "../DataGrid";
import { InputRenderer } from "../input/InputRenderer";
import { useHandlers } from "./useHandlers";

/** Toolbar의 입력 설정과 공유 query 데이터입니다. */
export interface DataGridToolbarState {
	leftInputs: InputConfig[];
	rightInputs: InputConfig[];
	query: DataGridQueryState;
	querySetter: DataGridSetQueryStates;
}
export interface DataGridToolbarProps {
	state: DataGridToolbarState;
}

export const DataGridToolbar = observer(({ state }: DataGridToolbarProps) => {
	const handlers = useHandlers(state);
	if (!handlers.shouldRender) return null;
	return (
		<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
			<div className="flex flex-wrap items-center gap-2">
				{state.leftInputs.map((input) => (
					<InputRenderer
						key={input.id}
						config={input}
						queryValues={handlers.queryValues}
						onQueryChange={handlers.changeQuery}
					/>
				))}
			</div>
			<div className="flex items-center gap-2">
				{state.rightInputs.map((input) => (
					<InputRenderer
						key={input.id}
						config={input}
						queryValues={handlers.queryValues}
						onQueryChange={handlers.changeQuery}
					/>
				))}
			</div>
		</div>
	);
});
