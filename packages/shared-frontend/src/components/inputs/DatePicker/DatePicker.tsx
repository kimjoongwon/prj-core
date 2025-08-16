import {
	DatePicker as HeroUiDatePicker,
	DatePickerProps as HeroUiDatePickerProps,
} from "@heroui/react";
import type {
	CalendarDate,
	CalendarDateTime,
	ZonedDateTime,
} from "@internationalized/date";

export interface DatePickerProps<T = any>
	extends Omit<HeroUiDatePickerProps, "value" | "onChange"> {
	value?: CalendarDate | CalendarDateTime | ZonedDateTime;
	onChange?: (value: string) => void;
}

export const DatePicker = <T extends object>(props: DatePickerProps<T>) => {
	const { value, onChange, ...rest } = props;

	const handleDateChange = (
		dateValue: CalendarDate | CalendarDateTime | ZonedDateTime | null,
	) => {
		if (onChange && dateValue && "toAbsoluteString" in dateValue) {
			onChange((dateValue as ZonedDateTime).toAbsoluteString());
		}
	};

	return (
		<HeroUiDatePicker
			{...rest}
			hideTimeZone
			value={value}
			onChange={handleDateChange}
		/>
	);
};
