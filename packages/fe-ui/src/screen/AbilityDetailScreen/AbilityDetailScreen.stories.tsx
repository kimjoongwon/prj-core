import type { Meta, StoryObj } from "@storybook/react";
import { AbilityDetailScreen } from "./AbilityDetailScreen";

const defaultArgs = {
	mode: "loading",
};

const meta = {
	title: "screen/AbilityDetailScreen",
	component: AbilityDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AbilityDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
