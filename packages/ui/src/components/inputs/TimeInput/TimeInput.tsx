import {
	TimeInputProps as HeroUiTimeInputProps,
	TimeInput as NextUiTimeInput,
} from "@heroui/react";

export interface TimeInputProps<T>
	extends Omit<HeroUiTimeInputProps, "onChange"> {
	onChange?: (value: string) => void;
}

export const TimeInput = <T extends object>(props: TimeInputProps<T>) => {
	const { value, onChange, ...rest } = props;

	const handleChange: HeroUiTimeInputProps["onChange"] = (dateValue) => {
		if (onChange) {
			onChange(dateValue?.toString() || "");
		}
	};

	return (
		<NextUiTimeInput
			{...rest}
			hideTimeZone
			value={value}
			onChange={handleChange}
		/>
	);
};
