import type { Preview } from "@storybook/react-native";
import { setLoginRedirectUrl } from "@cocrepo/api/core/client";
import { setIdpLoginRedirectUrl } from "@cocrepo/api/idp/client";
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
import { ScopedTheme, Uniwind } from "uniwind";

const STORYBOOK_CANVAS_WIDTH = Dimensions.get("window").width;
const STORYBOOK_TOAST_CONTENT_CLASS_NAME = "flex-1";
const STORYBOOK_TOAST_TOP_INSET = 72;
const STORYBOOK_TOAST_BOTTOM_INSET = 168;
const DISABLED_AUTH_REDIRECT_URL = "#mobile-storybook-auth-disabled";
const STORYBOOK_THEME_BACKGROUNDS = {
	dark: "#09090b",
	light: "#f8fafc",
} as const;

type StorybookTheme = keyof typeof STORYBOOK_THEME_BACKGROUNDS;

setLoginRedirectUrl(DISABLED_AUTH_REDIRECT_URL);
setIdpLoginRedirectUrl(DISABLED_AUTH_REDIRECT_URL);

const GESTURE_ROOT_STYLE = {
	alignSelf: "stretch",
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

const getStorybookTheme = (theme: unknown): StorybookTheme =>
	theme === "light" ? "light" : "dark";

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

const withMobileRuntime: Preview["decorators"][number] = (Story, context) => {
	const storybookTheme = getStorybookTheme(context.globals?.storybookTheme);
	const canvasBackground = STORYBOOK_THEME_BACKGROUNDS[storybookTheme];
	Uniwind.setTheme(storybookTheme);

	return (
		<GestureHandlerRootView
			style={[GESTURE_ROOT_STYLE, { backgroundColor: canvasBackground }]}
		>
			<SafeAreaProvider>
				<DesignSystemProvider config={DESIGN_SYSTEM_CONFIG}>
					<ScopedTheme theme={storybookTheme}>
						<ScreenFrame
							backgroundColor={canvasBackground}
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
};

const preview: Preview = {
	globalTypes: {
		storybookTheme: {
			name: "Theme",
			description: "Preview stories with the app light or dark theme.",
			toolbar: {
				icon: "circlehollow",
				dynamicTitle: true,
				items: [
					{ value: "dark", title: "Theme: Dark" },
					{ value: "light", title: "Theme: Light" },
				],
			},
		},
	},
	initialGlobals: {
		storybookTheme: "dark",
	},
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
