import type { TextAreaProps } from "@heroui/react";
import { Textarea as BaseTextarea } from "@heroui/react";
import React from "react";

export interface TextareaProps extends Omit<TextAreaProps, 'onChange' | 'value'> {
	value?: string;
	onChange?: (value: string) => void;
}

export const Textarea = (props: TextareaProps) => {
	const { onChange, value, ...rest } = props;

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<BaseTextarea
			{...rest}
			value={value}
			onChange={handleOnChange}
		/>
	);
};
