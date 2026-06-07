import type { Meta, StoryObj } from "@storybook/react";
import { ComboBox } from "./ComboBox";

const meta: Meta<typeof ComboBox> = {
	title: "control/ComboBox",
	component: ComboBox,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
