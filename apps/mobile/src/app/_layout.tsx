import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
// theme-provider가 제거되었습니다. gluestack-ui-provider를 사용합니다.
import { useColorScheme } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

import "./global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // React Navigation 테마 생성 (CSS 변수 기반)
  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: isDark ? "rgb(0, 111, 238)" : "rgb(0, 111, 238)",
      background: isDark ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)",
      card: isDark ? "rgb(18, 18, 18)" : "rgb(255, 255, 255)",
      text: isDark ? "rgb(245, 245, 245)" : "rgb(23, 23, 23)",
      border: isDark ? "rgb(38, 38, 38)" : "rgb(229, 229, 229)",
      notification: isDark ? "rgb(240, 18, 96)" : "rgb(240, 18, 96)",
    },
    fonts: {
      regular: {
        fontFamily: "Pretendard-Regular",
        fontWeight: "normal" as const,
      },
      medium: { fontFamily: "Pretendard-Medium", fontWeight: "500" as const },
      bold: { fontFamily: "Pretendard-Bold", fontWeight: "bold" as const },
      heavy: { fontFamily: "Pretendard-Black", fontWeight: "900" as const },
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
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
      <NavigationWrapper />
    </GluestackUIProvider>
  );
}
