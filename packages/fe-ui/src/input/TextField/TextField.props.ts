import {
	Input as HeroInput,
	InputGroup as HeroInputGroup,
	TextField as HeroTextField,
} from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type TextFieldClassNames = Partial<
	Record<
		| "base"
		| "label"
		| "input"
		| "inputWrapper"
		| "inputGroup"
		| "prefix"
		| "suffix"
		| "description"
		| "error",
		string
	>
>;

type HeroInputProps = ComponentProps<typeof HeroInput>;
type HeroInputGroupProps = ComponentProps<typeof HeroInputGroup>;
type HeroTextFieldProps = ComponentProps<typeof HeroTextField>;

type TextFieldVariant =
	| "flat"
	| "bordered"
	| "underlined"
	| "faded"
	| "primary"
	| "secondary";

type DirectInputProps = Omit<
	HeroInputProps,
	| "children"
	| "className"
	| "classNames"
	| "defaultValue"
	| "isDisabled"
	| "isInvalid"
	| "isReadOnly"
	| "isRequired"
	| "onBlur"
	| "onChange"
	| "onFocus"
	| "placeholder"
	| "size"
	| "type"
	| "value"
	| "variant"
>;

export interface TextFieldProps
	extends Omit<
			HeroTextFieldProps,
			| "children"
			| "defaultValue"
			| "onBlur"
			| "onChange"
			| "onFocus"
			| "placeholder"
			| "type"
			| "value"
			| "variant"
			| keyof DirectInputProps
		>,
		DirectInputProps {
	classNames?: TextFieldClassNames;
	defaultValue?: string | number;
	description?: ReactNode;
	endContent?: ReactNode;
	errorMessage?: ReactNode;
	helperText?: ReactNode;
	inputGroupProps?: Omit<HeroInputGroupProps, "children" | "variant">;
	inputProps?: Omit<
		HeroInputProps,
		| "children"
		| "defaultValue"
		| "onBlur"
		| "onChange"
		| "onFocus"
		| "value"
		| "variant"
	>;
	isClearable?: boolean;
	labelPlacement?: string;
	label?: ReactNode;
	onBlur?: (value: string | number) => void;
	onChange?: (value: string | number) => void;
	onClear?: () => void;
	onFocus?: (value: string | number) => void;
	onValueChange?: (value: string) => void;
	placeholder?: HeroInputProps["placeholder"];
	size?: "sm" | "md" | "lg";
	startContent?: ReactNode;
	type?: HeroInputProps["type"];
	value?: string | number;
	variant?: TextFieldVariant;
}
