import { MobxProps } from "@shared/types";
import { PressableProps, TextStyle, ViewStyle } from "react-native";

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";
export type CheckboxRadius = "none" | "sm" | "md" | "lg" | "full";

export interface CheckboxProps<T = any>
	extends Omit<PressableProps, "style">,
		MobxProps<T> {
	children?: React.ReactNode;
	size?: CheckboxSize;
	color?: CheckboxColor;
	radius?: CheckboxRadius;
	isSelected?: boolean;
	defaultSelected?: boolean;
	isDisabled?: boolean;
	isIndeterminate?: boolean;
	lineThrough?: boolean;
	icon?: React.ReactNode;
	isRequired?: boolean;
	description?: string;
	errorMessage?: string;
	isInvalid?: boolean;
	onValueChange?: (isSelected: boolean) => void;
	style?: ViewStyle;
	checkboxStyle?: ViewStyle;
	labelStyle?: TextStyle;
	className?: string;
}

export interface CheckboxRef {
	toggle: () => void;
	focus: () => void;
	blur: () => void;
}
