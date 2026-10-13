"use client";

import type { HierarchyCellProps } from "./HierarchyCell";

export function useHandlers(state: HierarchyCellProps) {
	return {
		toggleExpanded: state.onToggle,
		stopClickPropagation: (event: { stopPropagation: () => void }) =>
			event.stopPropagation(),
	};
}
