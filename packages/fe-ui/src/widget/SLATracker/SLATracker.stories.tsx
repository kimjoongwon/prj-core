import type { Meta, StoryObj } from "@storybook/react";
import { SLATracker } from "./SLATracker";

const meta = {
	title: "widget/SLATracker",
	component: SLATracker,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		firstResponse: {
			label: "첫 응답",
			elapsedMinutes: 24,
			targetMinutes: 60,
			isCompleted: true,
		},
		resolution: { label: "해결", elapsedMinutes: 180, targetMinutes: 240 },
	},
} satisfies Meta<typeof SLATracker>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[360px]">
			<SLATracker {...args} />
		</div>
	),
};
export const Breached: Story = {
	args: {
		resolution: {
			label: "해결",
			elapsedMinutes: 300,
			targetMinutes: 240,
			isBreached: true,
		},
	},
	render: Default.render,
};
