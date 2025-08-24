import {
	DefaultTheme,
	ThemeProvider as RNNavThemeProvider,
} from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import React, { ReactNode, useCallback, useState } from "react";
import { useColorScheme } from "react-native";
import {
	ThemeContext,
	type ThemeContextValue,
	type ThemeMode,
} from "@/components/contexts/ThemeContext";
import { darkTheme, lightTheme } from "./ThemeProvider.styles";

interface ThemeProviderProps {
	children: ReactNode;
	initialTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = observer(
	({ children, initialTheme }) => {
		const systemColorScheme = useColorScheme();

		// 초기 테마 설정: initialTheme이 있으면 사용, 없으면 시스템 설정을 따름
		const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
			if (initialTheme) return initialTheme;
			return systemColorScheme === "dark" ? "dark" : "light";
		});

		const theme = currentTheme === "dark" ? darkTheme : lightTheme;
		const isDark = currentTheme === "dark";

		const toggleTheme = useCallback(() => {
			setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
		}, []);

		const setTheme = useCallback((mode: ThemeMode) => {
			setCurrentTheme(mode);
		}, []);

		const value: ThemeContextValue = {
			theme,
			isDark,
			toggleTheme,
			setTheme,
		};

		return (
			<ThemeContext.Provider value={value}>
				<RNNavThemeProvider
					value={{
						fonts: DefaultTheme.fonts,
						dark: isDark,
						colors: {
							primary: theme.colors.primary.DEFAULT,
							background: theme.colors.background,
							card: theme.colors.content1.DEFAULT,
							text: theme.colors.foreground,
							border: theme.colors.default[200],
							notification: theme.colors.danger.DEFAULT,
						},
					}}
				>
					{children}
				</RNNavThemeProvider>
			</ThemeContext.Provider>
		);
	},
);
