import React, { useState, useRef } from "react";
import {
	TextInput,
	Text,
	View,
	StyleSheet,
	ViewStyle,
	TextStyle,
	TouchableOpacity,
	TextInputProps,
	Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../providers/theme-provider";

export type InputVariant = "flat" | "bordered" | "underlined" | "faded";
export type InputColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";
export type InputSize = "sm" | "md" | "lg";
export type LabelPlacement = "inside" | "outside" | "outside-left";

export interface InputProps extends Omit<TextInputProps, "style"> {
	variant?: InputVariant;
	color?: InputColor;
	size?: InputSize;
	label?: string;
	labelPlacement?: LabelPlacement;
	description?: string;
	errorMessage?: string;
	isRequired?: boolean;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
	isClearable?: boolean;
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	style?: ViewStyle;
	inputStyle?: TextStyle;
	labelStyle?: TextStyle;
	className?: string;
}

const sizes = {
	sm: {
		height: 32,
		paddingHorizontal: 12,
		fontSize: 14,
		labelFontSize: 12,
	},
	md: {
		height: 40,
		paddingHorizontal: 16,
		fontSize: 14,
		labelFontSize: 14,
	},
	lg: {
		height: 48,
		paddingHorizontal: 20,
		fontSize: 16,
		labelFontSize: 16,
	},
};

export const Input: React.FC<InputProps> = ({
	variant = "flat",
	color = "default",
	size = "md",
	label,
	labelPlacement = "inside",
	description,
	errorMessage,
	isRequired = false,
	isDisabled = false,
	isReadOnly = false,
	isInvalid = false,
	isClearable = false,
	startContent,
	endContent,
	style,
	inputStyle,
	labelStyle,
	value,
	onChangeText,
	...props
}) => {
	const { theme } = useTheme();
	const [isFocused, setIsFocused] = useState(false);
	const [inputValue, setInputValue] = useState(value || "");
	const animatedLabelPosition = useRef(
		new Animated.Value(value ? 1 : 0),
	).current;

	// Theme-based color function
	const getColorScheme = (color: InputColor, variant: InputVariant) => {
		const colorTokens =
			theme.colors[isInvalid ? "danger" : color] || theme.colors.default;

		switch (variant) {
			case "flat":
				return {
					bg: colorTokens[100],
					border: isFocused ? colorTokens.DEFAULT : colorTokens[200],
					text: theme.colors.foreground,
					placeholder: colorTokens[400],
					label: colorTokens.DEFAULT,
				};
			case "bordered":
				return {
					bg: "transparent",
					border: isFocused ? colorTokens.DEFAULT : colorTokens[300],
					text: theme.colors.foreground,
					placeholder: colorTokens[400],
					label: colorTokens.DEFAULT,
				};
			case "underlined":
				return {
					bg: "transparent",
					border: isFocused ? colorTokens.DEFAULT : colorTokens[300],
					text: theme.colors.foreground,
					placeholder: colorTokens[400],
					label: colorTokens.DEFAULT,
				};
			case "faded":
				return {
					bg: colorTokens[50],
					border: isFocused ? colorTokens.DEFAULT : colorTokens[200],
					text: theme.colors.foreground,
					placeholder: colorTokens[400],
					label: colorTokens.DEFAULT,
				};
			default:
				return {
					bg: colorTokens[100],
					border: colorTokens[300],
					text: theme.colors.foreground,
					placeholder: colorTokens[400],
					label: colorTokens.DEFAULT,
				};
		}
	};

	const colorScheme = getColorScheme(color, variant);
	const sizeConfig = sizes[size];

	const handleFocus = (e: any) => {
		setIsFocused(true);
		if (labelPlacement === "inside") {
			Animated.timing(animatedLabelPosition, {
				toValue: 1,
				duration: 200,
				useNativeDriver: false,
			}).start();
		}
		props.onFocus?.(e);
	};

	const handleBlur = (e: any) => {
		setIsFocused(false);
		if (labelPlacement === "inside" && !inputValue) {
			Animated.timing(animatedLabelPosition, {
				toValue: 0,
				duration: 200,
				useNativeDriver: false,
			}).start();
		}
		props.onBlur?.(e);
	};

	const handleChangeText = (text: string) => {
		setInputValue(text);
		onChangeText?.(text);
	};

	const handleClear = () => {
		setInputValue("");
		onChangeText?.("");
		if (labelPlacement === "inside") {
			Animated.timing(animatedLabelPosition, {
				toValue: 0,
				duration: 200,
				useNativeDriver: false,
			}).start();
		}
	};

	const getContainerStyle = (): ViewStyle => {
		const baseStyle: ViewStyle = {
			height: sizeConfig.height,
			paddingHorizontal: sizeConfig.paddingHorizontal,
			backgroundColor: colorScheme.bg,
			borderRadius: 8,
			flexDirection: "row",
			alignItems: "center",
			opacity: isDisabled ? 0.5 : 1,
		};

		switch (variant) {
			case "bordered":
				return {
					...baseStyle,
					borderWidth: isFocused ? 2 : 1,
					borderColor: isFocused ? colorScheme.border : "#e4e4e7",
				};
			case "underlined":
				return {
					...baseStyle,
					backgroundColor: "transparent",
					borderRadius: 0,
					borderBottomWidth: isFocused ? 2 : 1,
					borderBottomColor: isFocused ? colorScheme.border : "#e4e4e7",
					paddingHorizontal: 0,
				};
			case "faded":
				return {
					...baseStyle,
					borderWidth: 1,
					borderColor: colorScheme.border,
				};
			default:
				return baseStyle;
		}
	};

	const getLabelStyle = (): TextStyle[] => {
		const baseStyle: TextStyle = {
			color: isFocused ? colorScheme.label : "#71717a",
			fontWeight: "500",
		};

		if (labelPlacement === "inside") {
			return [
				baseStyle,
				{
					position: "absolute",
					left: sizeConfig.paddingHorizontal + (startContent ? 24 : 0),
					fontSize: animatedLabelPosition.interpolate({
						inputRange: [0, 1],
						outputRange: [sizeConfig.fontSize, sizeConfig.labelFontSize],
					}),
					top: animatedLabelPosition.interpolate({
						inputRange: [0, 1],
						outputRange: [sizeConfig.height / 2 - sizeConfig.fontSize / 2, 4],
					}),
				},
				labelStyle,
			];
		}

		return [
			baseStyle,
			{
				fontSize: sizeConfig.labelFontSize,
				marginBottom: 4,
			},
			labelStyle,
		];
	};

	const renderLabel = () => {
		if (!label) return null;

		if (labelPlacement === "outside-left") {
			return (
				<View style={styles.outsideLeftLabelContainer}>
					<Text style={getLabelStyle()}>
						{label}
						{isRequired && <Text style={styles.requiredStar}> *</Text>}
					</Text>
				</View>
			);
		}

		if (labelPlacement === "outside") {
			return (
				<Text style={getLabelStyle()}>
					{label}
					{isRequired && <Text style={styles.requiredStar}> *</Text>}
				</Text>
			);
		}

		// Inside label (animated)
		return (
			<Animated.Text style={getLabelStyle()}>
				{label}
				{isRequired && <Text style={styles.requiredStar}> *</Text>}
			</Animated.Text>
		);
	};

	const renderInput = () => {
		const containerStyle = getContainerStyle();
		const inputTextStyle: TextStyle = {
			flex: 1,
			fontSize: sizeConfig.fontSize,
			color: colorScheme.text,
			paddingTop:
				labelPlacement === "inside" && label && (isFocused || inputValue)
					? 16
					: 0,
		};

		return (
			<View style={[containerStyle, style]}>
				{startContent && (
					<View style={styles.contentContainer}>{startContent}</View>
				)}

				<TextInput
					{...props}
					style={[inputTextStyle, inputStyle]}
					value={inputValue}
					onChangeText={handleChangeText}
					onFocus={handleFocus}
					onBlur={handleBlur}
					editable={!isDisabled && !isReadOnly}
					placeholderTextColor={colorScheme.placeholder}
					placeholder={
						labelPlacement === "inside" ? undefined : props.placeholder
					}
				/>

				{isClearable && inputValue.length > 0 && (
					<TouchableOpacity onPress={handleClear} style={styles.clearButton}>
						<Ionicons name="close-circle" size={16} color="#71717a" />
					</TouchableOpacity>
				)}

				{endContent && (
					<View style={styles.contentContainer}>{endContent}</View>
				)}
			</View>
		);
	};

	if (labelPlacement === "outside-left") {
		return (
			<View style={styles.outsideLeftContainer}>
				{renderLabel()}
				<View style={styles.outsideLeftInputContainer}>
					{renderInput()}
					{description && !errorMessage && (
						<Text style={styles.description}>{description}</Text>
					)}
					{errorMessage && (
						<Text style={styles.errorMessage}>{errorMessage}</Text>
					)}
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{labelPlacement === "outside" && renderLabel()}
			<View style={styles.inputWrapper}>
				{renderInput()}
				{labelPlacement === "inside" && renderLabel()}
			</View>
			{description && !errorMessage && (
				<Text style={styles.description}>{description}</Text>
			)}
			{errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	inputWrapper: {
		position: "relative",
	},
	contentContainer: {
		marginHorizontal: 4,
	},
	clearButton: {
		padding: 4,
	},
	requiredStar: {
		color: "#f31260",
	},
	description: {
		fontSize: 12,
		color: "#71717a",
		marginTop: 4,
	},
	errorMessage: {
		fontSize: 12,
		color: "#f31260",
		marginTop: 4,
	},
	outsideLeftContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		width: "100%",
	},
	outsideLeftLabelContainer: {
		width: 100,
		marginRight: 12,
		paddingTop: 8,
	},
	outsideLeftInputContainer: {
		flex: 1,
	},
});

export default Input;
