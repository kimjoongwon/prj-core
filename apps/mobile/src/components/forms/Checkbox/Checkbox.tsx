import { Ionicons } from "@expo/vector-icons";
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from "react";
import {
	Pressable,
	PressableProps,
	TextStyle,
	View,
	ViewStyle,
} from "react-native";
import Animated, {
	Easing,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/components/contexts/ThemeContext";
import {
	baseCheckboxStyles,
	baseContainerStyles,
	baseLabelStyles,
	radiusValues,
	sizes,
	styles,
} from "@/components/forms/Checkbox/Checkbox.styles";
import { Text } from "@/components/ui/Text";

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";
export type CheckboxRadius = "none" | "sm" | "md" | "lg" | "full";

export interface CheckboxProps extends Omit<PressableProps, "style"> {
	label?: React.ReactNode;
	size?: CheckboxSize;
	color?: CheckboxColor;
	radius?: CheckboxRadius;
	isSelected?: boolean;
	defaultSelected?: boolean;
	isDisabled?: boolean;
	isIndeterminate?: boolean;
	lineThrough?: boolean;
	icon?: React.ReactNode;
	isRequired?: boolean;
	description?: string;
	errorMessage?: string;
	isInvalid?: boolean;
	onValueChange?: (isSelected: boolean) => void;
	style?: ViewStyle;
	checkboxStyle?: ViewStyle;
	labelStyle?: TextStyle;
	className?: string;
}

export interface CheckboxRef {
	toggle: () => void;
	focus: () => void;
	blur: () => void;
}

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>(
	(
		{
			label,
			size = "md",
			color = "primary",
			radius = "sm",
			isSelected: controlledSelected,
			defaultSelected = false,
			isDisabled = false,
			isIndeterminate = false,
			lineThrough = false,
			icon,
			isRequired = false,
			description,
			errorMessage,
			isInvalid = false,
			onValueChange,
			style,
			checkboxStyle,
			labelStyle,
			...props
		},
		ref,
	) => {
		const { theme } = useTheme();
		const [internalSelected, setInternalSelected] = useState(defaultSelected);
		const animatedScale = useSharedValue(1);
		const animatedOpacity = useSharedValue(0);

		const isSelected =
			controlledSelected !== undefined ? controlledSelected : internalSelected;

		useEffect(() => {
			animatedOpacity.value = withTiming(
				isSelected || isIndeterminate ? 1 : 0,
				{
					duration: 200,
					easing: Easing.bezier(0.4, 0, 0.2, 1),
				},
			);
		}, [isSelected, isIndeterminate, animatedOpacity]);

		const sizeConfig = useMemo(() => sizes[size], [size]);
		const borderRadius = useMemo(() => radiusValues[radius], [radius]);

		const colorScheme = useMemo(() => {
			const colorTokens =
				theme.colors[isInvalid ? "danger" : color] || theme.colors.default;

			return {
				selected: colorTokens.DEFAULT,
				unselected: theme.colors.default[300],
				text: theme.colors.foreground,
				icon: colorTokens.foreground || "#ffffff",
				border: isSelected ? colorTokens.DEFAULT : theme.colors.default[300],
				description: theme.colors.default[500],
				error: theme.colors.danger.DEFAULT,
			};
		}, [color, isInvalid, isSelected, theme.colors]);

		const handlePress = useCallback(() => {
			if (isDisabled) return;

			animatedScale.value = withTiming(0.95, { duration: 100 }, () => {
				animatedScale.value = withTiming(1, { duration: 100 });
			});

			const newValue = !isSelected;
			if (controlledSelected === undefined) {
				setInternalSelected(newValue);
			}
			onValueChange?.(newValue);
		}, [
			isDisabled,
			isSelected,
			controlledSelected,
			onValueChange,
			animatedScale,
		]);

		const toggle = useCallback(() => {
			if (!isDisabled) {
				handlePress();
			}
		}, [isDisabled, handlePress]);

		useImperativeHandle(
			ref,
			() => ({
				toggle,
				focus: () => {},
				blur: () => {},
			}),
			[toggle],
		);

		const checkboxAnimatedStyle = useAnimatedStyle(() => {
			return {
				transform: [{ scale: animatedScale.value }],
			};
		});

		const iconAnimatedStyle = useAnimatedStyle(() => {
			return {
				opacity: animatedOpacity.value,
				transform: [
					{
						scale: interpolate(animatedOpacity.value, [0, 1], [0.5, 1]),
					},
				],
			};
		});

		const containerStyle = useMemo((): ViewStyle => {
			const baseStyle: ViewStyle = {
				...baseContainerStyles.base,
				...(isDisabled ? baseContainerStyles.disabled : {}),
			};

			return baseStyle;
		}, [isDisabled]);

		const checkboxContainerStyle = useMemo((): ViewStyle => {
			const baseStyle: ViewStyle = {
				...baseCheckboxStyles.base,
				width: sizeConfig.checkboxSize,
				height: sizeConfig.checkboxSize,
				borderRadius,
				backgroundColor: isSelected ? colorScheme.selected : "transparent",
				borderColor: colorScheme.border,
				...(isSelected ? baseCheckboxStyles.selected : {}),
				...(isDisabled ? baseCheckboxStyles.disabled : {}),
			};

			return baseStyle;
		}, [
			sizeConfig.checkboxSize,
			borderRadius,
			isSelected,
			colorScheme,
			isDisabled,
		]);

		const labelStyleMemo = useMemo((): TextStyle => {
			return {
				...baseLabelStyles.base,
				fontSize: sizeConfig.fontSize,
				color: colorScheme.text,
				marginLeft: sizeConfig.spacing,
				...(isDisabled ? baseLabelStyles.disabled : {}),
				...(lineThrough && isSelected ? baseLabelStyles.lineThrough : {}),
			};
		}, [sizeConfig, colorScheme.text, isDisabled, lineThrough, isSelected]);

		const renderIcon = useCallback(() => {
			if (icon) {
				return icon;
			}

			if (isIndeterminate) {
				return (
					<Ionicons
						name="remove"
						size={sizeConfig.iconSize}
						color={colorScheme.icon}
					/>
				);
			}

			return (
				<Ionicons
					name="checkmark"
					size={sizeConfig.iconSize}
					color={colorScheme.icon}
				/>
			);
		}, [icon, isIndeterminate, sizeConfig.iconSize, colorScheme.icon]);

		const renderLabel = useCallback(() => {
			if (!label) return null;

			return (
				<View style={styles.labelContainer}>
					<Text
						style={labelStyle ? [labelStyleMemo, labelStyle] : labelStyleMemo}
					>
						{label}
						{isRequired && <Text style={styles.requiredStar}> *</Text>}
					</Text>
					{description && !errorMessage && (
						<Text
							style={[styles.description, { color: colorScheme.description }]}
						>
							{description}
						</Text>
					)}
					{errorMessage && (
						<Text style={[styles.errorMessage, { color: colorScheme.error }]}>
							{errorMessage}
						</Text>
					)}
				</View>
			);
		}, [
			label,
			labelStyleMemo,
			labelStyle,
			isRequired,
			description,
			errorMessage,
			colorScheme,
		]);

		return (
			<View style={[styles.container, style]}>
				<Pressable
					style={[styles.checkboxContainer, containerStyle]}
					onPress={handlePress}
					disabled={isDisabled}
					{...props}
				>
					<Animated.View
						style={[
							checkboxContainerStyle,
							checkboxStyle,
							checkboxAnimatedStyle,
						]}
					>
						<Animated.View style={iconAnimatedStyle}>
							{renderIcon()}
						</Animated.View>
					</Animated.View>

					{renderLabel()}
				</Pressable>
			</View>
		);
	},
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
