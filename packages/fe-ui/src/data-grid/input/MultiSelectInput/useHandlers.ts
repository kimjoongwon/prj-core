import type { MultiSelectInputProps } from "./MultiSelectInput";

function getSelectedQueryValues(queryValue: unknown) {
	if (Array.isArray(queryValue)) {
		return queryValue.filter(
			(selectedValue): selectedValue is string =>
				typeof selectedValue === "string",
		);
	}
	return typeof queryValue === "string" && queryValue.length > 0
		? [queryValue]
		: [];
}

export function useHandlers(state: MultiSelectInputProps) {
	const queryKey = state.config.props?.queryKey ?? state.config.id;
	const selectedValues = getSelectedQueryValues(state.queryValues[queryKey]);
	const selectedSet = new Set(selectedValues);

	return {
		selectedValues,
		selectedSet,
		toggleSelection(optionValue: string, isSelected: boolean) {
			const nextSelectedValues = new Set(selectedSet);
			if (isSelected) {
				nextSelectedValues.add(optionValue);
			} else {
				nextSelectedValues.delete(optionValue);
			}
			const selectedQueryValues = Array.from(nextSelectedValues);
			void state.onQueryChange({
				[queryKey]: selectedQueryValues.length > 0 ? selectedQueryValues : null,
				skip: 0,
			});
		},
	};
}
