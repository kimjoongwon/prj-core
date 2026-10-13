"use client";

import type { ChangeEvent, KeyboardEvent } from "react";
import type { EditorCellProps } from "./EditorCell";

export function getEditorTextValue(editorValue: unknown) {
	return editorValue == null ? "" : String(editorValue);
}

export function useHandlers<TData, TValue>(
	state: EditorCellProps<TData, TValue>,
) {
	return {
		getEditorPresentation: () => {
			const editorType = state.config.type;
			const selectedValues = new Set(
				Array.isArray(state.context.value)
					? state.context.value.map(String)
					: [getEditorTextValue(state.context.value)],
			);
			return {
				options: state.config.options ?? [],
				textValue: getEditorTextValue(state.context.value),
				selectedValues: Array.from(selectedValues),
				datalistId: `data-grid-editor-${state.context.field.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
				inputType:
					editorType === "number"
						? "number"
						: editorType === "date"
							? "date"
							: editorType === "date-time"
								? "datetime-local"
								: "text",
			};
		},
		completeFromKeyboard: (
			event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
		) => {
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopPropagation();
				state.context.onCancel();
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				event.stopPropagation();
				state.context.onFinish();
				return;
			}
			if (event.key === "Tab") {
				state.context.onFinish(event.shiftKey ? "previous" : "next");
			}
		},
		changeBoolean: (event: ChangeEvent<HTMLInputElement>) => {
			state.context.onValueChange(event.currentTarget.checked as TValue);
			state.context.onFinish();
		},
		changeSelection: (event: ChangeEvent<HTMLSelectElement>) => {
			const selectedValue =
				state.config.type === "multi-select"
					? Array.from(event.currentTarget.selectedOptions).map(
							(option) => option.value,
						)
					: event.currentTarget.value;
			state.context.onValueChange(selectedValue as TValue);
			state.context.onFinish();
		},
		changeInput: (event: ChangeEvent<HTMLInputElement>) => {
			const inputValue = event.currentTarget.value;
			const normalizedValue =
				state.config.type === "number" && inputValue !== ""
					? Number(inputValue)
					: inputValue;
			state.context.onValueChange(normalizedValue as TValue);
		},
		finishFromBlur: () => state.context.onFinish(),
	};
}
