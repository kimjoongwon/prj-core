"use client";

import type { MouseEvent } from "react";
import type { SelectionCellProps } from "./SelectionCell";

export function useHandlers<T>(state: SelectionCellProps<T>) {
	return {
		toggleSelection: state.row.getToggleSelectedHandler(),
		stopClickPropagation: (event: MouseEvent<HTMLInputElement>) =>
			event.stopPropagation(),
	};
}
