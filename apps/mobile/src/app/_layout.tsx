import { Stack } from "expo-router";
import { DesignSystemProvider } from "@cocrepo/mo-ui";
import type { ComponentType, PropsWithChildren } from "react";
import { StyleSheet, type ViewProps } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

const GestureRootView = GestureHandlerRootView as ComponentType<
	PropsWithChildren<ViewProps>
>;

export default function RootLayout() {
	return (
		<GestureRootView style={styles.root}>
			<DesignSystemProvider>
				<Stack screenOptions={{ headerShown: false }} />
			</DesignSystemProvider>
		</GestureRootView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});
