import { MobxProps } from "@shared/types";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, TextStyle, View, ViewProps, ViewStyle } from "react-native";
import Animated, {
	Easing,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/components/contexts/ThemeContext";
import {
	baseGroupStyles,
	baseLabelStyles,
	baseRadioStyles,
	sizes,
	styles,
} from "@/components/forms/RadioGroup/RadioGroup.styles";
import { Text } from "@/components/ui/Text";

export type RadioGroupSize = "sm" | "md" | "lg";
export type RadioGroupColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";
export type RadioGroupOrientation = "horizontal" | "vertical";

export interface RadioGroupProps<T = any> extends Omit<ViewProps, "style"> {
	data: T[];
	label?: string;
	name?: string;
	value?: any;
	defaultValue?: any;
	size?: RadioGroupSize;
	color?: RadioGroupColor;
	orientation?: RadioGroupOrientation;
	isDisabled?: boolean;
	isRequired?: boolean;
	isInvalid?: boolean;
	description?: string;
	errorMessage?: string;

	// Extractor functions
	keyExtractor: (item: T, index: number) => string;
	labelExtractor: (item: T, index: number) => string;
	valueExtractor: (item: T, index: number) => any;
	descriptionExtractor?: (item: T, index: number) => string;
	disabledExtractor?: (item: T, index: number) => boolean;

	// Callback
	onValueChange?: (value: any, item: T, index: number) => void;

	style?: ViewStyle;
	groupStyle?: ViewStyle;
	labelStyle?: TextStyle;
	optionLabelStyle?: TextStyle;
	className?: string;
}

// MobX RadioGroup Props
export interface MobxRadioGroupProps<T, D = any>
	extends MobxProps<T>,
		Omit<RadioGroupProps<D>, "value" | "onValueChange"> {}

export interface RadioGroupRef {
	setValue: (value: string) => void;
	getValue: () => string | undefined;
	focus: () => void;
	blur: () => void;
}

export const RadioGroup = <T = any>({
	data,
	label,
	name,
	value: controlledValue,
	defaultValue,
	size = "md",
	color = "primary",
	orientation = "vertical",
	isDisabled = false,
	isRequired = false,
	isInvalid = false,
	description,
	errorMessage,
	keyExtractor,
	labelExtractor,
	valueExtractor,
	descriptionExtractor,
	disabledExtractor,
	onValueChange,
	style,
	groupStyle,
	labelStyle,
	optionLabelStyle,
	...props
}: RadioGroupProps<T> &
	React.RefAttributes<RadioGroupRef>): React.ReactElement => {
	const { ref, ...restProps } = props;
	const { theme } = useTheme();
	const [internalValue, setInternalValue] = useState(defaultValue);

	const selectedValue =
		controlledValue !== undefined ? controlledValue : internalValue;

	const sizeConfig = useMemo(() => sizes[size], [size]);

	const colorScheme = useMemo(() => {
		const colorTokens =
			theme.colors[isInvalid ? "danger" : color] || theme.colors.default;

		return {
			label: colorTokens.DEFAULT,
			text: theme.colors.foreground,
			description: theme.colors.default[600], // 더 진한 색상으로 가독성 향상
			error: theme.colors.danger.DEFAULT,
			border: theme.colors.default[400], // 다크모드에서도 보이는 테두리 색상
		};
	}, [color, isInvalid, theme.colors]);

	const handleValueChange = useCallback(
		(newValue: any, selectedItem: T, selectedIndex: number) => {
			if (controlledValue === undefined) {
				setInternalValue(newValue);
			}

			onValueChange?.(newValue, selectedItem, selectedIndex);
		},
		[controlledValue, onValueChange],
	);

	const containerStyle = useMemo((): ViewStyle => {
		return {
			...baseGroupStyles.container,
			...(isDisabled ? baseGroupStyles.disabled : {}),
		};
	}, [isDisabled]);

	const groupContainerStyle = useMemo((): ViewStyle => {
		const baseStyle = {
			...baseGroupStyles.group,
			gap: sizeConfig.groupSpacing,
		};

		if (orientation === "horizontal") {
			return {
				...baseStyle,
				...baseGroupStyles.horizontal,
			};
		}

		return baseStyle;
	}, [orientation, sizeConfig.groupSpacing]);

	const labelStyleMemo = useMemo(() => {
		return {
			...baseLabelStyles.groupLabel,
			fontSize: sizeConfig.fontSize + 2,
			color: colorScheme.label,
		};
	}, [sizeConfig.fontSize, colorScheme.label]);

	// Radio option component
	const RadioOption: React.FC<{
		item: T;
		index: number;
		isSelected: boolean;
		onPress: () => void;
	}> = ({ item, index, isSelected, onPress }) => {
		const animatedScale = useSharedValue(1);
		const animatedOpacity = useSharedValue(isSelected ? 1 : 0);

		React.useEffect(() => {
			animatedOpacity.value = withTiming(isSelected ? 1 : 0, {
				duration: 200,
				easing: Easing.bezier(0.4, 0, 0.2, 1),
			});
		}, [isSelected, animatedOpacity]);

		const isOptionDisabled =
			isDisabled || (disabledExtractor?.(item, index) ?? false);

		const handlePress = useCallback(() => {
			if (isOptionDisabled) return;

			animatedScale.value = withTiming(0.95, { duration: 100 }, () => {
				animatedScale.value = withTiming(1, { duration: 100 });
			});

			onPress();
		}, [isOptionDisabled, onPress, animatedScale]);

		const radioAnimatedStyle = useAnimatedStyle(() => {
			return {
				transform: [{ scale: animatedScale.value }],
			};
		});

		const innerRadioAnimatedStyle = useAnimatedStyle(() => {
			return {
				opacity: animatedOpacity.value,
				transform: [
					{
						scale: interpolate(animatedOpacity.value, [0, 1], [0.3, 1]),
					},
				],
			};
		});

		const radioContainerStyle = useMemo((): ViewStyle => {
			return {
				...baseRadioStyles.radio,
				width: sizeConfig.radioSize,
				height: sizeConfig.radioSize,
				backgroundColor: "transparent",
				borderColor: isSelected ? colorScheme.label : colorScheme.border,
				...(isOptionDisabled ? baseRadioStyles.disabled : {}),
			};
		}, [
			sizeConfig.radioSize,
			isSelected,
			colorScheme.label,
			colorScheme.border,
			isOptionDisabled,
		]);

		const innerRadioStyle = useMemo((): ViewStyle => {
			return {
				width: sizeConfig.iconSize,
				height: sizeConfig.iconSize,
				backgroundColor: colorScheme.label,
				borderRadius: sizeConfig.iconSize / 2,
			};
		}, [sizeConfig.iconSize, colorScheme.label]);

		const optionLabelStyleMemo = useMemo(() => {
			return {
				fontSize: sizeConfig.fontSize,
				color: colorScheme.text,
				marginLeft: sizeConfig.spacing,
				...(isOptionDisabled ? { opacity: 0.5 } : {}),
			};
		}, [sizeConfig, colorScheme.text, isOptionDisabled]);

		const containerStyleForOption = useMemo(() => {
			const baseStyle = [styles.radioContainer];
			if (orientation === "horizontal") {
				// @ts-ignore
				baseStyle.push(styles.horizontalRadioContainer);
			}
			return baseStyle;
		}, [orientation]);

		return (
			<Pressable
				style={containerStyleForOption}
				onPress={handlePress}
				disabled={isOptionDisabled}
				accessibilityRole="radio"
				accessibilityState={{
					checked: isSelected,
					disabled: isOptionDisabled,
				}}
				accessibilityLabel={labelExtractor(item, index)}
			>
				<Animated.View style={[radioContainerStyle, radioAnimatedStyle]}>
					<Animated.View style={[innerRadioStyle, innerRadioAnimatedStyle]} />
				</Animated.View>

				<View style={styles.labelContainer}>
					<Text
						style={
							optionLabelStyle
								? [optionLabelStyleMemo, optionLabelStyle]
								: optionLabelStyleMemo
						}
					>
						{labelExtractor(item, index)}
					</Text>
					{descriptionExtractor?.(item, index) && (
						<Text
							style={[styles.description, { color: colorScheme.description }]}
						>
							{descriptionExtractor(item, index)}
						</Text>
					)}
				</View>
			</Pressable>
		);
	};

	const renderLabel = useCallback(() => {
		if (!label) return null;

		return (
			<Text style={labelStyle ? [labelStyleMemo, labelStyle] : labelStyleMemo}>
				{label}
				{isRequired && (
					<Text style={[styles.requiredStar, { color: colorScheme.error }]}> *</Text>
				)}
			</Text>
		);
	}, [label, labelStyleMemo, labelStyle, isRequired, colorScheme.error]);

	const renderOptions = useCallback(() => {
		return data.map((item, index) => {
			const itemKey = keyExtractor(item, index);
			const itemValue = valueExtractor(item, index);
			const isSelected = selectedValue === itemValue;

			return (
				<RadioOption
					key={itemKey}
					item={item}
					index={index}
					isSelected={isSelected}
					onPress={() => handleValueChange(itemValue, item, index)}
				/>
			);
		});
	}, [data, keyExtractor, valueExtractor, selectedValue, handleValueChange]);

	return (
		<View style={[styles.container, containerStyle, style]} {...restProps}>
			{renderLabel()}

			<View style={[groupContainerStyle, groupStyle]}>{renderOptions()}</View>

			{description && !errorMessage && (
				<Text style={[styles.description, { color: colorScheme.description }]}>
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
};

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
