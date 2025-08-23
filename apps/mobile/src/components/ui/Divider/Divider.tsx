import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "@/components/contexts/ThemeContext";
import { Text } from "@/components/ui/Text";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "default" | "subtle" | "strong";

export interface DividerProps {
	orientation?: DividerOrientation;
	thickness?: number;
	color?: string;
	variant?: DividerVariant;
	children?: React.ReactNode;
	style?: ViewStyle;
	margin?: number;
}

export const Divider: React.FC<DividerProps> = ({
	orientation = "horizontal",
	thickness = 1,
	color,
	variant = "default",
	children,
	style,
	margin = 16,
}) => {
	const { theme, isDark } = useTheme();

	// 테마 기반 색상 가져오기
	const getDividerColor = () => {
		if (color) return color;

		switch (variant) {
			case "subtle":
				return isDark ? theme.colors.default[200] : theme.colors.default[200];
			case "strong":
				return isDark ? theme.colors.default[600] : theme.colors.default[700];
			case "default":
			default:
				return isDark ? theme.colors.default[300] : theme.colors.default[400];
		}
	};

	const dividerColor = getDividerColor();

	if (children) {
		return (
			<View
				style={[styles.containerWithText, { marginVertical: margin }, style]}
			>
				<View
					style={[
						styles.lineWithText,
						{
							backgroundColor: dividerColor,
							height: thickness,
						},
					]}
				/>
				<Text variant="body2" color="default" style={styles.text}>
					{children}
				</Text>
				<View
					style={[
						styles.lineWithText,
						{
							backgroundColor: dividerColor,
							height: thickness,
						},
					]}
				/>
			</View>
		);
	}

	const dividerStyle: ViewStyle =
		orientation === "horizontal"
			? {
					height: thickness,
					width: "100%",
					backgroundColor: dividerColor,
					marginVertical: margin,
				}
			: {
					width: thickness,
					height: "100%",
					backgroundColor: dividerColor,
					marginHorizontal: margin,
				};

	return <View style={[dividerStyle, style]} />;
};

const styles = StyleSheet.create({
	containerWithText: {
		flexDirection: "row",
		alignItems: "center",
	},
	lineWithText: {
		flex: 1,
	},
	text: {
		marginHorizontal: 16,
	},
});

export default Divider;
