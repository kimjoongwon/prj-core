import type { Meta, StoryObj } from "@storybook/react";
import { MessageCircleQuestionMark } from "lucide-react";
import { InquiryInfoCard } from "./InquiryInfoCard";

const meta = {
	title: "widget/InquiryInfoCard",
	component: InquiryInfoCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		inquiryNumber: "INQ-20260704-001",
		title: "예약 변경 문의",
		channel: "웹 채팅",
		channelIcon: <MessageCircleQuestionMark className="h-4 w-4" />,
		createdAt: "2026-07-04 10:30",
		sentiment: { type: "neutral", label: "보통", confidence: 0.72 },
		onlineParticipants: ["김온유", "상담원"],
	},
} satisfies Meta<typeof InquiryInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[460px]">
			<InquiryInfoCard {...args} />
		</div>
	),
};
