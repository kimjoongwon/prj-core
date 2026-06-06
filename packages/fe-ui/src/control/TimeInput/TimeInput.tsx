import { TimeField as HeroTimeField } from "@heroui/react";

export interface TimeInputProps<_T> {
	value?: unknown;
	onChange?: (value: string) => void;
	hideTimeZone?: boolean;
	[key: string]: unknown;
}

export const TimeInput = <T extends object>(props: TimeInputProps<T>) => {
	const { value, onChange, ...rest } = props;

	const handleChange = (dateValue: { toString?: () => string } | null) => {
		onChange?.(dateValue?.toString?.() || "");
	};

	return (
		<HeroTimeField
			{...(rest as object)}
			value={value as never}
			onChange={handleChange as never}
		/>
	);
};
