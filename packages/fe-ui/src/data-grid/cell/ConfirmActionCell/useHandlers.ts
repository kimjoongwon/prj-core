"use client";

import type { ConfirmActionCellProps } from "./ConfirmActionCell";

export function useHandlers(state: ConfirmActionCellProps) {
	return {
		getConfirmButtonVariant: () =>
			(state.status ?? "danger") === "danger"
				? ("danger" as const)
				: ("primary" as const),
	};
}
