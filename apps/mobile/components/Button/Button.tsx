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

const colors = {
	default: {
		solid: { bg: "#e4e4e7", text: "#18181b", border: "#e4e4e7" },
		bordered: { bg: "transparent", text: "#71717a", border: "#d4d4d8" },
		light: { bg: "#f4f4f5", text: "#52525b", border: "transparent" },
		flat: { bg: "#f4f4f5", text: "#52525b", border: "transparent" },
		faded: { bg: "#f4f4f5", text: "#52525b", border: "#e4e4e7" },
		shadow: { bg: "#e4e4e7", text: "#18181b", border: "#e4e4e7" },
		ghost: { bg: "transparent", text: "#71717a", border: "transparent" },
	},
	primary: {
		solid: { bg: "#0070f3", text: "#ffffff", border: "#0070f3" },
		bordered: { bg: "transparent", text: "#0070f3", border: "#0070f3" },
		light: { bg: "#f0f9ff", text: "#0284c7", border: "transparent" },
		flat: { bg: "#e0f2fe", text: "#0369a1", border: "transparent" },
		faded: { bg: "#f0f9ff", text: "#0284c7", border: "#bae6fd" },
		shadow: { bg: "#0070f3", text: "#ffffff", border: "#0070f3" },
		ghost: { bg: "transparent", text: "#0070f3", border: "transparent" },
	},
	secondary: {
		solid: { bg: "#7c3aed", text: "#ffffff", border: "#7c3aed" },
		bordered: { bg: "transparent", text: "#7c3aed", border: "#7c3aed" },
		light: { bg: "#faf5ff", text: "#8b5cf6", border: "transparent" },
		flat: { bg: "#f3e8ff", text: "#7c3aed", border: "transparent" },
		faded: { bg: "#faf5ff", text: "#8b5cf6", border: "#ddd6fe" },
		shadow: { bg: "#7c3aed", text: "#ffffff", border: "#7c3aed" },
		ghost: { bg: "transparent", text: "#7c3aed", border: "transparent" },
	},
	success: {
		solid: { bg: "#17c964", text: "#ffffff", border: "#17c964" },
		bordered: { bg: "transparent", text: "#17c964", border: "#17c964" },
		light: { bg: "#f0fdf4", text: "#16a34a", border: "transparent" },
		flat: { bg: "#dcfce7", text: "#15803d", border: "transparent" },
		faded: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
		shadow: { bg: "#17c964", text: "#ffffff", border: "#17c964" },
		ghost: { bg: "transparent", text: "#17c964", border: "transparent" },
	},
	warning: {
		solid: { bg: "#f5a524", text: "#ffffff", border: "#f5a524" },
		bordered: { bg: "transparent", text: "#f59e0b", border: "#f59e0b" },
		light: { bg: "#fffbeb", text: "#d97706", border: "transparent" },
		flat: { bg: "#fef3c7", text: "#b45309", border: "transparent" },
		faded: { bg: "#fffbeb", text: "#d97706", border: "#fed7aa" },
		shadow: { bg: "#f5a524", text: "#ffffff", border: "#f5a524" },
		ghost: { bg: "transparent", text: "#f59e0b", border: "transparent" },
	},
	danger: {
		solid: { bg: "#f31260", text: "#ffffff", border: "#f31260" },
		bordered: { bg: "transparent", text: "#f31260", border: "#f31260" },
		light: { bg: "#fef2f2", text: "#dc2626", border: "transparent" },
		flat: { bg: "#fee2e2", text: "#b91c1c", border: "transparent" },
		faded: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
		shadow: { bg: "#f31260", text: "#ffffff", border: "#f31260" },
		ghost: { bg: "transparent", text: "#f31260", border: "transparent" },
	},
};

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
	const colorScheme = colors[color][variant];
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
		opacity: isDisabled ? 0.5 : 1,
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
