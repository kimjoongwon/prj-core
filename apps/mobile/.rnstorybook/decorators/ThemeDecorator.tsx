import { useState } from "react";
import type { Decorator } from "@storybook/react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../../src/components";
import type { ThemeMode } from "../../src/components";
import { ThemeToggleButton } from "../components/ThemeToggleButton";

const ThemedBackground: React.FC<{
	children: React.ReactNode;
	onToggle: () => void;
	currentTheme: ThemeMode;
}> = ({ children, onToggle, currentTheme }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			{children}
			<View style={[styles.toggleButtonContainer]}>
				<ThemeToggleButton onToggle={onToggle} currentTheme={currentTheme} />
			</View>
		</View>
	);
};

const StorybookThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [currentTheme, setCurrentTheme] = useState<ThemeMode>("light");

	const toggleTheme = () => {
		setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<ThemeProvider key={currentTheme} initialTheme={currentTheme}>
			<ThemedBackground onToggle={toggleTheme} currentTheme={currentTheme}>
				{children}
			</ThemedBackground>
		</ThemeProvider>
	);
};

export const withThemeProvider: Decorator = (Story, context) => {
	return (
		<SafeAreaProvider>
			<StorybookThemeWrapper>
				<Story {...context} />
			</StorybookThemeWrapper>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
	},
	toggleButtonContainer: {
		position: "absolute",
		bottom: 20,
		right: 20,
		zIndex: 9999,
	},
});
