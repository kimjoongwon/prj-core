import type { DateRangePickerProps as HeroUiDateRangePickerProps } from "@heroui/react";
import { DateRangePicker as HeroUiDateRangePicker } from "@heroui/react";
import { type DateValue, parseAbsoluteToLocal } from "@internationalized/date";

import { useMemo } from "react";


export interface DateRangePickerProps<T extends object>
	extends Omit<HeroUiDateRangePickerProps, 'value' | 'onChange' | 'defaultValue'>,
		 {}

export const DateRangePicker = <T extends object>(props: DateRangePickerProps<T>) => {
	const { state, path = "", ...rest } = props;

	const [startPath, endPath] = useMemo(
		() => (path as string)?.split(","),
		[path],
	);

	const startDateTime = get(state, startPath) || new Date().toISOString();
	const endDateTime = get(state, endPath) || new Date().toISOString();

	const defaultValue = {
		start: parseAbsoluteToLocal(startDateTime),
		end: parseAbsoluteToLocal(endDateTime),
	};

	const handleDateChange: HeroUiDateRangePickerProps["onChange"] = (
		value,
	) => {
		return value;
	};

	return (
		<HeroUiDateRangePicker
			{...rest}
			hideTimeZone
			onChange={handleDateChange}
			defaultValue={defaultValue}
		/>
	);
};
