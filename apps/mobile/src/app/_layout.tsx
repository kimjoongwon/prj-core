import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Providers } from "../components/providers/Providers";
import { useTheme } from "../components/providers/theme-provider";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

import "./global.css";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName:
		process.env.EXPO_PUBLIC_STORYBOOK === "1" ? "storybook" : "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		// Pretendard 폰트 패밀리 (모든 가중치)
		"Pretendard-Thin": require("../../assets/fonts/Pretendard-Thin.ttf"),
		"Pretendard-ExtraLight": require("../../assets/fonts/Pretendard-ExtraLight.ttf"),
		"Pretendard-Light": require("../../assets/fonts/Pretendard-Light.ttf"),
		"Pretendard-Regular": require("../../assets/fonts/Pretendard-Regular.ttf"),
		"Pretendard-Medium": require("../../assets/fonts/Pretendard-Medium.ttf"),
		"Pretendard-SemiBold": require("../../assets/fonts/Pretendard-SemiBold.ttf"),
		"Pretendard-Bold": require("../../assets/fonts/Pretendard-Bold.ttf"),
		"Pretendard-ExtraBold": require("../../assets/fonts/Pretendard-ExtraBold.ttf"),
		"Pretendard-Black": require("../../assets/fonts/Pretendard-Black.ttf"),
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

	// React Navigation 테마 생성 (테마 기반)
	const navigationTheme = {
		dark: isDark,
		colors: {
			primary: theme.colors.primary.DEFAULT,
			background: theme.colors.background,
			card: theme.colors.content1.DEFAULT,
			text: theme.colors.foreground,
			border: theme.colors.default[300],
			notification: theme.colors.danger.DEFAULT,
		},
		fonts: {
			regular: {
				fontFamily: theme.fonts.regular,
				fontWeight: "normal" as const,
			},
			medium: { fontFamily: theme.fonts.medium, fontWeight: "500" as const },
			bold: { fontFamily: theme.fonts.bold, fontWeight: "bold" as const },
			heavy: { fontFamily: theme.fonts.black, fontWeight: "900" as const },
		},
	};

	return (
		<NavigationThemeProvider value={navigationTheme}>
			<Stack>
				<Stack.Protected guard={false}>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack.Protected>

				<Stack.Protected guard={true}>
					<Stack.Screen
						name="login"
						options={{ title: "로그인", headerShown: true }}
					/>
					<Stack.Screen name="storybook" options={{ headerShown: false }} />
				</Stack.Protected>
			</Stack>
		</NavigationThemeProvider>
	);
}

function RootLayoutNav() {
	return (
		<Providers>
			<NavigationWrapper />
		</Providers>
	);
}
