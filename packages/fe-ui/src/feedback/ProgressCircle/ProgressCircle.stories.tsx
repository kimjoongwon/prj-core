import type { Meta, StoryObj } from "@storybook/react";
import { ProgressCircle } from "./ProgressCircle";

const meta = {
	title: "Ui/feedback/ProgressCircle",
	component: ProgressCircle,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"HeroUI ProgressCircle 컴포넌트의 feedback wrapper입니다. compound API를 그대로 유지합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		color: {
			control: "select",
			options: ["default", "success", "warning", "danger", "accent"],
			description: "원형 진행률 색상",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "원형 진행률 크기",
		},
		value: {
			control: "number",
			description: "현재 값 (0~100)",
		},
	},
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 64,
		color: "accent",
		size: "md",
	},
};

export const States: Story = {
	render: () => (
		<div className="flex items-center gap-6">
			<ProgressCircle value={20} color="accent" size="sm" />
			<ProgressCircle value={65} color="success" size="md" />
			<ProgressCircle isIndeterminate={true} color="warning" size="lg" />
		</div>
	),
};

export const Composition: Story = {
	render: () => (
		<ProgressCircle value={88} color="success" size="md">
			<ProgressCircle.Track>
				<ProgressCircle.TrackCircle />
				<ProgressCircle.FillCircle />
			</ProgressCircle.Track>
		</ProgressCircle>
	),
};
