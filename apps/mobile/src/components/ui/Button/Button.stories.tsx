import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { Button } from "./index";
import type { ButtonProps } from "./Button";

const meta: Meta<ButtonProps> = {
	title: "components/Button",
	component: Button,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "테마를 지원하는 커스터마이즈 가능한 버튼 컴포넌트입니다.",
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: [
				"solid",
				"bordered",
				"light",
				"flat",
				"faded",
				"shadow",
				"ghost",
			],
			description: "버튼의 시각적 스타일 변형",
		},
		color: {
			control: { type: "select" },
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
			description: "버튼의 색상 테마",
		},
		size: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "버튼의 크기",
		},
		radius: {
			control: { type: "select" },
			options: ["none", "sm", "md", "lg", "full"],
			description: "버튼의 모서리 반지름",
		},
		isDisabled: {
			control: { type: "boolean" },
			description: "버튼 비활성화 여부",
		},
		isLoading: {
			control: { type: "boolean" },
			description: "버튼 로딩 상태 여부",
		},
		isIconOnly: {
			control: { type: "boolean" },
			description: "아이콘만 표시 여부",
		},
	},
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const 기본: Story = {
	args: {
		children: "버튼",
	},
	render: (args) => <Button {...args} />,
};

export const 주요: Story = {
	args: {
		children: "주요 버튼",
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 보조: Story = {
	args: {
		children: "보조 버튼",
		color: "secondary",
		variant: "bordered",
	},
	render: (args) => <Button {...args} />,
};

export const 위험: Story = {
	args: {
		children: "삭제",
		color: "danger",
	},
	render: (args) => <Button {...args} />,
};

export const 성공: Story = {
	args: {
		children: "저장",
		color: "success",
	},
	render: (args) => <Button {...args} />,
};

export const 경고: Story = {
	args: {
		children: "주의",
		color: "warning",
	},
	render: (args) => <Button {...args} />,
};

export const 로딩: Story = {
	args: {
		children: "로딩 중...",
		isLoading: true,
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 비활성화: Story = {
	args: {
		children: "비활성화된 버튼",
		isDisabled: true,
	},
	render: (args) => <Button {...args} />,
};

export const 작은크기: Story = {
	args: {
		children: "작은 버튼",
		size: "sm",
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 큰크기: Story = {
	args: {
		children: "큰 버튼",
		size: "lg",
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 경계선: Story = {
	args: {
		children: "경계선 버튼",
		variant: "bordered",
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 밝은색: Story = {
	args: {
		children: "밝은색 버튼",
		variant: "light",
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 플랫: Story = {
	args: {
		children: "플랫 버튼",
		variant: "flat",
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 페이드: Story = {
	args: {
		children: "페이드 버튼",
		variant: "faded",
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 그림자: Story = {
	args: {
		children: "그림자 버튼",
		variant: "shadow",
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 고스트: Story = {
	args: {
		children: "고스트 버튼",
		variant: "ghost",
		color: "primary",
	},
	render: (args) => <Button {...args} />,
};

export const 아이콘만: Story = {
	args: {
		children: "❤️",
		isIconOnly: true,
		color: "danger",
		variant: "light",
	},
	render: (args) => <Button {...args} />,
};

export const 플레이그라운드: Story = {
	args: {
		children: "플레이그라운드 버튼",
		color: "primary",
		variant: "solid",
		size: "md",
		radius: "md",
		isDisabled: false,
		isLoading: false,
		isIconOnly: false,
	},
	render: (args) => <Button {...args} />,
};
