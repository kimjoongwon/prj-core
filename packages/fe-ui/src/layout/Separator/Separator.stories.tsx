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
		className: "h-0.5 w-48 bg-divider",
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
			<Separator className="h-0.5 w-48 bg-divider" />
			<Separator orientation="vertical" className="h-12 w-1 bg-divider" />
			<Separator
				orientation="horizontal"
				variant="secondary"
				className="h-0.5 w-48 bg-divider"
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
		className: "h-12 w-1 bg-divider",
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
		className: "w-48 border-divider border-t-2 border-dashed bg-transparent",
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
		className: "h-0.5 w-48 bg-divider",
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
