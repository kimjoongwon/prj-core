import type { Meta, StoryObj } from "@storybook/react";
import { Meter } from "./Meter";

const meta = {
	title: "Ui/feedback/Meter",
	component: Meter,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"HeroUI Meter 컴포넌트의 feedback wrapper입니다. compound API를 그대로 유지합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		color: {
			control: "select",
			options: ["default", "success", "warning", "danger", "accent"],
			description: "미터 색상",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "미터 크기",
		},
		value: {
			control: "number",
			description: "현재 값 (0~100)",
		},
	},
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 68,
		color: "accent",
		size: "md",
		className: "w-72",
	},
};

export const States: Story = {
	render: () => (
		<div className="w-72 space-y-5">
			<Meter value={25} color="accent" size="sm" className="w-full">
				<Meter.Track>
					<Meter.Fill />
				</Meter.Track>
				<Meter.Output>25%</Meter.Output>
			</Meter>
			<Meter value={78} color="success" size="md" className="w-full">
				<Meter.Track>
					<Meter.Fill />
				</Meter.Track>
				<Meter.Output>78%</Meter.Output>
			</Meter>
			<Meter value={100} color="warning" size="lg" className="w-full">
				<Meter.Track>
					<Meter.Fill />
				</Meter.Track>
				<Meter.Output>100%</Meter.Output>
			</Meter>
		</div>
	),
};

export const Composition: Story = {
	render: () => (
		<Meter value={82} color="success" size="lg" className="w-72">
			<Meter.Track>
				<Meter.Fill />
			</Meter.Track>
			<Meter.Output>82% 사용 중</Meter.Output>
		</Meter>
	),
};
