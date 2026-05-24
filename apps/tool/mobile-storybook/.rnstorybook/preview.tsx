import type { Preview } from "@storybook/react-native";
import type { HeroUINativeConfig } from "@cocrepo/mo-ui";
import {
	DesignSystemProvider,
	PortalHost,
	ScreenFrame,
} from "@cocrepo/mo-ui";
import type { ReactNode } from "react";
import { Dimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScopedTheme } from "uniwind";

const STORYBOOK_CANVAS_BACKGROUND = "#09090b";
const STORYBOOK_CANVAS_WIDTH = Dimensions.get("window").width;
const STORYBOOK_TOAST_CONTENT_CLASS_NAME = "flex-1";
const STORYBOOK_TOAST_TOP_INSET = 72;
const STORYBOOK_TOAST_BOTTOM_INSET = 168;

const GESTURE_ROOT_STYLE = {
	alignSelf: "stretch",
	backgroundColor: STORYBOOK_CANVAS_BACKGROUND,
	flex: 1,
	width: STORYBOOK_CANVAS_WIDTH,
} as const;

const STORY_LAYOUT_CLASS_NAMES = {
	centered: "flex-1 w-full items-center justify-center",
	fullscreen: "flex-1 w-full",
	padded: "flex-1 w-full p-2",
} as const;

const getStoryLayoutClassName = (layout: unknown) =>
	typeof layout === "string" && layout in STORY_LAYOUT_CLASS_NAMES
		? STORY_LAYOUT_CLASS_NAMES[layout as keyof typeof STORY_LAYOUT_CLASS_NAMES]
		: STORY_LAYOUT_CLASS_NAMES.padded;

const renderStorybookToastContent = (children: ReactNode) => (
	<View className={STORYBOOK_TOAST_CONTENT_CLASS_NAME}>{children}</View>
);

const DESIGN_SYSTEM_CONFIG: HeroUINativeConfig = {
	toast: {
		contentWrapper: renderStorybookToastContent,
		insets: {
			top: STORYBOOK_TOAST_TOP_INSET,
			bottom: STORYBOOK_TOAST_BOTTOM_INSET,
		},
	},
};

const withMobileRuntime: Preview["decorators"][number] = (Story, context) => (
	<GestureHandlerRootView style={GESTURE_ROOT_STYLE}>
		<SafeAreaProvider>
			<DesignSystemProvider config={DESIGN_SYSTEM_CONFIG}>
				<ScopedTheme theme="dark">
					<ScreenFrame
						backgroundColor={STORYBOOK_CANVAS_BACKGROUND}
						edges={["left", "right"]}
					>
						<View className={getStoryLayoutClassName(context.parameters.layout)}>
							<Story />
						</View>
					</ScreenFrame>
				</ScopedTheme>
				<PortalHost />
			</DesignSystemProvider>
		</SafeAreaProvider>
	</GestureHandlerRootView>
);

const preview: Preview = {
	decorators: [withMobileRuntime],
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

export default preview;
