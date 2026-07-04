import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmActionCell } from "./ConfirmActionCell";

const meta = {
	title: "data-grid/cell/ConfirmActionCell",
	component: ConfirmActionCell,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		children: "삭제",
		color: "danger",
		variant: "flat",
		confirmMessage: "이 항목을 삭제할까요?",
		confirmLabel: "삭제",
		onConfirm: async () => undefined,
	},
} satisfies Meta<typeof ConfirmActionCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { isLoading: true } };
export const EndAligned: Story = { args: { align: "end" } };
