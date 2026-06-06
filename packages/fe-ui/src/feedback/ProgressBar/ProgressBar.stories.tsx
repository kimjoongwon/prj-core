import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta = {
	title: "Ui/feedback/ProgressBar",
	component: ProgressBar,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"HeroUI ProgressBar 컴포넌트의 feedback wrapper입니다. compound API를 그대로 유지합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		color: {
			control: "select",
			options: ["default", "success", "warning", "danger", "accent"],
			description: "진행 바 색상",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "진행 바 크기",
		},
		value: {
			control: "number",
			description: "현재 값 (0~100)",
		},
	},
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 54,
		color: "accent",
		size: "md",
		className: "w-72",
	},
};

export const States: Story = {
	render: () => (
		<div className="w-72 space-y-4">
			<ProgressBar value={20} color="accent" size="sm" />
			<ProgressBar value={60} color="success" size="md" />
			<ProgressBar isIndeterminate={true} color="warning" size="lg" />
		</div>
	),
};

export const Variants: Story = {
	render: () => (
		<div className="w-72 space-y-3">
			<ProgressBar value={30} color="default" size="sm" />
			<ProgressBar value={55} color="success" size="md" />
			<ProgressBar value={80} color="warning" size="lg" />
		</div>
	),
};

export const Composition: Story = {
	render: () => (
		<ProgressBar value={70} color="success" size="md" className="w-72">
			<ProgressBar.Track>
				<ProgressBar.Fill />
			</ProgressBar.Track>
			<ProgressBar.Output>70%</ProgressBar.Output>
		</ProgressBar>
	),
};
