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

export interface TextFieldProps
	extends Omit<
		HeroTextFieldProps,
		"children" | "defaultValue" | "onBlur" | "onChange" | "value" | "variant"
	> {
	classNames?: TextFieldClassNames;
	defaultValue?: string | number;
	description?: ReactNode;
	endContent?: ReactNode;
	errorMessage?: ReactNode;
	helperText?: ReactNode;
	inputGroupProps?: Omit<HeroInputGroupProps, "children" | "variant">;
	inputProps?: Omit<
		HeroInputProps,
		"children" | "defaultValue" | "onBlur" | "onChange" | "value" | "variant"
	>;
	label?: ReactNode;
	onBlur?: (value: string | number) => void;
	onChange?: (value: string | number) => void;
	onValueChange?: (value: string) => void;
	placeholder?: HeroInputProps["placeholder"];
	startContent?: ReactNode;
	value?: string | number;
	variant?: "primary" | "secondary";
}
