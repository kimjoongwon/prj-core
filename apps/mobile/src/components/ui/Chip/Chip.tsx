import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { styles, sizes, radiusValues } from "./Chip.styles";
import { useTheme } from "../../providers/theme-provider";
import { Text } from "../Text";

export type ChipVariant = "solid" | "bordered" | "light" | "flat" | "faded" | "shadow";
export type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
export type ChipSize = "sm" | "md" | "lg";
export type ChipRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ChipProps {
	children?: React.ReactNode;
	variant?: ChipVariant;
	color?: ChipColor;
	size?: ChipSize;
	radius?: ChipRadius;
	isDisabled?: boolean;
	isClosable?: boolean;
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	avatar?: React.ReactNode;
	onClose?: () => void;
	onPress?: () => void;
	style?: ViewStyle;
	className?: string;
}

export const Chip: React.FC<ChipProps> = ({
	children,
	variant = "solid",
	color = "default",
	size = "md",
	radius = "full",
	isDisabled = false,
	isClosable = false,
	startContent,
	endContent,
	avatar,
	onClose,
	onPress,
	style,
}) => {
	const { theme } = useTheme();
	const sizeConfig = sizes[size];
	const radiusValue = radiusValues[radius];

	// Animation values
	const scaleValue = useSharedValue(1);
	const opacityValue = useSharedValue(1);

	const handlePressIn = () => {
		if (!isDisabled && onPress) {
			scaleValue.value = withSpring(0.95, { damping: 15 });
		}
	};

	const handlePressOut = () => {
		if (!isDisabled && onPress) {
			scaleValue.value = withSpring(1, { damping: 15 });
		}
	};

	const handleClose = () => {
		if (!isDisabled && onClose) {
			// 먼저 onClose를 호출하여 상태를 업데이트한 다음 애니메이션 실행
			onClose();
			// 애니메이션은 부드러운 UI를 위해 유지하되, 콜백에서는 추가 작업 없음
			opacityValue.value = withTiming(0, { duration: 200 });
		}
	};

	// Color scheme generation based on variant and color
	const getColorScheme = () => {
		const colorTokens = theme.colors[color] || theme.colors.default;

		switch (variant) {
			case "solid":
				return {
					backgroundColor: colorTokens.DEFAULT,
					borderColor: colorTokens.DEFAULT,
					textColor: colorTokens.foreground,
					closeColor: colorTokens.foreground,
				};
			case "bordered":
				return {
					backgroundColor: "transparent",
					borderColor: colorTokens.DEFAULT,
					textColor: colorTokens.DEFAULT,
					closeColor: colorTokens.DEFAULT,
				};
			case "light":
				return {
					backgroundColor: colorTokens[100],
					borderColor: colorTokens[200],
					textColor: colorTokens[800],
					closeColor: colorTokens[600],
				};
			case "flat":
				return {
					backgroundColor: colorTokens[100],
					borderColor: "transparent",
					textColor: colorTokens[800],
					closeColor: colorTokens[600],
				};
			case "faded":
				return {
					backgroundColor: colorTokens[50],
					borderColor: colorTokens[300],
					textColor: colorTokens[700],
					closeColor: colorTokens[500],
				};
			case "shadow":
				return {
					backgroundColor: colorTokens.DEFAULT,
					borderColor: colorTokens.DEFAULT,
					textColor: colorTokens.foreground,
					closeColor: colorTokens.foreground,
				};
			default:
				return {
					backgroundColor: colorTokens.DEFAULT,
					borderColor: colorTokens.DEFAULT,
					textColor: colorTokens.foreground,
					closeColor: colorTokens.foreground,
				};
		}
	};

	const colorScheme = getColorScheme();

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scaleValue.value }],
		opacity: opacityValue.value,
	}));

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
		if (isClosable) {
			return (
				<TouchableOpacity
					style={[
						styles.closeButton,
						{
							width: sizeConfig.closeButtonSize,
							height: sizeConfig.closeButtonSize,
						},
					]}
					onPress={handleClose}
					disabled={isDisabled}
					hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
				>
					<Text
						style={[
							styles.closeIcon,
							{
								color: colorScheme.closeColor,
								fontSize: sizeConfig.closeButtonSize * 0.7,
							},
						]}
					>
						×
					</Text>
				</TouchableOpacity>
			);
		}

		if (endContent) {
			return <View style={styles.endContent}>{endContent}</View>;
		}

		return null;
	};

	const ChipComponent = onPress ? TouchableOpacity : View;

	return (
		<Animated.View style={[animatedStyle]}>
			<ChipComponent
				style={[chipStyle, style]}
				onPress={onPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				disabled={isDisabled}
				activeOpacity={0.8}
			>
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
			</ChipComponent>
		</Animated.View>
	);
};
