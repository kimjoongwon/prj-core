import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setLoginRedirectUrl } from "@cocrepo/api/core/client";
import { setIdpBaseUrl, setIdpLoginRedirectUrl } from "@cocrepo/api/idp/client";
import { DesignSystemProvider } from "@cocrepo/mo-ui";
import type { ComponentType, PropsWithChildren } from "react";
import { useEffect } from "react";
import { type ViewProps } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
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

export default function RootLayout() {
	useEffect(() => {
		configureMobileApiScope();
		setLoginRedirectUrl(getLoginPath());
		setIdpBaseUrl(getIdpApiBaseUrl());
		setIdpLoginRedirectUrl(getLoginPath());
	}, []);

	return (
		<GestureRootView style={GESTURE_ROOT_STYLE}>
			<SafeAreaProvider>
				<DesignSystemProvider>
					<QueryClientProvider client={mobileQueryClient}>
						<AuthSessionGate>
							<Stack screenOptions={{ headerShown: false }} />
						</AuthSessionGate>
					</QueryClientProvider>
				</DesignSystemProvider>
			</SafeAreaProvider>
		</GestureRootView>
	);
}
