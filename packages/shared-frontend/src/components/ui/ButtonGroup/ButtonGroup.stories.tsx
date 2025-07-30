import type { GroupButton } from "@shared/types";
import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
	title: "ui/ButtonGroup",
	component: ButtonGroup,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"좌측과 우측에 버튼들을 그룹으로 표시하는 컴포넌트입니다.",
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
	},
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleLeftButtons: GroupButton[] = [
	{
		children: "새로만들기",
		color: "primary",
	},
	{
		children: "편집",
		color: "default",
		variant: "bordered",
	},
];

const sampleRightButtons: GroupButton[] = [
	{
		children: "취소",
		color: "default",
		variant: "light",
	},
	{
		children: "저장",
		color: "success",
	},
];

export const 기본: Story = {
	args: {
		leftButtons: sampleLeftButtons,
		rightButtons: sampleRightButtons,
	},
	parameters: {
		docs: {
			description: {
				story:
					"좌측과 우측 모두에 버튼이 있는 기본 버튼 그룹입니다.",
			},
		},
	},
};

export const 좌측만: Story = {
	args: {
		leftButtons: [
			{
				children: "뒤로",
				color: "default",
				variant: "bordered",
			},
			{
				children: "새로고침",
				color: "primary",
				variant: "light",
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story: "좌측에만 버튼이 있는 버튼 그룹입니다.",
			},
		},
	},
};

export const 우측만: Story = {
	args: {
		rightButtons: [
			{
				children: "닫기",
				color: "danger",
				variant: "light",
			},
			{
				children: "제출",
				color: "primary",
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story: "우측에만 버튼이 있는 버튼 그룹입니다.",
			},
		},
	},
};

export const 링크버튼: Story = {
	args: {
		leftButtons: [
			{
				children: "홈",
				href: "/",
				color: "primary",
			},
			{
				children: "소개",
				href: "/about",
				color: "default",
				variant: "light",
			},
		],
		rightButtons: [
			{
				children: "연락처",
				href: "/contact",
				color: "secondary",
				variant: "bordered",
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story:
					"다른 페이지로 이동하는 링크 버튼들의 그룹입니다.",
			},
		},
	},
};

export const 폼액션: Story = {
	args: {
		leftButtons: [
			{
				children: "초기화",
				color: "warning",
				variant: "light",
			},
		],
		rightButtons: [
			{
				children: "취소",
				color: "default",
				variant: "bordered",
			},
			{
				children: "임시저장",
				color: "secondary",
				variant: "light",
			},
			{
				children: "발행",
				color: "success",
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story:
					"초기화, 취소, 저장, 발행 옵션이 있는 폼 액션용 버튼 그룹입니다.",
			},
		},
	},
};

export const 도구목록: Story = {
	args: {
		leftButtons: [
			{
				children: "← 뒤로",
				color: "default",
				variant: "light",
			},
			{
				children: "전체선택",
				color: "primary",
				variant: "light",
			},
			{
				children: "선택삭제",
				color: "danger",
				variant: "light",
				isDisabled: true,
			},
		],
		rightButtons: [
			{
				children: "필터",
				color: "default",
				variant: "bordered",
			},
			{
				children: "내보내기",
				color: "secondary",
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story:
					"내비게이션, 선택, 액션 버튼이 있는 도구 목록용 버튼 그룹입니다.",
			},
		},
	},
};

export const 비어있음: Story = {
	args: {},
	parameters: {
		docs: {
			description: {
				story: "버튼이 정의되지 않은 비어있는 버튼 그룹입니다.",
			},
		},
	},
};

export const 혼합타입: Story = {
	args: {
		leftButtons: [
			{
				children: "링크 버튼",
				href: "/example",
				color: "primary",
			},
			{
				children: "액션 버튼",
				color: "secondary",
			},
		],
		rightButtons: [
			{
				children: "외부 링크",
				href: "https://example.com",
				color: "default",
				variant: "bordered",
			},
			{
				children: "제출",
				color: "success",
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story: "링크 버튼과 액션 버튼이 혼합된 버튼 그룹입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		leftButtons: sampleLeftButtons,
		rightButtons: sampleRightButtons,
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 버튼 그룹 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
