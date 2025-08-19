import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Text } from "../Text";
import { useTheme } from "../../providers/theme-provider";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps {
	orientation?: DividerOrientation;
	thickness?: number;
	color?: string;
	children?: React.ReactNode;
	style?: ViewStyle;
	margin?: number;
}

export const Divider: React.FC<DividerProps> = ({
	orientation = "horizontal",
	thickness = 1,
	color,
	children,
	style,
	margin = 16,
}) => {
	const { theme } = useTheme();
	const dividerColor = color || theme.colors.default[300];

	if (children) {
		return (
			<View 
				style={[
					styles.containerWithText, 
					{ marginVertical: margin },
					style
				]}
			>
				<View 
					style={[
						styles.lineWithText, 
						{ 
							backgroundColor: dividerColor,
							height: thickness,
						}
					]} 
				/>
				<Text 
					variant="body2" 
					color="default"
					style={styles.text}
				>
					{children}
				</Text>
				<View 
					style={[
						styles.lineWithText, 
						{ 
							backgroundColor: dividerColor,
							height: thickness,
						}
					]} 
				/>
			</View>
		);
	}

	const dividerStyle: ViewStyle = orientation === "horizontal" 
		? {
			height: thickness,
			width: "100%",
			backgroundColor: dividerColor,
			marginVertical: margin,
		}
		: {
			width: thickness,
			height: "100%",
			backgroundColor: dividerColor,
			marginHorizontal: margin,
		};

	return <View style={[dividerStyle, style]} />;
};

const styles = StyleSheet.create({
	containerWithText: {
		flexDirection: "row",
		alignItems: "center",
	},
	lineWithText: {
		flex: 1,
	},
	text: {
		marginHorizontal: 16,
	},
});

export default Divider;