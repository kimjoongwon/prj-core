import type { Meta, StoryObj } from "@storybook/react";
import { ColorArea } from "./ColorArea";

const meta: Meta<typeof ColorArea> = {
	title: "control/ColorArea",
	component: ColorArea,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
