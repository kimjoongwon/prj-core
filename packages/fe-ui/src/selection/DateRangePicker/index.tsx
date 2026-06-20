"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { Paths, PathTuple } from "@cocrepo/type";
import type { ZonedDateTime } from "@internationalized/date";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { observer } from "mobx-react-lite";

import {
	type DateRangePickerProps as BaseDateRangePickerProps,
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

		const startDateTime =
			(tools.get(state, paths[0]) as string) || new Date().toISOString();
		const endDateTime =
			(tools.get(state, paths[1]) as string) || new Date().toISOString();

		const initialValue = {
			start: parseAbsoluteToLocal(startDateTime),
			end: parseAbsoluteToLocal(endDateTime),
		};

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
				values: Record<string, unknown>,
				paths: PathTuple<T>,
			): DateRangeValue => {
				const [startPath, endPath] = paths as unknown as [string, string];
				return {
					start: parseAbsoluteToLocal(values[startPath] as string),
					end: parseAbsoluteToLocal(values[endPath] as string),
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
