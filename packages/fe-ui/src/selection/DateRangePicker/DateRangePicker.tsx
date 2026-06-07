import { DateRangePicker as HeroUiDateRangePicker } from "@heroui/react";

type DateRangePickerChangeHandler = {
	bivarianceHack(value: unknown): void;
}["bivarianceHack"];

export interface DateRangePickerProps {
	value?: unknown;
	onChange?: DateRangePickerChangeHandler;
	[key: string]: unknown;
}

export const DateRangePicker = (props: DateRangePickerProps) => {
	const { value, onChange, ...rest } = props;

	const handleDateChange = (value: unknown) => {
		onChange?.(value);
	};

	return (
			<HeroUiDateRangePicker
				{...(rest as object)}
				hideTimeZone
				value={value as never}
				onChange={handleDateChange as never}
			/>
	);
};
