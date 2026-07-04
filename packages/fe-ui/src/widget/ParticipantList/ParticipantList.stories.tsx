import type { Meta, StoryObj } from "@storybook/react";
import { ParticipantList } from "./ParticipantList";

const participants = [
	{
		id: "customer",
		name: "김고객",
		role: "customer",
		isOnline: true,
		isTyping: true,
	},
	{ id: "agent", name: "이상담", role: "agent", isOnline: true },
	{ id: "supervisor", name: "박관리", role: "supervisor", isOnline: false },
] as const;

const meta = {
	title: "widget/ParticipantList",
	component: ParticipantList,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		participants: [...participants],
		onParticipantClick: () => undefined,
	},
} satisfies Meta<typeof ParticipantList>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[360px]">
			<ParticipantList {...args} />
		</div>
	),
};
export const Empty: Story = {
	args: { participants: [] },
	render: Default.render,
};
