import { createContext, useContext } from "react";

// 색상 타입 정의
export interface ColorScale {
	50: string;
	100: string;
	200: string;
	300: string;
	400: string;
	500: string;
	600: string;
	700: string;
	800: string;
	900: string;
	foreground: string;
	DEFAULT: string;
}

export interface ContentColor {
	DEFAULT: string;
	foreground: string;
}

export interface ThemeColors {
	default: ColorScale;
	primary: ColorScale;
	secondary: ColorScale;
	success: ColorScale;
	warning: ColorScale;
	danger: ColorScale;
	background: string;
	foreground: string;
	content1: ContentColor;
	content2: ContentColor;
	content3: ContentColor;
	content4: ContentColor;
	focus: string;
	overlay: string;
}

export interface FontFamily {
	thin: string;
	extraLight: string;
	light: string;
	regular: string;
	medium: string;
	semiBold: string;
	bold: string;
	extraBold: string;
	black: string;
}

export interface Theme {
	colors: ThemeColors;
	fonts: FontFamily;
	layout: {
		disabledOpacity: string;
	};
}

export type ThemeMode = "light" | "dark";

export interface ThemeContextValue {
	theme: Theme;
	isDark: boolean;
	toggleTheme: () => void;
	setTheme: (mode: ThemeMode) => void;
}

// Theme Context 생성
export const ThemeContext = createContext<ThemeContextValue | undefined>(
	undefined,
);

// useTheme 훅
export const useTheme = (): ThemeContextValue => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
