import type { Meta, StoryObj } from "@storybook/react";
import { Copyright } from "./Copyright";

const meta = {
	title: "ui/Copyright",
	component: Copyright,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"현재 년도와 회사명을 표시하는 간단한 저작권 컴포넌트입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		companyName: {
			control: "text",
			description: "저작권 고지에 표시할 회사명",
		},
		className: {
			control: "text",
			description: "추가 CSS 클래스",
		},
	},
} satisfies Meta<typeof Copyright>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		companyName: "오쿠만 주식회사",
	},
	parameters: {
		docs: {
			description: {
				story: "회사명이 포함된 기본 저작권 고지입니다.",
			},
		},
	},
};

export const 긴회사명: Story = {
	args: {
		companyName: "매우 긴 회사 이름 기술 국제 주식회사",
	},
	parameters: {
		docs: {
			description: {
				story: "긴 회사명이 있는 저작권 고지입니다.",
			},
		},
	},
};

export const 커스텀스타일: Story = {
	args: {
		companyName: "커스텀 스타일 주식회사",
		className: "text-blue-600 font-semibold",
	},
	parameters: {
		docs: {
			description: {
				story: "커스텀 스타일이 적용된 저작권 고지입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		companyName: "귀하의 회사",
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 저작권 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
