import React from "react";
import { ViewStyle } from "react-native";

export type ChipVariant = "solid" | "bordered" | "light" | "flat" | "faded" | "shadow";
export type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
export type ChipSize = "sm" | "md" | "lg";
export type ChipRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ChipProps {
	children?: React.ReactNode;
	variant?: ChipVariant;
	color?: ChipColor;
	size?: ChipSize;
	radius?: ChipRadius;
	isDisabled?: boolean;
	isClosable?: boolean;
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	avatar?: React.ReactNode;
	onClose?: () => void;
	onPress?: () => void;
	style?: ViewStyle;
	className?: string;
}