import type { ChangeEvent } from "react";
import type { DateRangeInputProps } from "./DateRangeInput";

function getDateQueryValue(queryValue: unknown) {
	return typeof queryValue === "string" ? queryValue : "";
}

export function useHandlers(state: DateRangeInputProps) {
	const startKey =
		state.config.props?.queryKeys?.start ?? `${state.config.id}Start`;
	const endKey = state.config.props?.queryKeys?.end ?? `${state.config.id}End`;
	const changeDateQuery = (queryKey: string, dateValue: string | number) => {
		const selectedDate = String(dateValue);
		void state.onQueryChange({
			[queryKey]: selectedDate.length > 0 ? selectedDate : null,
			skip: 0,
		});
	};

	return {
		startValue: getDateQueryValue(state.queryValues[startKey]),
		endValue: getDateQueryValue(state.queryValues[endKey]),
		changeStartDate(event: ChangeEvent<HTMLInputElement>) {
			changeDateQuery(startKey, event.currentTarget.value);
		},
		changeEndDate(event: ChangeEvent<HTMLInputElement>) {
			changeDateQuery(endKey, event.currentTarget.value);
		},
	};
}
