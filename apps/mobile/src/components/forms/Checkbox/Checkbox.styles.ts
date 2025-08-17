import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { CheckboxSize } from "./Checkbox";

export const sizes: Record<
	CheckboxSize,
	{
		checkboxSize: number;
		fontSize: number;
		iconSize: number;
		spacing: number;
	}
> = {
	sm: {
		checkboxSize: 16,
		fontSize: 14,
		iconSize: 10,
		spacing: 8,
	},
	md: {
		checkboxSize: 20,
		fontSize: 14,
		iconSize: 12,
		spacing: 10,
	},
	lg: {
		checkboxSize: 24,
		fontSize: 16,
		iconSize: 16,
		spacing: 12,
	},
};

export const radiusValues = {
	none: 0,
	sm: 2,
	md: 4,
	lg: 6,
	full: 9999,
};

export const baseContainerStyles: Record<string, ViewStyle> = {
	base: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
	disabled: {
		opacity: 0.5,
	},
};

export const baseCheckboxStyles: Record<string, ViewStyle> = {
	base: {
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		position: "relative",
	},
	selected: {
		borderWidth: 0,
	},
	disabled: {
		opacity: 0.5,
	},
};

export const baseLabelStyles: Record<string, TextStyle> = {
	base: {
		fontWeight: "400",
		lineHeight: 20,
	},
	disabled: {
		opacity: 0.5,
	},
	lineThrough: {
		textDecorationLine: "line-through",
	},
};

export const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	checkbox: {
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
	},
	labelContainer: {
		flexDirection: "column",
		flex: 1,
	},
	label: {
		fontWeight: "400",
	},
	description: {
		fontSize: 12,
		marginTop: 4,
		opacity: 0.6,
	},
	errorMessage: {
		fontSize: 12,
		marginTop: 4,
		color: "#f31260",
	},
	requiredStar: {
		color: "#f31260",
	},
});
