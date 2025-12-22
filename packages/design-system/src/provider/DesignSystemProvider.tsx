/**
 * DesignSystemProvider
 *
 * HeroUI Provider를 래핑하여 테마 설정을 중앙에서 관리합니다.
 * 앱에서는 이 Provider를 최상위에 배치하면 됩니다.
 */
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useTheme } from "@heroui/use-theme";
import type { ReactNode } from "react";
import { type ThemeConfig } from "../theme/heroui.config";

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
 * import { DesignSystemProvider } from '@cocrepo/design-system';
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
}: DesignSystemProviderProps) {
	return (
		<HeroUIProvider navigate={navigate}>
			{children}
			<ToastProvider />
		</HeroUIProvider>
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
	const { theme, setTheme } = useTheme();

	return {
		theme: theme as "light" | "dark" | undefined,
		setTheme,
		toggleTheme: () => setTheme(theme === "light" ? "dark" : "light"),
		isDark: theme === "dark",
		isLight: theme === "light",
	};
}
