"use client";

import type {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	PointerEvent,
} from "react";
import type { InputCellProps } from "./InputCell";

export function useHandlers(state: InputCellProps) {
	return {
		changeValue: (event: ChangeEvent<HTMLInputElement>) => {
			const inputValue = event.currentTarget.value;
			state.onValueChange(
				state.type === "number" && inputValue !== ""
					? Number(inputValue)
					: inputValue,
			);
		},
		completeFromKeyboard: (event: KeyboardEvent<HTMLInputElement>) => {
			event.stopPropagation();
			if (event.key === "Enter") {
				event.preventDefault();
				state.onFinish();
			}
			if (event.key === "Escape") {
				event.preventDefault();
				state.onCancel();
			}
		},
		stopMousePropagation: (
			event: MouseEvent<HTMLInputElement> | PointerEvent<HTMLInputElement>,
		) => event.stopPropagation(),
	};
}
