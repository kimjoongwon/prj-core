import { useMemo } from "react";
import { useTheme } from "@/components/contexts/ThemeContext";

export const useThemedScreenOptions = () => {
	const { theme, isDark } = useTheme();

	return useMemo(
		() => ({
			headerStyle: {
				backgroundColor: isDark
					? theme.colors.content1.DEFAULT
					: theme.colors.background,
				borderBottomColor: theme.colors.default[200],
				borderBottomWidth: isDark ? 0 : 1,
			},
			headerTintColor: theme.colors.foreground,
			headerTitleStyle: {
				color: theme.colors.foreground,
				fontFamily: theme.fonts.semiBold,
				fontSize: 17,
				fontWeight: "600" as const,
			},
			headerBackTitleVisible: false,
			headerShadowVisible: !isDark,
		}),
		[theme, isDark],
	);
};
