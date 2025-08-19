import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { Logo } from "./index";
import type { LogoProps } from "./Logo";

const meta: Meta<LogoProps> = {
	title: "components/ui/Logo",
	component: Logo,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "브랜드 로고를 표시하는 텍스트 컴포넌트입니다.",
			},
		},
	},
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "로고의 크기",
		},
		color: {
			control: { type: "select" },
			options: [
				"foreground",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
				"default",
			],
			description: "로고의 색상",
		},
	},
};

export default meta;
type Story = StoryObj<LogoProps>;

export const 기본: Story = {
	args: {},
	render: (args) => <Logo {...args} />,
};

export const 작은크기: Story = {
	args: {
		size: "sm",
	},
	render: (args) => <Logo {...args} />,
};

export const 중간크기: Story = {
	args: {
		size: "md",
	},
	render: (args) => <Logo {...args} />,
};

export const 큰크기: Story = {
	args: {
		size: "lg",
	},
	render: (args) => <Logo {...args} />,
};

export const 주요색상: Story = {
	args: {
		color: "primary",
	},
	render: (args) => <Logo {...args} />,
};

export const 보조색상: Story = {
	args: {
		color: "secondary",
	},
	render: (args) => <Logo {...args} />,
};

export const 플레이그라운드: Story = {
	args: {
		size: "md",
		color: "primary",
	},
	render: (args) => <Logo {...args} />,
};