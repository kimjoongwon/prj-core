import type { Meta, StoryObj } from "@storybook/react";
import { TimeRemainingCell } from "./TimeRemainingCell";

const meta = {
	title: "data-grid/cell/TimeRemainingCell",
	component: TimeRemainingCell,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { status: "ok", remainingMinutes: 120 },
} satisfies Meta<typeof TimeRemainingCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
export const Warning: Story = {
	args: { status: "warning", remainingMinutes: 15 },
};
export const Breached: Story = {
	args: { status: "breach", remainingMinutes: -5 },
};
