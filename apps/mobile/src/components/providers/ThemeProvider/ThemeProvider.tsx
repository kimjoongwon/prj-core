import React, { ReactNode, useCallback, useState } from "react";
import { useColorScheme } from "react-native";
import { observer } from "mobx-react-lite";
import { lightTheme, darkTheme } from "./ThemeProvider.styles";
import {
	ThemeContext,
	type ThemeMode,
	type ThemeContextValue,
} from "@/components/contexts/ThemeContext";

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
			<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
		);
	},
);
