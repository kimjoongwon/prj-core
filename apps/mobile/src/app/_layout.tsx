import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/src/components/useColorScheme";
import { ThemeProvider, useTheme } from "@/src/components/providers/theme-provider";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function NavigationWrapper() {
	const { theme, isDark } = useTheme();
	
	// React Navigation 테마 생성
	const navigationTheme = {
		dark: isDark,
		colors: {
			primary: theme.colors.primary.DEFAULT,
			background: theme.colors.background,
			card: theme.colors.content1.DEFAULT,
			text: theme.colors.foreground,
			border: theme.colors.content3.DEFAULT,
			notification: theme.colors.danger.DEFAULT,
		},
		fonts: {
			regular: { fontFamily: 'System', fontWeight: 'normal' as const },
			medium: { fontFamily: 'System', fontWeight: '500' as const },
			bold: { fontFamily: 'System', fontWeight: 'bold' as const },
			heavy: { fontFamily: 'System', fontWeight: '900' as const },
		},
	};

	return (
		<NavigationThemeProvider value={navigationTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</NavigationThemeProvider>
	);
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider initialTheme={colorScheme === "dark" ? "dark" : "light"}>
			<NavigationWrapper />
		</ThemeProvider>
	);
}
