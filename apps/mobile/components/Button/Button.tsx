import React from "react";
import {
	TouchableOpacity,
	Text,
	ActivityIndicator,
	View,
	StyleSheet,
	ViewStyle,
	TextStyle,
	TouchableOpacityProps,
} from "react-native";
import { useTheme } from "../../providers/theme-provider";

export type ButtonVariant =
	| "solid"
	| "bordered"
	| "light"
	| "flat"
	| "faded"
	| "shadow"
	| "ghost";
export type ButtonColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
	children?: React.ReactNode;
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	radius?: ButtonRadius;
	isDisabled?: boolean;
	isLoading?: boolean;
	isIconOnly?: boolean;
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	style?: ViewStyle;
	textStyle?: TextStyle;
}

const sizes = {
	sm: {
		height: 32,
		paddingHorizontal: 12,
		fontSize: 14,
		iconSize: 16,
	},
	md: {
		height: 40,
		paddingHorizontal: 16,
		fontSize: 14,
		iconSize: 18,
	},
	lg: {
		height: 48,
		paddingHorizontal: 24,
		fontSize: 16,
		iconSize: 20,
	},
};

const radiusValues = {
	none: 0,
	sm: 4,
	md: 6,
	lg: 8,
	full: 9999,
};

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "solid",
	color = "primary",
	size = "md",
	radius = "md",
	isDisabled = false,
	isLoading = false,
	isIconOnly = false,
	startContent,
	endContent,
	style,
	textStyle,
	onPress,
	...props
}) => {
	const { theme } = useTheme();
	
	// Theme-based color function
	const getColorScheme = (color: ButtonColor, variant: ButtonVariant) => {
		const colorTokens = theme.colors[color] || theme.colors.default;
		
		switch (variant) {
			case "solid":
				return {
					bg: colorTokens.DEFAULT,
					text: colorTokens.foreground,
					border: colorTokens.DEFAULT,
				};
			case "bordered":
				return {
					bg: "transparent",
					text: colorTokens.DEFAULT,
					border: colorTokens.DEFAULT,
				};
			case "light":
				return {
					bg: colorTokens[100],
					text: colorTokens[700],
					border: "transparent",
				};
			case "flat":
				return {
					bg: colorTokens[100],
					text: colorTokens[800],
					border: "transparent",
				};
			case "faded":
				return {
					bg: colorTokens[50],
					text: colorTokens[700],
					border: colorTokens[200],
				};
			case "shadow":
				return {
					bg: colorTokens.DEFAULT,
					text: colorTokens.foreground,
					border: colorTokens.DEFAULT,
				};
			case "ghost":
				return {
					bg: "transparent",
					text: colorTokens.DEFAULT,
					border: "transparent",
				};
			default:
				return {
					bg: colorTokens.DEFAULT,
					text: colorTokens.foreground,
					border: colorTokens.DEFAULT,
				};
		}
	};

	const colorScheme = getColorScheme(color, variant);
	const sizeConfig = sizes[size];
	const borderRadius = radiusValues[radius];

	const buttonStyle: ViewStyle = {
		height: sizeConfig.height,
		paddingHorizontal: isIconOnly ? 0 : sizeConfig.paddingHorizontal,
		width: isIconOnly ? sizeConfig.height : undefined,
		backgroundColor: colorScheme.bg,
		borderColor: colorScheme.border,
		borderWidth: variant === "bordered" || variant === "faded" ? 1 : 0,
		borderRadius,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		opacity: isDisabled ? parseFloat(theme.layout.disabledOpacity) : 1,
		// Add shadow for shadow variant
		...(variant === "shadow" && {
			shadowColor: colorScheme.bg,
			shadowOffset: {
				width: 0,
				height: 4,
			},
			shadowOpacity: 0.3,
			shadowRadius: 4,
			elevation: 8,
		}),
	};

	const textStyleConfig: TextStyle = {
		color: colorScheme.text,
		fontSize: sizeConfig.fontSize,
		fontWeight: "500",
		textAlign: "center",
	};

	const handlePress = (event: any) => {
		if (!isDisabled && !isLoading && onPress) {
			onPress(event);
		}
	};

	const renderContent = () => {
		if (isLoading) {
			return <ActivityIndicator size="small" color={colorScheme.text} />;
		}

		return (
			<View style={styles.contentContainer}>
				{startContent && (
					<View
						style={[styles.iconContainer, { marginRight: children ? 8 : 0 }]}
					>
						{startContent}
					</View>
				)}

				{children && !isIconOnly && (
					<Text style={[textStyleConfig, textStyle]} numberOfLines={1}>
						{children}
					</Text>
				)}

				{endContent && (
					<View
						style={[styles.iconContainer, { marginLeft: children ? 8 : 0 }]}
					>
						{endContent}
					</View>
				)}
			</View>
		);
	};

	return (
		<TouchableOpacity
			style={[buttonStyle, style]}
			onPress={handlePress}
			disabled={isDisabled || isLoading}
			activeOpacity={0.7}
			{...props}
		>
			{renderContent()}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	iconContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Button;
