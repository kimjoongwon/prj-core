import type { Meta, StoryObj } from "@storybook/react";
import { InquiryStatsCards } from "./InquiryStatsCards";

const meta = {
	title: "widget/InquiryStatsCards",
	component: InquiryStatsCards,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		stats: {
			total: 128,
			newCount: 9,
			inProgress: 24,
			resolved: 91,
			slaBreached: 4,
		},
		activeStatus: "IN_PROGRESS",
		onStatusClick: () => undefined,
	},
} satisfies Meta<typeof InquiryStatsCards>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[920px]">
			<InquiryStatsCards {...args} />
		</div>
	),
};
