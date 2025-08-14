import { Ionicons } from "@expo/vector-icons";
import React, {
	useState,
	useMemo,
	useCallback,
	forwardRef,
	useRef,
	useImperativeHandle,
	useEffect,
} from "react";
import {
	TextInput,
	TextInputProps,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native";
import { Text } from "../Text";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolate,
} from "react-native-reanimated";
import { useTheme } from "@/src/components";
import {
	sizes,
	styles,
	baseContainerStyles,
	variantStyles,
	labelStyles,
} from "./Input.styles";

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

export interface InputRef {
	focus: () => void;
	blur: () => void;
	clear: () => void;
}

export const Input = forwardRef<InputRef, InputProps>(
	(
		{
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
		},
		ref,
	) => {
		const { theme } = useTheme();
		const [isFocused, setIsFocused] = useState(false);
		const [inputValue, setInputValue] = useState(value || "");
		const animatedLabelPosition = useSharedValue(
			(value || "").length > 0 ? 1 : 0,
		);

		// Sync external value with internal state
		useEffect(() => {
			if (value !== undefined && value !== inputValue) {
				setInputValue(value);
				if (labelPlacement === "inside") {
					animatedLabelPosition.value = withTiming(value.length > 0 ? 1 : 0, {
						duration: 200,
					});
				}
			}
		}, [value, inputValue, labelPlacement, animatedLabelPosition]);
		const inputRef = useRef<TextInput>(null);

		// Memoized color scheme for performance
		const colorScheme = useMemo(() => {
			const colorTokens =
				theme.colors[isInvalid ? "danger" : color] || theme.colors.default;

			switch (variant) {
				case "flat":
					return {
						bg: theme.colors.content3.DEFAULT,
						border: isFocused ? colorTokens.DEFAULT : colorTokens[200],
						text: theme.colors.foreground,
						placeholder: colorTokens[400],
						label: colorTokens.DEFAULT,
					};
				case "bordered":
					return {
						bg: theme.colors.content3.DEFAULT,
						border: isFocused ? colorTokens.DEFAULT : colorTokens[300],
						text: theme.colors.foreground,
						placeholder: colorTokens[400],
						label: colorTokens.DEFAULT,
					};
				case "underlined":
					return {
						bg: theme.colors.content3.DEFAULT,
						border: isFocused ? colorTokens.DEFAULT : colorTokens[300],
						text: theme.colors.foreground,
						placeholder: colorTokens[400],
						label: colorTokens.DEFAULT,
					};
				case "faded":
					return {
						bg: theme.colors.content3.DEFAULT,
						border: isFocused ? colorTokens.DEFAULT : colorTokens[200],
						text: theme.colors.foreground,
						placeholder: colorTokens[400],
						label: colorTokens.DEFAULT,
					};
				default:
					return {
						bg: theme.colors.content3.DEFAULT,
						border: colorTokens[300],
						text: theme.colors.foreground,
						placeholder: colorTokens[400],
						label: colorTokens.DEFAULT,
					};
			}
		}, [color, variant, isFocused, isInvalid, theme.colors]);

		const sizeConfig = useMemo(() => sizes[size], [size]);

		const handleFocus = useCallback(
			(e: any) => {
				setIsFocused(true);
				if (labelPlacement === "inside") {
					animatedLabelPosition.value = withTiming(1, { duration: 200 });
				}
				props.onFocus?.(e);
			},
			[labelPlacement, animatedLabelPosition, props],
		);

		const handleBlur = useCallback(
			(e: any) => {
				setIsFocused(false);
				if (labelPlacement === "inside" && !inputValue && !value) {
					animatedLabelPosition.value = withTiming(0, { duration: 200 });
				}
				props.onBlur?.(e);
			},
			[labelPlacement, inputValue, value, animatedLabelPosition, props],
		);

		const handleChangeText = useCallback(
			(text: string) => {
				setInputValue(text);
				onChangeText?.(text);
			},
			[onChangeText],
		);

		const handleClear = useCallback(() => {
			setInputValue("");
			onChangeText?.("");
			if (labelPlacement === "inside") {
				animatedLabelPosition.value = withTiming(0, { duration: 200 });
			}
		}, [onChangeText, labelPlacement, animatedLabelPosition]);

		// Expose methods through ref
		useImperativeHandle(
			ref,
			() => ({
				focus: () => inputRef.current?.focus(),
				blur: () => inputRef.current?.blur(),
				clear: handleClear,
			}),
			[handleClear],
		);

		// Memoized container style for performance
		const containerStyle = useMemo((): ViewStyle => {
			const baseStyle: ViewStyle = {
				...baseContainerStyles.base,
				height: sizeConfig.height,
				paddingHorizontal: sizeConfig.paddingHorizontal,
				backgroundColor: colorScheme.bg,
			};

			if (isDisabled) {
				Object.assign(baseStyle, baseContainerStyles.disabled);
			}

			switch (variant) {
				case "bordered":
					return {
						...baseStyle,
						...variantStyles.bordered,
						...(isFocused ? variantStyles.borderedFocused : {}),
						borderColor: isFocused ? colorScheme.border : "#e4e4e7",
					};
				case "underlined":
					return {
						...baseStyle,
						...variantStyles.underlined,
						...(isFocused ? variantStyles.underlinedFocused : {}),
						borderBottomColor: isFocused ? colorScheme.border : "#e4e4e7",
					};
				case "faded":
					return {
						...baseStyle,
						...variantStyles.faded,
						borderColor: colorScheme.border,
					};
				default:
					return {
						...baseStyle,
						...variantStyles.flat,
					};
			}
		}, [sizeConfig, colorScheme, isDisabled, variant, isFocused]);

		// Memoized label styles for performance
		const labelStyleMemo = useMemo(() => {
			const colorTokens =
				theme.colors[isInvalid ? "danger" : color] || theme.colors.default;

			// 라벨 색상 로직: 포커스 시에만 색상 변경
			let labelColor: string;
			if (isFocused) {
				// 포커스 시 더 진한 색상 (700 단계)
				labelColor = colorTokens[700];
			} else {
				// 기본 상태는 테마의 default 600 색상 (더 진한 회색)
				labelColor = theme.colors.default[600];
			}

			const baseStyle: TextStyle = {
				...labelStyles.base,
				color: labelColor,
			};

			if (labelPlacement === "outside") {
				return [
					baseStyle,
					labelStyles.outside,
					{ fontSize: sizeConfig.labelFontSize },
					labelStyle,
				].filter(Boolean) as TextStyle[];
			}

			if (labelPlacement === "inside") {
				return [
					baseStyle,
					labelStyles.insideAbsolute,
					{
						left: sizeConfig.paddingHorizontal + (startContent ? 24 : 0),
					},
					labelStyle,
				].filter(Boolean) as TextStyle[];
			}

			return [baseStyle, labelStyle].filter(Boolean) as TextStyle[];
		}, [
			isFocused,
			isInvalid,
			color,
			theme.colors,
			labelPlacement,
			sizeConfig,
			startContent,
			labelStyle,
		]);

		// Animated styles for inside labels
		const animatedLabelStyle = useAnimatedStyle(() => {
			return {
				fontSize: interpolate(
					animatedLabelPosition.value,
					[0, 1],
					[sizeConfig.fontSize, sizeConfig.labelFontSize],
				),
				top: interpolate(
					animatedLabelPosition.value,
					[0, 1],
					[sizeConfig.height / 2 - sizeConfig.fontSize / 2, 4],
				),
			};
		}, [sizeConfig]);

		const renderLabel = useCallback(() => {
			if (!label) return null;

			if (labelPlacement === "outside-left") {
				return (
					<View style={styles.outsideLeftLabelContainer}>
						<Text style={labelStyleMemo}>
							{label}
							{isRequired && <Text style={styles.requiredStar}> *</Text>}
						</Text>
					</View>
				);
			}

			if (labelPlacement === "outside") {
				return (
					<Text style={labelStyleMemo}>
						{label}
						{isRequired && <Text style={styles.requiredStar}> *</Text>}
					</Text>
				);
			}

			// Inside label (animated)
			return (
				<Animated.Text
					style={[labelStyleMemo, animatedLabelStyle]}
					pointerEvents="none"
				>
					{label}
					{isRequired && <Text style={styles.requiredStar}> *</Text>}
				</Animated.Text>
			);
		}, [label, labelPlacement, labelStyleMemo, animatedLabelStyle, isRequired]);

		// Memoized input text style for performance
		const inputTextStyle = useMemo(
			(): TextStyle => ({
				flex: 1,
				fontSize: sizeConfig.fontSize,
				color: colorScheme.text,
				paddingTop:
					labelPlacement === "inside" && label && (isFocused || inputValue)
						? 16
						: 0,
			}),
			[
				sizeConfig.fontSize,
				colorScheme.text,
				labelPlacement,
				label,
				isFocused,
				inputValue,
			],
		);

		const handleContainerPress = useCallback(() => {
			if (!isDisabled && !isReadOnly) {
				// Focus the TextInput
				inputRef.current?.focus();

				// Ensure focus state is set immediately for label animation
				if (labelPlacement === "inside" && !isFocused) {
					setIsFocused(true);
					animatedLabelPosition.value = withTiming(1, { duration: 200 });
				}
			}
		}, [
			isDisabled,
			isReadOnly,
			labelPlacement,
			animatedLabelPosition,
			isFocused,
		]);

		const renderInput = useCallback(() => {
			return (
				<TouchableOpacity
					style={[containerStyle, style]}
					onPress={handleContainerPress}
					activeOpacity={0.8}
					disabled={isDisabled || isReadOnly}
				>
					{startContent && (
						<View style={styles.contentContainer}>{startContent}</View>
					)}

					<TextInput
						ref={inputRef}
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
				</TouchableOpacity>
			);
		}, [
			containerStyle,
			style,
			handleContainerPress,
			startContent,
			inputTextStyle,
			inputStyle,
			props,
			inputValue,
			handleChangeText,
			handleFocus,
			handleBlur,
			isDisabled,
			isReadOnly,
			colorScheme.placeholder,
			labelPlacement,
			isClearable,
			handleClear,
			endContent,
		]);

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
				{errorMessage && (
					<Text style={styles.errorMessage}>{errorMessage}</Text>
				)}
			</View>
		);
	},
);

Input.displayName = "Input";

export default Input;
