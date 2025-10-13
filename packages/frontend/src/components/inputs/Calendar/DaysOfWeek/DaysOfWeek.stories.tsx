import type { Meta, StoryObj } from "@storybook/react";
import { DaysOfWeek } from "./DaysOfWeek";

const meta = {
	title: "Inputs/Calendar/DaysOfWeek",
	component: DaysOfWeek,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"캘린더에서 요일을 표시하는 헤더 컴포넌트입니다. 일요일부터 토요일까지의 요일을 표시합니다.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof DaysOfWeek>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {},
	render: () => (
		<div className="grid grid-cols-7 gap-1">
			<DaysOfWeek />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"기본적인 요일 헤더입니다. 주말(토요일, 일요일)은 빨간색으로 표시됩니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {},
	render: () => (
		<div className="grid grid-cols-7 gap-1">
			<DaysOfWeek />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "요일 헤더 컴포넌트를 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
