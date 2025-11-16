import { useFormField } from "@cocrepo/hooks";
import { tools } from "@cocrepo/toolkit";
import type { Paths, PathTuple } from "@cocrepo/types";
import type { ZonedDateTime } from "@internationalized/date";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

import {
	DateRangePickerProps as BaseDateRangePickerProps,
	DateRangePicker as DateRangePickerComponent,
} from "./DateRangePicker";

export interface DateRangePickerProps<T>
	extends Omit<BaseDateRangePickerProps, "value" | "onChange"> {
	state: T;
	paths: readonly [Paths<T, 4>, Paths<T, 4>];
}

interface DateRangeValue {
	start: ZonedDateTime;
	end: ZonedDateTime;
}

export const DateRangePicker = observer(
	<T extends object>(props: DateRangePickerProps<T>) => {
		const { state, paths, ...rest } = props;

		const initialValue = useMemo(() => {
			const startDateTime =
				tools.get(state, paths[0]) || new Date().toISOString();
			const endDateTime =
				tools.get(state, paths[1]) || new Date().toISOString();

			return {
				start: parseAbsoluteToLocal(startDateTime),
				end: parseAbsoluteToLocal(endDateTime),
			};
		}, [state, paths]);

		const formField = useFormField({
			value: initialValue,
			state,
			paths: paths as unknown as PathTuple<T>,
			// Split DateRangeValue into separate start/end date strings for state storage
			valueSplitter: (value: DateRangeValue, paths: PathTuple<T>) => {
				const [startPath, endPath] = paths as unknown as [string, string];
				return {
					[startPath]: value.start.toString(),
					[endPath]: value.end.toString(),
				};
			},
			// Aggregate start/end date strings from state into DateRangeValue
			valueAggregator: (
				values: Record<string, any>,
				paths: PathTuple<T>,
			): DateRangeValue => {
				const [startPath, endPath] = paths as unknown as [string, string];
				return {
					start: parseAbsoluteToLocal(values[startPath]),
					end: parseAbsoluteToLocal(values[endPath]),
				};
			},
		});

		const handleDateChange = (value: DateRangeValue) => {
			formField.setValue(value);
		};

		return (
			<DateRangePickerComponent
				{...rest}
				value={formField.state.value}
				onChange={handleDateChange}
			/>
		);
	},
);
