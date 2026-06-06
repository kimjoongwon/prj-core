import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./Separator";

const meta = {
	title: "Layouts/Separator",
	component: Separator,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "HeroUI Separator의 구조적 래퍼입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
		variant: {
			control: "text",
		},
		className: {
			control: "text",
		},
	},
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		orientation: "horizontal",
	},
	parameters: {
		docs: {
			description: {
				story: "기본 가로 구분선입니다.",
			},
		},
	},
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-3">
			<Separator />
			<Separator orientation="vertical" className="h-12" />
			<Separator
				orientation="horizontal"
				variant="secondary"
				className="w-48"
			/>
		</div>
	),
	parameters: {
		docs: {
			story: "주요 Variant를 간단히 확인할 수 있는 예시입니다.",
		},
	},
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
		className: "h-12",
	},
	parameters: {
		docs: {
			description: {
				story: "높이 지정이 가능한 세로 구분선입니다.",
			},
		},
	},
};

export const Horizontal: Story = Default;

export const Dashed: Story = {
	args: {
		orientation: "horizontal",
		variant: "secondary",
		className: "w-48",
	},
	parameters: {
		docs: {
			description: {
				story: "점선 스타일 분기 구분선입니다.",
			},
		},
	},
};

export const Composition: Story = {
	render: (args) => <Separator.Root {...args} />,
	args: {
		orientation: "horizontal",
		variant: "default",
		className: "w-48",
	},
	parameters: {
		docs: {
			description: {
				story: "HeroUI Compound API의 Separator.Root 사용 예시입니다.",
			},
		},
	},
};

export const SolidRoot: Story = Composition;
