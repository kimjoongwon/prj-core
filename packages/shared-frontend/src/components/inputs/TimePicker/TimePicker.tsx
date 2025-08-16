import React from "react";

export interface TimePickerProps {
	value?: string;
	onChange?: (value: string) => void;
}

export const TimePicker = (props: TimePickerProps) => {
	const { value, onChange } = props;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(event.target.value);
	};

	return (
		<input type="time" onChange={handleChange} value={value} />
	);
};
