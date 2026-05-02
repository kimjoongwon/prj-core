import type { DateRangePickerProps as HeroUiDateRangePickerProps } from "@cocrepo/ui/heroui";
import { DateRangePicker as HeroUiDateRangePicker } from "@cocrepo/ui/heroui";

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
