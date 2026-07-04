import type { Meta, StoryObj } from "@storybook/react";
import { SwitchCell } from "./SwitchCell";

const meta = {
	title: "data-grid/cell/SwitchCell",
	component: SwitchCell,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		isSelected: true,
		onToggle: async () => undefined,
	},
} satisfies Meta<typeof SwitchCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};
export const Unselected: Story = { args: { isSelected: false } };
export const Disabled: Story = { args: { isDisabled: true } };
