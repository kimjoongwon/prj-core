import React, { useEffect } from "react";
import {
	TouchableOpacity,
	View,
	Image,
	ViewStyle,
} from "react-native";
import { Text } from "../Text";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	interpolateColor,
	interpolate,
} from "react-native-reanimated";
import { styles, sizes } from "./ListItem.styles";
import { useTheme } from "../../providers/theme-provider";

export type ListItemVariant = "default" | "card" | "simple";
export type ListItemSize = "sm" | "md" | "lg";

export interface ListItemProps {
	title: string;
	description?: string;
	imageUrl?: string;
	variant?: ListItemVariant;
	size?: ListItemSize;
	isSelected?: boolean;
	onPress?: () => void;
	disabled?: boolean;
	showAnimation?: boolean;
	showCheckbox?: boolean;
	showImage?: boolean;
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = (props) => {
	const {
		title,
		description,
		imageUrl,
		variant = "default",
		size = "md",
		isSelected = false,
		onPress,
		disabled = false,
		showAnimation = true,
		showCheckbox = false,
		showImage = true,
		startContent,
		endContent,
		style,
	} = props;
	const { theme } = useTheme();
	const sizeConfig = sizes[size];

	// Animation values
	const scaleValue = useSharedValue(1);
	const selectionProgress = useSharedValue(isSelected ? 1 : 0);
	const pressProgress = useSharedValue(0);

	useEffect(() => {
		if (showAnimation) {
			selectionProgress.value = withSpring(isSelected ? 1 : 0, {
				damping: 20,
				stiffness: 300,
			});
		} else {
			selectionProgress.value = isSelected ? 1 : 0;
		}
	}, [isSelected, showAnimation]);

	const handlePressIn = () => {
		pressProgress.value = withSpring(1, { damping: 15 });
		scaleValue.value = withSpring(0.98, { damping: 15 });
	};

	const handlePressOut = () => {
		pressProgress.value = withSpring(0, { damping: 15 });
		scaleValue.value = withSpring(1, { damping: 15 });
	};

	// Animated styles
	const animatedContainerStyle = useAnimatedStyle(() => {
		const backgroundColor = interpolateColor(
			selectionProgress.value,
			[0, 1],
			[theme.colors.content1.DEFAULT, theme.colors.primary[50]],
		);

		const borderColor = interpolateColor(
			selectionProgress.value,
			[0, 1],
			[theme.colors.content3.DEFAULT, theme.colors.primary.DEFAULT],
		);

		const shadowOpacity = interpolate(
			pressProgress.value,
			[0, 1],
			[variant === "card" ? 0.1 : 0, variant === "card" ? 0.15 : 0],
		);

		return {
			backgroundColor,
			borderColor,
			transform: [{ scale: scaleValue.value }],
			shadowOpacity,
		};
	});

	const animatedCheckboxStyle = useAnimatedStyle(() => {
		const backgroundColor = interpolateColor(
			selectionProgress.value,
			[0, 1],
			["transparent", theme.colors.primary.DEFAULT],
		);

		const borderColor = interpolateColor(
			selectionProgress.value,
			[0, 1],
			[theme.colors.content3.DEFAULT, theme.colors.primary.DEFAULT],
		);

		const scale = interpolate(selectionProgress.value, [0, 1], [0.8, 1]);

		return {
			backgroundColor,
			borderColor,
			transform: [{ scale }],
		};
	});

	const renderImageOrPlaceholder = () => {
		// showImage가 false이거나 imageUrl이 없으면 아무것도 렌더링하지 않음
		if (!showImage || !imageUrl) return null;

		const imageStyle = {
			width: sizeConfig.imageSize,
			height: sizeConfig.imageSize,
		};

		return (
			<View style={[styles.imageContainer, imageStyle]}>
				<Image source={{ uri: imageUrl }} style={styles.image} />
			</View>
		);
	};

	const renderCheckbox = () => {
		if (!showCheckbox) return null;

		const checkboxStyle = {
			width: sizeConfig.checkboxSize,
			height: sizeConfig.checkboxSize,
		};

		return (
			<Animated.View
				style={[styles.checkboxContainer, checkboxStyle, animatedCheckboxStyle]}
			>
				{isSelected && (
					<Text
						style={[
							styles.checkIcon,
							{
								color: theme.colors.primary.foreground,
								fontSize: sizeConfig.checkboxSize * 0.6,
							},
						]}
					>
						✓
					</Text>
				)}
			</Animated.View>
		);
	};

	const containerStyle: ViewStyle = {
		...styles.container,
		minHeight: sizeConfig.height,
		paddingHorizontal: sizeConfig.paddingHorizontal,
		paddingVertical: sizeConfig.paddingVertical,
		...(variant === "card" && styles.cardVariant),
		...(variant === "simple" && styles.simpleVariant),
	};

	return (
		<Animated.View style={[animatedContainerStyle, containerStyle, style]}>
			<TouchableOpacity
				style={styles.contentWrapper}
				onPress={onPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				disabled={disabled}
				activeOpacity={1}
			>
				{startContent && (
					<View style={styles.startContent}>{startContent}</View>
				)}

				{renderImageOrPlaceholder()}

				<View style={styles.textContainer}>
					<Text
						style={[
							styles.title,
							{
								color: theme.colors.foreground,
								fontSize: sizeConfig.titleFontSize,
								marginBottom: description ? 2 : 0, // description이 있을 때만 마진
							},
						]}
						numberOfLines={1}
					>
						{title}
					</Text>
					{description && (
						<Text
							style={[
								styles.description,
								{
									color: theme.colors.default[600],
									fontSize: sizeConfig.descriptionFontSize,
								},
							]}
							numberOfLines={size === "sm" ? 1 : 2}
						>
							{description}
						</Text>
					)}
				</View>

				{renderCheckbox()}

				{endContent && <View style={styles.endContent}>{endContent}</View>}
			</TouchableOpacity>
		</Animated.View>
	);
};
