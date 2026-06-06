import type { Meta, StoryObj } from "@storybook/react";
import { ColorSwatch } from "./ColorSwatch";

const meta: Meta<typeof ColorSwatch> = {
	title: "Controls/ColorSwatch",
	component: ColorSwatch,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
