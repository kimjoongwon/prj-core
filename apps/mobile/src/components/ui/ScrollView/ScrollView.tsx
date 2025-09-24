import React from "react";
import {
	ScrollView as RNScrollView,
	ScrollViewProps as RNScrollViewProps,
	ViewStyle,
} from "react-native";
import { useTheme } from "@/components/contexts/ThemeContext";

export type ScrollViewVariant =
	| "default"
	| "content1"
	| "content2"
	| "content3"
	| "content4";

export interface ScrollViewProps extends RNScrollViewProps {
	children?: React.ReactNode;
	variant?: ScrollViewVariant;
	style?: ViewStyle | ViewStyle[];
	contentContainerStyle?: ViewStyle | (ViewStyle | undefined)[];
}

export const ScrollView: React.FC<ScrollViewProps> = ({
	children,
	variant = "default",
	style,
	contentContainerStyle,
	...props
}) => {
	const { theme } = useTheme();

	// 테마 기반 배경색 가져오기
	const getBackgroundColor = () => {
		switch (variant) {
			case "content1":
				return theme.colors.content1.DEFAULT;
			case "content2":
				return theme.colors.content2.DEFAULT;
			case "content3":
				return theme.colors.content3.DEFAULT;
			case "content4":
				return theme.colors.content4.DEFAULT;
			default:
				return theme.colors.background;
		}
	};

	const scrollViewStyle: ViewStyle = {
		backgroundColor: getBackgroundColor(),
	};

	return (
		<RNScrollView
			style={[scrollViewStyle, style]}
			contentContainerStyle={contentContainerStyle}
			{...props}
		>
			{children}
		</RNScrollView>
	);
};
