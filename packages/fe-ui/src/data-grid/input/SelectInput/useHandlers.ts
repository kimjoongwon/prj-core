import type { ChangeEvent } from "react";
import type { SelectInputProps } from "./SelectInput";

export function useHandlers(state: SelectInputProps) {
	const queryKey = state.config.props?.queryKey ?? state.config.id;
	const queryValue = state.queryValues[queryKey];

	return {
		selectedValue: typeof queryValue === "string" ? queryValue : "",
		changeSelection(event: ChangeEvent<HTMLSelectElement>) {
			const selectedValue = String(event.currentTarget.value);
			void state.onQueryChange({ [queryKey]: selectedValue || null, skip: 0 });
		},
	};
}
