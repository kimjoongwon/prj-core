import type { Preview } from "@storybook/react-native";
import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";
import {
	DesignSystemProvider,
	PortalHost,
	ScreenFrame,
} from "@cocrepo/mo-ui";
import type { ComponentType, PropsWithChildren } from "react";
import { StyleSheet, type ViewProps } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../src/global.css";

const GestureRootView = GestureHandlerRootView as ComponentType<
	PropsWithChildren<ViewProps>
>;

const withMobileRuntime: Preview["decorators"][number] = (Story) => (
	<GestureRootView style={styles.root}>
		<SafeAreaProvider>
			<DesignSystemProvider>
				<ScreenFrame backgroundColor="#09090b" edges={["left", "right"]}>
					<Story />
				</ScreenFrame>
				<PortalHost />
			</DesignSystemProvider>
		</SafeAreaProvider>
	</GestureRootView>
);

const preview: Preview = {
	decorators: [withBackgrounds, withMobileRuntime],
	parameters: {
		backgrounds: {
			default: "dark",
			values: [
				{ name: "dark", value: "#09090b" },
				{ name: "surface", value: "#18181b" },
				{ name: "light", value: "#f8fafc" },
			],
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: "padded",
	},
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});

export default preview;
