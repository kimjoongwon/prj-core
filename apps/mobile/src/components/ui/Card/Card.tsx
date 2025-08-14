import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";
import { useTheme } from "@/src/components";

export interface CardProps extends Omit<ViewProps, "style"> {
	children?: React.ReactNode;
	style?: ViewStyle;
	padding?: number | "sm" | "md" | "lg";
}

const paddingValues = {
	sm: 8,
	md: 16,
	lg: 24,
};

export const Card: React.FC<CardProps> = ({
	children,
	style,
	padding = "md",
	...props
}) => {
	const { theme } = useTheme();

	// 패딩 값 계산
	const getPaddingValue = () => {
		if (typeof padding === "number") return padding;
		return paddingValues[padding];
	};

	const cardStyle: ViewStyle = {
		backgroundColor: theme.colors.content1.DEFAULT,
		borderRadius: 8,
		padding: getPaddingValue(),
		borderWidth: 1,
		borderColor: theme.colors.content3.DEFAULT,
	};

	return (
		<View style={[cardStyle, style]} {...props}>
			{children}
		</View>
	);
};
