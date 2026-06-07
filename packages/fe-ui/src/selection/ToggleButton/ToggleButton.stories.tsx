import type { Meta, StoryObj } from "@storybook/react";
import { ToggleButton } from "./ToggleButton";

const meta: Meta<typeof ToggleButton> = {
	title: "selection/ToggleButton",
	component: ToggleButton,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
