/**
 * DesignSystemProvider
 *
 * HeroUI Provider를 래핑하여 테마 설정을 중앙에서 관리합니다.
 * 앱에서는 이 Provider를 최상위에 배치하면 됩니다.
 */
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { defaultThemeConfig, type ThemeConfig } from "../theme/heroui.config";

const THEME_STORAGE_KEY = "heroui-theme";
const SYSTEM_THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

type ThemeName = ThemeConfig["defaultTheme"];
type ResolvedTheme = Exclude<ThemeName, "system">;

interface DesignSystemThemeContextValue {
	theme: ThemeName;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: ThemeName) => void;
	toggleTheme: () => void;
	isDark: boolean;
	isLight: boolean;
	isSystem: boolean;
}

const DesignSystemThemeContext =
	createContext<DesignSystemThemeContextValue | null>(null);

function isThemeName(theme: string | null): theme is ThemeName {
	return theme === "light" || theme === "dark" || theme === "system";
}

function resolveTheme(theme: ThemeName): ResolvedTheme {
	if (theme === "system") {
		if (typeof window !== "undefined") {
			return window.matchMedia(SYSTEM_THEME_MEDIA_QUERY).matches
				? "dark"
				: "light";
		}

		return "light";
	}

	return theme;
}

function applyThemeToDocument(theme: ResolvedTheme) {
	if (typeof document === "undefined") {
		return;
	}

	const root = document.documentElement;
	root.classList.remove("light", "dark", "system");
	root.classList.add(theme);
	root.style.colorScheme = theme;
}

function readStoredTheme(): ThemeName | null {
	if (typeof window === "undefined") {
		return null;
	}

	const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
	return isThemeName(storedTheme) ? storedTheme : null;
}

export interface DesignSystemProviderProps {
	children: ReactNode;
	/**
	 * 테마 설정 (기본값: light 테마)
	 */
	themeConfig?: Partial<ThemeConfig>;
	/**
	 * 라우터 네비게이션 함수 (선택사항)
	 * TanStack Router, React Router 등과 통합할 때 사용
	 */
	navigate?: (path: string) => void;
}

/**
 * 디자인 시스템 Provider
 *
 * @example
 * ```tsx
 * import { DesignSystemProvider } from '@cocrepo/ui';
 *
 * function App() {
 *   return (
 *     <DesignSystemProvider>
 *       <YourApp />
 *     </DesignSystemProvider>
 *   );
 * }
 * ```
 */
export function DesignSystemProvider({
	children,
	navigate,
	themeConfig,
}: DesignSystemProviderProps) {
	const config = useMemo(
		() => ({
			...defaultThemeConfig,
			...themeConfig,
		}),
		[themeConfig],
	);
	const [theme, setThemeState] = useState<ThemeName>(config.defaultTheme);
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
		resolveTheme(config.defaultTheme),
	);

	const setTheme = useCallback((nextTheme: ThemeName) => {
		setThemeState(nextTheme);

		if (typeof window === "undefined") {
			setResolvedTheme(nextTheme === "dark" ? "dark" : "light");
			return;
		}

		window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

		const nextResolvedTheme = resolveTheme(nextTheme);
		setResolvedTheme(nextResolvedTheme);
		applyThemeToDocument(nextResolvedTheme);
	}, []);

	useEffect(() => {
		const storedTheme = readStoredTheme();
		const nextTheme = storedTheme ?? config.defaultTheme;
		const nextResolvedTheme = resolveTheme(nextTheme);

		setThemeState(nextTheme);
		setResolvedTheme(nextResolvedTheme);
		applyThemeToDocument(nextResolvedTheme);
	}, [config.defaultTheme]);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const mediaQuery = window.matchMedia(SYSTEM_THEME_MEDIA_QUERY);
		const handleChange = () => {
			if (theme !== "system") {
				return;
			}

			const nextResolvedTheme = mediaQuery.matches ? "dark" : "light";
			setResolvedTheme(nextResolvedTheme);
			applyThemeToDocument(nextResolvedTheme);
		};

		handleChange();
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [theme]);

	const value = useMemo<DesignSystemThemeContextValue>(
		() => ({
			theme,
			resolvedTheme,
			setTheme,
			toggleTheme: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
			isDark: resolvedTheme === "dark",
			isLight: resolvedTheme === "light",
			isSystem: theme === "system",
		}),
		[resolvedTheme, setTheme, theme],
	);

	return (
		<DesignSystemThemeContext.Provider value={value}>
			<HeroUIProvider navigate={navigate}>
				{children}
				<ToastProvider />
			</HeroUIProvider>
		</DesignSystemThemeContext.Provider>
	);
}

/**
 * 현재 테마를 가져오는 훅
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useDesignSystemTheme();
 * ```
 */
export function useDesignSystemTheme() {
	const context = useContext(DesignSystemThemeContext);

	if (context) {
		return context;
	}

	return {
		theme: defaultThemeConfig.defaultTheme,
		resolvedTheme: resolveTheme(defaultThemeConfig.defaultTheme),
		setTheme: () => {},
		toggleTheme: () => {},
		isDark: false,
		isLight: true,
		isSystem: defaultThemeConfig.defaultTheme === "system",
	};
}
