import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { RadioGroupSize } from "@/components/forms/RadioGroup/RadioGroup";

export const sizes: Record<
	RadioGroupSize,
	{
		radioSize: number;
		fontSize: number;
		iconSize: number;
		spacing: number;
		groupSpacing: number;
	}
> = {
	sm: {
		radioSize: 16,
		fontSize: 14,
		iconSize: 6,
		spacing: 8,
		groupSpacing: 12,
	},
	md: {
		radioSize: 20,
		fontSize: 14,
		iconSize: 8,
		spacing: 10,
		groupSpacing: 16,
	},
	lg: {
		radioSize: 24,
		fontSize: 16,
		iconSize: 10,
		spacing: 12,
		groupSpacing: 20,
	},
};

export const baseGroupStyles: Record<string, ViewStyle> = {
	container: {
		flexDirection: "column",
	},
	group: {
		flexDirection: "column",
	},
	horizontal: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	disabled: {
		opacity: 0.5,
	},
};

export const baseRadioStyles: Record<string, ViewStyle> = {
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	radio: {
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderRadius: 50,
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
	groupLabel: {
		fontWeight: "600",
		marginBottom: 8,
	},
	radioLabel: {
		fontWeight: "400",
		lineHeight: 20,
	},
	description: {
		fontSize: 12,
		marginTop: 4,
		opacity: 0.6,
	},
	disabled: {
		opacity: 0.5,
	},
};

export const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
	},
	group: {
		flexDirection: "column",
	},
	horizontal: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	radioContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	horizontalRadioContainer: {
		marginRight: 16,
		marginBottom: 8,
	},
	radio: {
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderRadius: 50,
	},
	radioInner: {
		borderRadius: 50,
	},
	labelContainer: {
		flexDirection: "column",
		flex: 1,
		justifyContent: "center",
	},
	groupLabel: {
		fontWeight: "600",
		marginBottom: 8,
	},
	radioLabel: {
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
		// color는 컴포넌트에서 동적으로 설정
	},
	requiredStar: {
		// color는 컴포넌트에서 동적으로 설정
	},
});
