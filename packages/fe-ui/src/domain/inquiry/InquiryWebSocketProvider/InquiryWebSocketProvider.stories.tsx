import type { Meta, StoryObj } from "@storybook/react";
import {
	InquiryWebSocketProvider,
	useInquiryWebSocket,
} from "./InquiryWebSocketProvider";

function ConsumerFixture() {
	const context = useInquiryWebSocket();
	return (
		<div className="rounded-lg border border-border bg-surface p-4 text-sm">
			연결 상태: {context.status}
		</div>
	);
}

const meta = {
	title: "domain/inquiry/InquiryWebSocketProvider",
	component: InquiryWebSocketProvider,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		inquiryId: "inq-001",
		status: "connected",
		children: <ConsumerFixture />,
	},
} satisfies Meta<typeof InquiryWebSocketProvider>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Connected: Story = {};
export const Disconnected: Story = { args: { status: "disconnected" } };
