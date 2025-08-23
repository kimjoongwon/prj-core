import React from "react";
import { View, type ViewStyle } from "react-native";
import { useTheme } from "@/components/contexts/ThemeContext";
import { radiusValues, sizes, styles } from "@/components/ui/Chip/Chip.styles";
import { Text } from "@/components/ui/Text";

export type ChipVariant =
	| "solid"
	| "bordered"
	| "light"
	| "flat"
	| "faded"
	| "shadow";
export type ChipColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";
export type ChipSize = "sm" | "md" | "lg";
export type ChipRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ChipProps {
	children?: React.ReactNode;
	variant?: ChipVariant;
	color?: ChipColor;
	size?: ChipSize;
	radius?: ChipRadius;
	isDisabled?: boolean;
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	avatar?: React.ReactNode;
	style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
	children,
	variant = "solid",
	color = "default",
	size = "md",
	radius = "full",
	isDisabled = false,
	startContent,
	endContent,
	avatar,
	style,
}) => {
	const { theme } = useTheme();
	const sizeConfig = sizes[size];
	const radiusValue = radiusValues[radius];

	// Color scheme generation based on variant and color
	const getColorScheme = () => {
		const colorTokens = theme.colors[color] || theme.colors.default;

		switch (variant) {
			case "solid":
				return {
					backgroundColor: colorTokens.DEFAULT,
					borderColor: colorTokens.DEFAULT,
					textColor: colorTokens.foreground,
				};
			case "bordered":
				return {
					backgroundColor: "transparent",
					borderColor: colorTokens.DEFAULT,
					textColor: colorTokens.DEFAULT,
				};
			case "light":
				return {
					backgroundColor: colorTokens[100],
					borderColor: colorTokens[200],
					textColor: colorTokens[800],
				};
			case "flat":
				return {
					backgroundColor: colorTokens[100],
					borderColor: "transparent",
					textColor: colorTokens[800],
				};
			case "faded":
				return {
					backgroundColor: colorTokens[50],
					borderColor: colorTokens[300],
					textColor: colorTokens[700],
				};
			case "shadow":
				return {
					backgroundColor: colorTokens.DEFAULT,
					borderColor: colorTokens.DEFAULT,
					textColor: colorTokens.foreground,
				};
			default:
				return {
					backgroundColor: colorTokens.DEFAULT,
					borderColor: colorTokens.DEFAULT,
					textColor: colorTokens.foreground,
				};
		}
	};

	const colorScheme = getColorScheme();

	const chipStyle: ViewStyle = {
		...styles.chip,
		height: sizeConfig.height,
		paddingHorizontal: sizeConfig.paddingHorizontal,
		borderRadius: radiusValue,
		backgroundColor: colorScheme.backgroundColor,
		borderColor: colorScheme.borderColor,
		...(variant === "shadow" && styles.shadowVariant),
		...(isDisabled && styles.disabled),
	};

	const renderStartContent = () => {
		if (avatar) {
			return (
				<View
					style={[
						styles.avatar,
						{
							width: sizeConfig.avatarSize,
							height: sizeConfig.avatarSize,
						},
					]}
				>
					{avatar}
				</View>
			);
		}

		if (startContent) {
			return <View style={styles.startContent}>{startContent}</View>;
		}

		return null;
	};

	const renderEndContent = () => {
		if (endContent) {
			return <View style={styles.endContent}>{endContent}</View>;
		}

		return null;
	};

	return (
		<View style={[chipStyle, style]}>
			{renderStartContent()}

			<Text
				style={[
					styles.chipText,
					{
						color: colorScheme.textColor,
						fontSize: sizeConfig.fontSize,
					},
				]}
				numberOfLines={1}
			>
				{children}
			</Text>

			{renderEndContent()}
		</View>
	);
};
