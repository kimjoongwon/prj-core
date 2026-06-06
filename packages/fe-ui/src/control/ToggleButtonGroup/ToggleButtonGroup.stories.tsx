import type { Meta, StoryObj } from "@storybook/react";
import { ToggleButtonGroup } from "./ToggleButtonGroup";

const meta: Meta<typeof ToggleButtonGroup> = {
	title: "Controls/ToggleButtonGroup",
	component: ToggleButtonGroup,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
