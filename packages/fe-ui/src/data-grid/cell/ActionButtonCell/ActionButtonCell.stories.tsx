import type { Meta, StoryObj } from "@storybook/react";
import { ActionButtonCell } from "./ActionButtonCell";

const meta = {
	title: "data-grid/cell/ActionButtonCell",
	component: ActionButtonCell,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		children: "보기",
		color: "primary",
	variant: "ghost",
	},
} satisfies Meta<typeof ActionButtonCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const StartAligned: Story = { args: { align: "start" } };
export const Disabled: Story = {
	args: { isDisabled: true, children: "권한 없음" },
};
