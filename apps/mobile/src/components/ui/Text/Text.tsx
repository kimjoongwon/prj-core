import React from "react";
import {
	Text as RNText,
	TextProps as RNTextProps,
	TextStyle,
} from "react-native";
import { useTheme } from "@/components/contexts/ThemeContext";

export type TextVariant =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "body1"
	| "body2"
	| "caption"
	| "overline";

export type TextColor =
	| "foreground"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger"
	| "default";

export interface TextProps extends Omit<RNTextProps, "style"> {
	children?: React.ReactNode;
	variant?: TextVariant;
	color?: TextColor;
	style?: TextStyle | TextStyle[];
}

// 타이포그래피 스타일 정의
const variantStyles: Record<TextVariant, TextStyle> = {
	h1: {
		fontSize: 32,
		fontFamily: "Pretendard-Bold",
		lineHeight: 40,
	},
	h2: {
		fontSize: 28,
		fontFamily: "Pretendard-Bold",
		lineHeight: 36,
	},
	h3: {
		fontSize: 24,
		fontFamily: "Pretendard-SemiBold",
		lineHeight: 32,
	},
	h4: {
		fontSize: 20,
		fontFamily: "Pretendard-SemiBold",
		lineHeight: 28,
	},
	h5: {
		fontSize: 18,
		fontFamily: "Pretendard-SemiBold",
		lineHeight: 24,
	},
	h6: {
		fontSize: 16,
		fontFamily: "Pretendard-SemiBold",
		lineHeight: 22,
	},
	body1: {
		fontSize: 16,
		fontFamily: "Pretendard-Regular",
		lineHeight: 24,
	},
	body2: {
		fontSize: 14,
		fontFamily: "Pretendard-Regular",
		lineHeight: 20,
	},
	caption: {
		fontSize: 12,
		fontFamily: "Pretendard-Regular",
		lineHeight: 16,
	},
	overline: {
		fontSize: 10,
		fontFamily: "Pretendard-Medium",
		lineHeight: 14,
		textTransform: "uppercase",
		letterSpacing: 1.5,
	},
};

export const Text: React.FC<TextProps> = ({
	children,
	variant = "body1",
	color = "foreground",
	style,
	...props
}) => {
	const { theme, isDark } = useTheme();

	// 테마 기반 색상 가져오기
	const getTextColor = () => {
		switch (color) {
			case "foreground":
				return theme.colors.foreground;
			case "primary":
				return theme.colors.primary.DEFAULT;
			case "secondary":
				return theme.colors.secondary.DEFAULT;
			case "success":
				return theme.colors.success.DEFAULT;
			case "warning":
				return theme.colors.warning.DEFAULT;
			case "danger":
				return theme.colors.danger.DEFAULT;
			case "default":
				return isDark ? theme.colors.default[400] : theme.colors.default[600];
			default:
				return theme.colors.foreground;
		}
	};

	const textStyle: TextStyle = {
		...variantStyles[variant],
		color: getTextColor(),
	};

	return (
		<RNText style={[textStyle, style]} {...props}>
			{children}
		</RNText>
	);
};
