import type { ChipGroupInputProps } from "./ChipGroupInput";

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

export function useHandlers(state: ChipGroupInputProps) {
	const queryKey = state.config.props?.queryKey ?? state.config.id;
	const selectedValues = getSelectedQueryValues(state.queryValues[queryKey]);
	const selectedSet = new Set(selectedValues);
	const isMultiple = Array.isArray(state.config.props?.defaultValue);

	return {
		selectedSet,
		toggleSelection(optionValue: string) {
			if (!isMultiple) {
				void state.onQueryChange({
					[queryKey]: selectedSet.has(optionValue) ? null : optionValue,
					skip: 0,
				});
				return;
			}

			const nextSelectedValues = new Set(selectedSet);
			if (nextSelectedValues.has(optionValue)) {
				nextSelectedValues.delete(optionValue);
			} else {
				nextSelectedValues.add(optionValue);
			}
			const selectedQueryValues = Array.from(nextSelectedValues);
			void state.onQueryChange({
				[queryKey]: selectedQueryValues.length > 0 ? selectedQueryValues : null,
				skip: 0,
			});
		},
	};
}
