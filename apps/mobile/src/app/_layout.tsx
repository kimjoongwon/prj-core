import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setLoginRedirectUrl } from "@cocrepo/api/core/client";
import { setIdpBaseUrl, setIdpLoginRedirectUrl } from "@cocrepo/api/idp/client";
import { CustomHeader, DesignSystemProvider } from "@cocrepo/mo-ui";
import type { ComponentType, PropsWithChildren } from "react";
import { useEffect } from "react";
import { type ViewProps } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import { AuthSessionGate } from "@/auth/AuthSessionGate";
import { getIdpApiBaseUrl, getLoginPath } from "@/auth/auth-config";
import { configureMobileApiScope } from "@/auth/mobile-api-scope";
import "../global.css";

void SplashScreen.preventAutoHideAsync();

const GestureRootView = GestureHandlerRootView as ComponentType<
	PropsWithChildren<ViewProps>
>;

const GESTURE_ROOT_STYLE = {
	flex: 1,
} as const;

const mobileQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 30_000,
		},
	},
});

const MOBILE_DEFAULT_THEME = "system";

const getStackHeaderTitle = (props: NativeStackHeaderProps) => {
	if (typeof props.options.title === "string") {
		return props.options.title;
	}

	return props.route.name;
};

const renderRootStackHeader = (props: NativeStackHeaderProps) => (
	<CustomHeader
		title={getStackHeaderTitle(props)}
		canGoBack={props.navigation.canGoBack()}
		onPressBack={props.navigation.goBack}
	/>
);

export default function RootLayout() {
	useEffect(() => {
		Uniwind.setTheme(MOBILE_DEFAULT_THEME);
		configureMobileApiScope();
		setLoginRedirectUrl(getLoginPath());
		setIdpBaseUrl(getIdpApiBaseUrl());
		setIdpLoginRedirectUrl(getLoginPath());
	}, []);

	return (
		<GestureRootView style={GESTURE_ROOT_STYLE}>
			<SafeAreaProvider>
				<QueryClientProvider client={mobileQueryClient}>
					<DesignSystemProvider>
						<AuthSessionGate>
							<Stack screenOptions={{ header: renderRootStackHeader }}>
								<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
								<Stack.Screen name="auth/login" options={{ headerShown: false }} />
								<Stack.Screen
									name="select-space"
									options={{ headerShown: false }}
								/>
							</Stack>
						</AuthSessionGate>
					</DesignSystemProvider>
				</QueryClientProvider>
			</SafeAreaProvider>
		</GestureRootView>
	);
}
