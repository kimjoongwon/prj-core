"use client";

import { action, runInAction } from "mobx";
import { useMemo } from "react";
import type { SwitchCellProps, SwitchCellState } from "./SwitchCell";

export function useHandlers(state: SwitchCellState) {
	return useMemo(
		() => ({
			syncSelection: action((isSelected: boolean) => {
				state.optimisticSelected = isSelected;
			}),
			getToggleHandler:
				(onToggle: SwitchCellProps["onToggle"], isDisabled?: boolean) =>
				async (nextSelected: boolean) => {
					if (isDisabled || state.isLoading) return;
					const previousSelected = state.optimisticSelected;
					runInAction(() => {
						state.optimisticSelected = nextSelected;
						state.isLoading = true;
					});
					try {
						await onToggle(nextSelected);
					} catch {
						runInAction(() => {
							state.optimisticSelected = previousSelected;
						});
					} finally {
						runInAction(() => {
							state.isLoading = false;
						});
					}
				},
		}),
		[state],
	);
}
