import { parseAbsoluteToLocal } from "@internationalized/date";
import { get, set } from "lodash-es";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import {
	DateRangePicker as DateRangePickerComponent,
	DateRangePickerProps as BaseDateRangePickerProps,
} from "./DateRangePicker";
import { action } from "mobx";

export interface DateRangePickerProps<T>
	extends MobxProps<T>,
		Omit<BaseDateRangePickerProps, "value" | "onChange"> {}

export const DateRangePicker = observer(
	<T extends object>(props: DateRangePickerProps<T>) => {
		const { state = {}, path = "", ...rest } = props;

		const [startPath, endPath] = useMemo(
			() => (path as string)?.split(","),
			[path],
		);

		const startDateTime = get(state, startPath) || new Date().toISOString();
		const endDateTime = get(state, endPath) || new Date().toISOString();

		const initialValue = {
			start: parseAbsoluteToLocal(startDateTime),
			end: parseAbsoluteToLocal(endDateTime),
		};

		const { localState } = useFormField({
			initialValue,
			state,
			path,
		});

		const handleDateChange = action((value: any) => {
			if (value && startPath && endPath) {
				set(state, startPath, value.start.toString());
				set(state, endPath, value.end.toString());
			}
			localState.value = value;
		});

		return (
			<DateRangePickerComponent
				{...rest}
				value={localState.value}
				onChange={handleDateChange}
			/>
		);
	},
);
