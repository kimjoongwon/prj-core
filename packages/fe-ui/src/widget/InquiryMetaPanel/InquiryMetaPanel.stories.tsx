import type { Meta, StoryObj } from "@storybook/react";
import { InquiryMetaPanel } from "./InquiryMetaPanel";

const statusOptions = [
	{ value: "NEW", text: "신규" },
	{ value: "IN_PROGRESS", text: "진행중" },
	{ value: "RESOLVED", text: "해결" },
];
const priorityOptions = [
	{ value: "LOW", text: "낮음" },
	{ value: "NORMAL", text: "보통" },
	{ value: "HIGH", text: "높음" },
];
const categoryOptions = [
	{ value: "BOOKING", text: "예약" },
	{ value: "TECHNICAL", text: "기술 지원" },
];
const assigneeOptions = [
	{ value: "agent-1", text: "이상담" },
	{ value: "agent-2", text: "박지원" },
];
const meta = {
	title: "widget/InquiryMetaPanel",
	component: InquiryMetaPanel,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		status: "IN_PROGRESS",
		statusOptions,
		onStatusChange: () => undefined,
		priority: "HIGH",
		priorityOptions,
		onPriorityChange: () => undefined,
		category: "BOOKING",
		categoryOptions,
		onCategoryChange: () => undefined,
		assigneeId: "agent-1",
		assigneeName: "이상담",
		assigneeOptions,
		onAssigneeChange: () => undefined,
		tags: ["예약", "긴급"],
		onTagAdd: () => undefined,
		onTagRemove: () => undefined,
	},
} satisfies Meta<typeof InquiryMetaPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Editable: Story = {
	render: (args) => (
		<div className="w-[360px]">
			<InquiryMetaPanel {...args} />
		</div>
	),
};
export const ReadOnly: Story = {
	args: { isEditable: false },
	render: Editable.render,
};
