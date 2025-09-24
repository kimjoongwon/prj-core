import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type Theme, useTheme } from "@/components/contexts/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export type HeaderVariant = "default" | "transparent" | "elevated";

export interface HeaderAction {
	title: string;
	onPress: () => void;
	variant?: "ghost" | "solid" | "light";
	color?: "primary" | "secondary" | "default";
}

export interface HeaderProps extends NativeStackHeaderProps {
	title?: string;
	subtitle?: string;
	variant?: HeaderVariant;
	leftAction?: HeaderAction;
	rightAction?: HeaderAction;
	centerContent?: React.ReactNode;
	style?: ViewStyle;
	showStatusBar?: boolean;
	statusBarStyle?: "auto" | "inverted" | "light" | "dark";
}

export const Header: React.FC<HeaderProps> = ({
	title,
	subtitle,
	variant = "default",
	leftAction,
	rightAction,
	centerContent,
	style,
}) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const dynamicStyles = createStyles(theme, insets.top);

	const headerStyle = [
		dynamicStyles.container,
		variant === "transparent" && dynamicStyles.transparent,
		variant === "elevated" && dynamicStyles.elevated,
		style,
	];

	return (
		<View style={headerStyle}>
			<View style={dynamicStyles.content}>
				{/* 왼쪽 액션 */}
				<View style={dynamicStyles.leftSection}>
					{leftAction && (
						<Button
							variant={leftAction.variant || "ghost"}
							color={leftAction.color || "default"}
							size="sm"
							onPress={leftAction.onPress}
						>
							{leftAction.title}
						</Button>
					)}
				</View>

				{/* 중앙 컨텐츠 */}
				<View style={dynamicStyles.centerSection}>
					{centerContent ? (
						centerContent
					) : (
						<View style={dynamicStyles.titleContainer}>
							{title && (
								<Text
									variant="h6"
									style={dynamicStyles.title}
									numberOfLines={1}
								>
									{title}
								</Text>
							)}
							{subtitle && (
								<Text
									variant="caption"
									color="default"
									style={dynamicStyles.subtitle}
									numberOfLines={1}
								>
									{subtitle}
								</Text>
							)}
						</View>
					)}
				</View>

				{/* 오른쪽 액션 */}
				<View style={dynamicStyles.rightSection}>
					{rightAction && (
						<Button
							variant={rightAction.variant || "ghost"}
							color={rightAction.color || "default"}
							size="sm"
							onPress={rightAction.onPress}
						>
							{rightAction.title}
						</Button>
					)}
				</View>
			</View>
		</View>
	);
};

const createStyles = (theme: Theme, statusBarHeight: number) =>
	StyleSheet.create({
		container: {
			backgroundColor: theme.colors.background,
			paddingTop: statusBarHeight,
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.default[200],
		},
		transparent: {
			backgroundColor: "transparent",
			borderBottomWidth: 0,
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			zIndex: 1000,
		},
		elevated: {
			...Platform.select({
				ios: {
					shadowColor: theme.colors.overlay,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 4,
				},
				android: {
					elevation: 4,
				},
			}),
		},
		content: {
			flexDirection: "row",
			alignItems: "center",
			height: 56,
			paddingHorizontal: 16,
		},
		leftSection: {
			flex: 1,
			alignItems: "flex-start",
		},
		centerSection: {
			flex: 2,
			alignItems: "center",
		},
		rightSection: {
			flex: 1,
			alignItems: "flex-end",
		},
		titleContainer: {
			alignItems: "center",
		},
		title: {
			fontWeight: "600",
			textAlign: "center",
		},
		subtitle: {
			textAlign: "center",
			marginTop: 2,
		},
	});
