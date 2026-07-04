import type { Meta, StoryObj } from "@storybook/react";
import { RealtimeChatPanel } from "./RealtimeChatPanel";

const messages = [
	{
		id: "m1",
		senderId: "customer",
		senderType: "CUSTOMER",
		content: "예약 시간을 변경할 수 있을까요?",
		createdAt: "2026-07-04T10:00:00.000Z",
	},
	{
		id: "m2",
		senderId: "agent",
		senderType: "AGENT",
		content: "가능합니다. 원하시는 시간을 알려주세요.",
		createdAt: "2026-07-04T10:01:00.000Z",
		deliveredAt: "2026-07-04T10:01:01.000Z",
		readAt: "2026-07-04T10:01:10.000Z",
	},
] as never;

const meta = {
	title: "feature/RealtimeChatPanel",
	component: RealtimeChatPanel,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		inquiryId: "inq-001",
		messages,
		typingUserNames: ["김고객"],
		isWebSocketConnected: true,
		onSendMessage: () => undefined,
		onTypingStart: () => undefined,
		onTypingStop: () => undefined,
		onReconnect: () => undefined,
	},
} satisfies Meta<typeof RealtimeChatPanel>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Connected: Story = {
	render: (args) => (
		<div className="h-[640px] w-[520px]">
			<RealtimeChatPanel {...args} />
		</div>
	),
};
export const Disconnected: Story = {
	args: { isWebSocketConnected: false },
	render: Connected.render,
};
