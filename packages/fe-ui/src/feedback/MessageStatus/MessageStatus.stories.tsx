import type { Meta, StoryObj } from "@storybook/react";
import { MessageStatus } from "./MessageStatus";

const meta = {
	title: "feedback/MessageStatus",
	component: MessageStatus,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof MessageStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sent: Story = {};
export const Delivered: Story = {
	args: { deliveredAt: "2026-07-04T10:20:00.000Z" },
};
export const Read: Story = {
	args: {
		deliveredAt: "2026-07-04T10:20:00.000Z",
		readAt: "2026-07-04T10:22:00.000Z",
	},
};
