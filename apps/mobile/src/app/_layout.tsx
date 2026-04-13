import { Stack } from "expo-router";
import { DesignSystemProvider } from "@cocrepo/mo-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<DesignSystemProvider>
				<Stack screenOptions={{ headerShown: false }} />
			</DesignSystemProvider>
		</GestureHandlerRootView>
	);
}
