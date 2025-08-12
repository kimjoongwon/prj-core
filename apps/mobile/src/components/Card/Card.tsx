import React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { useTheme } from "../providers/theme-provider";

export type CardVariant = "flat" | "elevated" | "outlined";
export type CardRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";
export type CardShadow = "none" | "sm" | "md" | "lg";

export interface CardProps extends Omit<ViewProps, "style"> {
	children?: React.ReactNode;
	variant?: CardVariant;
	radius?: CardRadius;
	shadow?: boolean | CardShadow;
	style?: ViewStyle;
	padding?: number | "none" | "sm" | "md" | "lg" | "xl";
}

const radiusValues = {
	none: 0,
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	full: 9999,
};

const paddingValues = {
	none: 0,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
};

export const Card: React.FC<CardProps> = ({
	children,
	variant = "flat",
	radius = "md",
	shadow = false,
	style,
	padding = "md",
	...props
}) => {
	const { theme, isDark } = useTheme();

	// content1 배경색 사용
	const getBackgroundColor = () => {
		return theme.colors.content1.DEFAULT;
	};

	// default[100] 테두리 색상 사용
	const getBorderColor = () => {
		return theme.colors.default[100];
	};

	// 패딩 값 계산
	const getPaddingValue = () => {
		if (typeof padding === "number") return padding;
		return paddingValues[padding];
	};

	// 그림자 스타일
	const getShadowStyle = () => {
		if (!shadow && variant !== "elevated") return {};

		const getShadowConfig = () => {
			if (typeof shadow === "string") {
				switch (shadow) {
					case "sm":
						return { height: 2, opacity: 0.1, radius: 4, elevation: 4 };
					case "md":
						return { height: 4, opacity: 0.15, radius: 8, elevation: 8 };
					case "lg":
						return { height: 8, opacity: 0.2, radius: 16, elevation: 16 };
					case "none":
						return null;
					default:
						return { height: 4, opacity: 0.15, radius: 8, elevation: 8 };
				}
			}

			const shadowIntensity = variant === "elevated" ? "strong" : "medium";
			return shadowIntensity === "strong"
				? { height: 6, opacity: 0.15, radius: 12, elevation: 12 }
				: { height: 3, opacity: 0.1, radius: 6, elevation: 6 };
		};

		const config = getShadowConfig();
		if (!config) return {};
		
		return {
			shadowColor: "#000000",
			shadowOffset: { width: 0, height: config.height },
			shadowOpacity: isDark ? config.opacity * 1.5 : config.opacity,
			shadowRadius: config.radius,
			elevation: config.elevation,
		};
	};

	const cardStyle: ViewStyle = {
		backgroundColor: getBackgroundColor(),
		borderRadius: radiusValues[radius],
		borderColor: getBorderColor(),
		borderWidth: 1,
		padding: getPaddingValue(),
		...getShadowStyle(),
	};

	return (
		<View style={[cardStyle, style]} {...props}>
			{children}
		</View>
	);
};