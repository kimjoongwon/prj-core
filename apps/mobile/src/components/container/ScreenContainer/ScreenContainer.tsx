import { observer } from "mobx-react-lite";
import React from "react";
import { StatusBar, View, ViewProps, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/components/contexts/ThemeContext";

export interface ScreenContainerProps extends Omit<ViewProps, "style"> {
	children: React.ReactNode;
	safeArea?: boolean;
	statusBarStyle?: "light-content" | "dark-content" | "auto";
	backgroundColor?: string;
	style?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = observer(
	({
		children,
		safeArea = true,
		statusBarStyle = "auto",
		backgroundColor,
		style,
		...props
	}) => {
		const { theme, isDark } = useTheme();

		const containerBackgroundColor = backgroundColor || theme.colors.background;

		const statusBarStyleValue = (() => {
			if (statusBarStyle === "auto") {
				return isDark ? "light-content" : "dark-content";
			}
			return statusBarStyle;
		})();

		const containerStyle: ViewStyle = {
			flex: 1,
			paddingHorizontal: 20,
			backgroundColor: containerBackgroundColor,
			...style,
		};

		const Container = safeArea ? SafeAreaView : View;

		return (
			<Container style={containerStyle} {...props}>
				<StatusBar
					barStyle={statusBarStyleValue}
					backgroundColor={containerBackgroundColor}
					translucent={false}
				/>
				{children}
			</Container>
		);
	},
);

ScreenContainer.displayName = "ScreenContainer";

export default ScreenContainer;
