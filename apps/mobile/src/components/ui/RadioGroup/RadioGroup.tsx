import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useMemo,
	useState,
} from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Animated, {
	Easing,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../providers/theme-provider";
import { Text } from "../Text";
import { RadioGroupProps, RadioGroupRef, RadioOption } from "./types";
import {
	sizes,
	baseGroupStyles,
	baseLabelStyles,
	baseRadioStyles,
	styles,
} from "./RadioGroup.styles";

export const RadioGroup = forwardRef<RadioGroupRef, RadioGroupProps>(
	(
		{
			options,
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
			onValueChange,
			style,
			groupStyle,
			labelStyle,
			optionLabelStyle,
			...props
		},
		ref,
	) => {
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
				description: theme.colors.default[500],
				error: theme.colors.danger.DEFAULT,
			};
		}, [color, isInvalid, theme.colors]);

		const handleValueChange = useCallback(
			(newValue: string) => {
				if (controlledValue === undefined) {
					setInternalValue(newValue);
				}
				onValueChange?.(newValue);
			},
			[controlledValue, onValueChange],
		);

		const setValue = useCallback(
			(newValue: string) => {
				handleValueChange(newValue);
			},
			[handleValueChange],
		);

		const getValue = useCallback(() => {
			return selectedValue;
		}, [selectedValue]);

		useImperativeHandle(
			ref,
			() => ({
				setValue,
				getValue,
				focus: () => {},
				blur: () => {},
			}),
			[setValue, getValue],
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
			option: RadioOption;
			isSelected: boolean;
			onPress: () => void;
		}> = ({ option, isSelected, onPress }) => {
			const animatedScale = useSharedValue(1);
			const animatedOpacity = useSharedValue(isSelected ? 1 : 0);

			React.useEffect(() => {
				animatedOpacity.value = withTiming(isSelected ? 1 : 0, {
					duration: 200,
					easing: Easing.bezier(0.4, 0, 0.2, 1),
				});
			}, [isSelected, animatedOpacity]);

			const isOptionDisabled = isDisabled || option.isDisabled;

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
					borderColor: isSelected
						? colorScheme.label
						: theme.colors.default[300],
					...(isOptionDisabled ? baseRadioStyles.disabled : {}),
				};
			}, [
				sizeConfig.radioSize,
				isSelected,
				colorScheme.label,
				theme.colors.default,
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
					accessibilityLabel={option.text}
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
							{option.text}
						</Text>
						{option.description && (
							<Text
								style={[styles.description, { color: colorScheme.description }]}
							>
								{option.description}
							</Text>
						)}
					</View>
				</Pressable>
			);
		};

		const renderLabel = useCallback(() => {
			if (!label) return null;

			return (
				<Text
					style={labelStyle ? [labelStyleMemo, labelStyle] : labelStyleMemo}
				>
					{label}
					{isRequired && <Text style={styles.requiredStar}> *</Text>}
				</Text>
			);
		}, [label, labelStyleMemo, labelStyle, isRequired]);

		const renderOptions = useCallback(() => {
			return options.map((option) => (
				<RadioOption
					key={option.key}
					option={option}
					isSelected={selectedValue === option.value}
					onPress={() => handleValueChange(option.value)}
				/>
			));
		}, [options, selectedValue, handleValueChange]);

		return (
			<View style={[styles.container, containerStyle, style]} {...props}>
				{renderLabel()}

				<View style={[groupContainerStyle, groupStyle]}>{renderOptions()}</View>

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
	},
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
