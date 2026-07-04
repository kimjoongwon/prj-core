import type { Meta, StoryObj } from "@storybook/react";
import { Users } from "lucide-react";
import { StatsCard } from "./StatsCard";

const meta = {
	title: "widget/StatsCard",
	component: StatsCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		title: "활성 사용자",
		value: 1280,
		icon: <Users className="size-5" />,
		color: "primary",
		description: "지난 30일 기준",
		change: { value: 12, type: "increase" },
	},
} satisfies Meta<typeof StatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[240px]">
			<StatsCard {...args} />
		</div>
	),
};
export const Decrease: Story = {
	args: { color: "danger", change: { value: 8, type: "decrease" } },
	render: Default.render,
};
