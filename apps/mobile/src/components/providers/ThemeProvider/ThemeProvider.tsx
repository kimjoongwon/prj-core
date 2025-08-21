import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";
import { useColorScheme } from "react-native";
import { observer } from "mobx-react-lite";
import {
	lightTheme,
	darkTheme,
} from "@/components/providers/ThemeProvider/ThemeProvider.styles";
import { DarkModeSwitch } from "@/components/providers/ThemeProvider/DarkModeSwitch";
import type {
	ThemeMode,
	ThemeContextValue,
} from "@/components/providers/ThemeProvider/types";

// Theme Context 생성
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

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

		const showDarkModeSwitch = process.env.EXPO_PUBLIC_STORYBOOK === "1";

		return (
			<ThemeContext.Provider value={value}>
				{showDarkModeSwitch && <DarkModeSwitch />}
				{children}
			</ThemeContext.Provider>
		);
	},
);

export const useTheme = (): ThemeContextValue => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

// 타입들을 export
export type {
	Theme,
	ThemeColors,
	ColorScale,
	ContentColor,
	ThemeMode,
} from "@/components/providers/ThemeProvider/types";
