import type { Meta, StoryObj } from "@storybook/react";
import { DashboardScreen } from "./DashboardScreen";

const defaultArgs = {};

const meta = {
	title: "screen/DashboardScreen",
	component: DashboardScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof DashboardScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
