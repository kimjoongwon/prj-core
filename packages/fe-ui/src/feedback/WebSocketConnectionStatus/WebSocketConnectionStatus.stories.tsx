import type { Meta, StoryObj } from "@storybook/react";
import { WebSocketConnectionStatus } from "./WebSocketConnectionStatus";

const meta = {
	title: "feedback/WebSocketConnectionStatus",
	component: WebSocketConnectionStatus,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { status: "connected", onReconnect: () => undefined },
} satisfies Meta<typeof WebSocketConnectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {};
export const Connecting: Story = { args: { status: "connecting" } };
export const Disconnected: Story = { args: { status: "disconnected" } };
