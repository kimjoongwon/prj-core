export interface ThemeConfig {
	defaultTheme: "light" | "dark" | "system";
	disableBaseline: boolean;
}

export const defaultThemeConfig: ThemeConfig = {
	defaultTheme: "dark",
	disableBaseline: false,
};
