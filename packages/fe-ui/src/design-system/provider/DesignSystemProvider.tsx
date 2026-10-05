"use client";

/**
 * DesignSystemProvider
 *
 * HeroUI v3 테마는 root의 light/dark class를 기준으로 동작합니다.
 * Web 앱에서는 HeroUI 공식 권장 방식인 next-themes가 class, storage,
 * system preference, hydration 전 테마 적용을 담당합니다.
 */

import { ToastProvider } from "@heroui/react";
import {
	ThemeProvider as NextThemesProvider,
	useTheme as useNextTheme,
} from "next-themes";
import type { ReactNode } from "react";
import { defaultThemeConfig, type ThemeConfig } from "../theme/heroui.config";

const THEME_STORAGE_KEY = "heroui-theme";

type ThemeName = ThemeConfig["defaultTheme"];
type ResolvedTheme = Exclude<ThemeName, "system">;

export interface DesignSystemThemeContextValue {
	theme: ThemeName;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: ThemeName) => void;
	toggleTheme: () => void;
	isDark: boolean;
	isLight: boolean;
	isSystem: boolean;
}

export interface DesignSystemProviderProps {
	children: ReactNode;
	themeConfig?: Partial<ThemeConfig>;
}

function isThemeName(theme: string | undefined): theme is ThemeName {
	return theme === "light" || theme === "dark" || theme === "system";
}

function isResolvedTheme(theme: string | undefined): theme is ResolvedTheme {
	return theme === "light" || theme === "dark";
}

function getThemeName(theme: string | undefined): ThemeName {
	return isThemeName(theme) ? theme : defaultThemeConfig.defaultTheme;
}

function getResolvedTheme(theme: string | undefined): ResolvedTheme {
	return isResolvedTheme(theme) ? theme : "light";
}

export function DesignSystemProvider({
	children,
	themeConfig,
}: DesignSystemProviderProps) {
	const config = {
		...defaultThemeConfig,
		...themeConfig,
	};

	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme={config.defaultTheme}
			disableTransitionOnChange
			enableSystem
			storageKey={THEME_STORAGE_KEY}
		>
			<ToastProvider />
			{children}
		</NextThemesProvider>
	);
}

export function useDesignSystemTheme(): DesignSystemThemeContextValue {
	const { resolvedTheme, setTheme, theme } = useNextTheme();
	const activeTheme = getThemeName(theme);
	const activeResolvedTheme = getResolvedTheme(
		resolvedTheme ?? (activeTheme === "system" ? undefined : activeTheme),
	);

	const setDesignSystemTheme = (nextTheme: ThemeName) => {
		setTheme(nextTheme);
	};

	return {
		theme: activeTheme,
		resolvedTheme: activeResolvedTheme,
		setTheme: setDesignSystemTheme,
		toggleTheme: () =>
			setTheme(activeResolvedTheme === "dark" ? "light" : "dark"),
		isDark: activeResolvedTheme === "dark",
		isLight: activeResolvedTheme === "light",
		isSystem: activeTheme === "system",
	};
}
