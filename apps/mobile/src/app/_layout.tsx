import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { setIdpBaseUrl, setIdpLoginRedirectUrl } from "@cocrepo/api/idp/client";
import { DesignSystemProvider } from "@cocrepo/mo-ui";
import type { ComponentType, PropsWithChildren } from "react";
import { useEffect } from "react";
import { StyleSheet, type ViewProps } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthSessionGate } from "@/auth/AuthSessionGate";
import { getIdpApiBaseUrl, getLoginPath } from "@/auth/auth-config";
import "../global.css";

void SplashScreen.preventAutoHideAsync();

const GestureRootView = GestureHandlerRootView as ComponentType<
	PropsWithChildren<ViewProps>
>;

export default function RootLayout() {
	useEffect(() => {
		setIdpBaseUrl(getIdpApiBaseUrl());
		setIdpLoginRedirectUrl(getLoginPath());
	}, []);

	return (
		<GestureRootView style={styles.root}>
			<DesignSystemProvider>
				<AuthSessionGate>
					<Stack screenOptions={{ headerShown: false }} />
				</AuthSessionGate>
			</DesignSystemProvider>
		</GestureRootView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});
