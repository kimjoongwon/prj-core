import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
	title: "action/ButtonGroup",
	component: ButtonGroup,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"HeroUI ButtonGroup 문서와 같은 children composition 래퍼입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			table: {
				disable: true,
			},
			control: false,
		},
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
		variant: {
			control: "select",
			options: [
				"primary",
				"secondary",
				"tertiary",
				"outline",
				"ghost",
				"danger",
				"danger-soft",
			],
		},
		isDisabled: {
			control: "boolean",
		},
		fullWidth: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		"aria-label": "문서 작업",
		size: "sm",
	},
	render: (args) => (
		<ButtonGroup {...args}>
			<Button>새로 만들기</Button>
			<Button>편집</Button>
			<Button>삭제</Button>
		</ButtonGroup>
	),
};

export const 구분선: Story = {
	args: {
		"aria-label": "에디터 작업",
		size: "sm",
	},
	render: (args) => (
		<ButtonGroup {...args}>
			<Button>실행 취소</Button>
			<Button>다시 실행</Button>
			<ButtonGroup.Separator />
			<Button>저장</Button>
		</ButtonGroup>
	),
};

export const 세로: Story = {
	args: {
		"aria-label": "세로 작업",
		orientation: "vertical",
		size: "sm",
	},
	render: (args) => (
		<ButtonGroup {...args}>
			<Button>위로</Button>
			<Button>가운데</Button>
			<Button>아래로</Button>
		</ButtonGroup>
	),
};

export const 비활성화: Story = {
	args: {
		"aria-label": "비활성 작업",
		isDisabled: true,
		size: "sm",
	},
	render: (args) => (
		<ButtonGroup {...args}>
			<Button>초기화</Button>
			<Button>취소</Button>
			<Button>저장</Button>
		</ButtonGroup>
	),
};

export const 플레이그라운드: Story = {
	args: {
		"aria-label": "플레이그라운드 작업",
		size: "md",
		variant: "primary",
	},
	render: (args) => (
		<ButtonGroup {...args}>
			<Button>필터</Button>
			<Button>내보내기</Button>
			<Button>공유</Button>
		</ButtonGroup>
	),
};
