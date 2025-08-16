import {
	Input as HeroUiInput,
	type InputProps as HeroUiInputProps,
} from "@heroui/react";
import { ChangeEventHandler } from "react";
import { Validation } from "../../../types";

export interface InputProps extends Omit<HeroUiInputProps, 'onChange' | 'onBlur' | 'value'> {
	validation?: Validation;
	value?: string | number;
	onChange?: (value: string | number) => void;
	onBlur?: (value: string | number) => void;
}

export const Input = (props: InputProps) => {
	const {
		onChange,
		onBlur,
		errorMessage = " ",
		type,
		size = "sm",
		validation,
		value = "",
		...rest
	} = props;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (type === "number" && typeof Number(e.target.value) === "number") {
			onChange?.(Number(e.target.value));
			return;
		}

		onChange?.(e.target.value);
	};

	const handleOnBlur: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (type === "number" && typeof Number(e.target.value) === "number") {
			onBlur?.(Number(e.target.value));
		} else {
			onBlur?.(e.target.value);
		}
	};

	return (
		<HeroUiInput
			{...rest}
			type={type}
			size={size}
			onChange={handleChange}
			onBlur={handleOnBlur}
			errorMessage={errorMessage}
			value={String(value)}
		/>
	);
};
