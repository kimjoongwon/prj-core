import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta = {
	title: "Ui/feedback/Spinner",
	component: Spinner,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"HeroUI Spinner 컴포넌트의 feedback wrapper입니다. 로딩 상태 표현용입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		color: {
			control: "select",
			options: ["accent", "success", "warning", "danger", "current"],
			description: "스피너 색상",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "스피너 크기",
		},
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		size: "md",
		color: "accent",
	},
};

export const Variants: Story = {
	render: () => (
		<div className="flex gap-6">
			<Spinner size="sm" color="current" />
			<Spinner size="md" color="accent" />
			<Spinner size="lg" color="success" />
		</div>
	),
};
