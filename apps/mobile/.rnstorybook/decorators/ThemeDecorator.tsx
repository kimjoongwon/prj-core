import { useState } from "react";
import type { Decorator } from "@storybook/react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../../src/components/providers/theme-provider";
import type { ThemeMode } from "../../src/components/providers/theme-provider";
import { ThemeToggleButton } from "../components/ThemeToggleButton";

const StorybookThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [currentTheme, setCurrentTheme] = useState<ThemeMode>("light");

	const toggleTheme = () => {
		setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<ThemeProvider key={currentTheme} initialTheme={currentTheme}>
			<View style={styles.container}>
				{children}
				<View style={[styles.toggleButtonContainer]}>
					<ThemeToggleButton
						onToggle={toggleTheme}
						currentTheme={currentTheme}
					/>
				</View>
			</View>
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
