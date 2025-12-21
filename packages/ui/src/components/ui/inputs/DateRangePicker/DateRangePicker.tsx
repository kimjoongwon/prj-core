import type { DateRangePickerProps as HeroUiDateRangePickerProps } from "@heroui/react";
import { DateRangePicker as HeroUiDateRangePicker } from "@heroui/react";

export interface DateRangePickerProps
	extends Omit<HeroUiDateRangePickerProps, "value" | "onChange"> {
	value?: any;
	onChange?: (value: any) => void;
}

export const DateRangePicker = (props: DateRangePickerProps) => {
	const { value, onChange, ...rest } = props;

	const handleDateChange: HeroUiDateRangePickerProps["onChange"] = (value) => {
		onChange?.(value);
	};

	return (
		<HeroUiDateRangePicker
			{...rest}
			hideTimeZone
			value={value}
			onChange={handleDateChange}
		/>
	);
};
