import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup } from "./ButtonGroup";
import type { ButtonGroupItem } from "./ButtonGroupItem.props";

const meta = {
	title: "Inputs/ButtonGroup",
	component: ButtonGroup,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "HeroUI ButtonGroup으로 좌측/우측 액션 묶음을 표시합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		leftButtons: {
			control: "object",
			description: "좌측에 표시할 버튼 배열",
		},
		rightButtons: {
			control: "object",
			description: "우측에 표시할 버튼 배열",
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
	},
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleLeftButtons: ButtonGroupItem[] = [
	{
		id: "create",
		children: "새로 만들기",
	},
	{
		id: "edit",
		children: "편집",
		variant: "outline",
	},
];

const sampleRightButtons: ButtonGroupItem[] = [
	{
		id: "cancel",
		children: "취소",
		variant: "ghost",
	},
	{
		id: "save",
		children: "저장",
		variant: "secondary",
	},
];

export const 기본: Story = {
	args: {
		leftButtons: sampleLeftButtons,
		rightButtons: sampleRightButtons,
		size: "sm",
	},
};

export const 좌측만: Story = {
	args: {
		leftButtons: [
			{
				id: "back",
				children: "뒤로",
				variant: "outline",
			},
			{
				id: "refresh",
				children: "새로고침",
				variant: "ghost",
			},
		],
		size: "sm",
	},
};

export const 우측만: Story = {
	args: {
		rightButtons: [
			{
				id: "close",
				children: "닫기",
				variant: "danger-soft",
			},
			{
				id: "submit",
				children: "제출",
			},
		],
		size: "sm",
	},
};

export const 폼액션: Story = {
	args: {
		leftButtons: [
			{
				id: "reset",
				children: "초기화",
				variant: "ghost",
			},
		],
		rightButtons: [
			{
				id: "cancel",
				children: "취소",
				variant: "outline",
			},
			{
				id: "draft",
				children: "임시저장",
				variant: "tertiary",
			},
			{
				id: "publish",
				children: "발행",
				variant: "secondary",
			},
		],
		size: "sm",
	},
};

export const 도구목록: Story = {
	args: {
		leftButtons: [
			{
				id: "back",
				children: "뒤로",
				variant: "ghost",
			},
			{
				id: "select-all",
				children: "전체선택",
				variant: "tertiary",
			},
			{
				id: "delete-selected",
				children: "선택삭제",
				variant: "danger-soft",
				isDisabled: true,
			},
		],
		rightButtons: [
			{
				id: "filter",
				children: "필터",
				variant: "outline",
			},
			{
				id: "export",
				children: "내보내기",
				variant: "secondary",
			},
		],
		size: "sm",
	},
};

export const 세로: Story = {
	args: {
		leftButtons: sampleLeftButtons,
		orientation: "vertical",
		variant: "tertiary",
	},
};

export const 비어있음: Story = {
	args: {},
};

export const 플레이그라운드: Story = {
	args: {
		leftButtons: sampleLeftButtons,
		rightButtons: sampleRightButtons,
		size: "md",
		variant: "primary",
	},
};
