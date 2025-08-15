import { ViewProps, TextStyle, ViewStyle } from "react-native";

export type RadioGroupSize = "sm" | "md" | "lg";
export type RadioGroupColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";
export type RadioGroupOrientation = "horizontal" | "vertical";

export interface RadioOption {
	key: string;
	text: string;
	value: string;
	description?: string;
	isDisabled?: boolean;
}

export interface RadioGroupProps extends Omit<ViewProps, "style"> {
	options: RadioOption[];
	label?: string;
	name?: string;
	value?: string;
	defaultValue?: string;
	size?: RadioGroupSize;
	color?: RadioGroupColor;
	orientation?: RadioGroupOrientation;
	isDisabled?: boolean;
	isRequired?: boolean;
	isInvalid?: boolean;
	description?: string;
	errorMessage?: string;
	onValueChange?: (value: string) => void;
	style?: ViewStyle;
	groupStyle?: ViewStyle;
	labelStyle?: TextStyle;
	optionLabelStyle?: TextStyle;
	className?: string;
}

export interface RadioGroupRef {
	setValue: (value: string) => void;
	getValue: () => string | undefined;
	focus: () => void;
	blur: () => void;
}
