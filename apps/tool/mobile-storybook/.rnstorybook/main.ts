import type { StorybookConfig } from "@storybook/react-native";

const main: StorybookConfig = {
	stories: [
		{
			directory: "../../../../packages/fe-mo-ui/src",
			files: "**/*.stories.?(ts|tsx|js|jsx)",
			titlePrefix: "mo-ui",
		},
	],
	deviceAddons: [
		"@storybook/addon-ondevice-actions",
		"@storybook/addon-ondevice-backgrounds",
		"@storybook/addon-ondevice-controls",
	],
};

export default main;
