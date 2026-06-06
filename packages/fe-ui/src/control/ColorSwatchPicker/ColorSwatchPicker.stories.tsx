import type { Meta, StoryObj } from "@storybook/react";
import { ColorSwatchPicker } from "./ColorSwatchPicker";

const meta: Meta<typeof ColorSwatchPicker> = {
	title: "Controls/ColorSwatchPicker",
	component: ColorSwatchPicker,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
