import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";

const meta = {
	title: "data-display/Chip",
	component: Chip,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "커스터마이증 가능한 칩 컴포넌트입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "soft", "tertiary"],
			description: "칩의 시각적 스타일 변형",
			defaultValue: "secondary",
		},
		color: {
			control: "select",
			options: ["accent", "danger", "default", "success", "warning"],
			description: "칩의 색상 테마",
			defaultValue: "default",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "칩의 크기",
			defaultValue: "md",
		},
		children: {
			control: "text",
			description: "칩 내부에 표시할 컨텐칠",
		},
	},
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		children: "칩",
	},
	parameters: {
		docs: {
			description: {
				story: "기본 칩입니다.",
			},
		},
	},
};

export const 강조: Story = {
	args: {
		children: "강조",
		color: "accent",
	},
	parameters: {
		docs: {
			description: {
				story: "강조 색상의 칩입니다.",
			},
		},
	},
};

export const 성공: Story = {
	args: {
		children: "성공",
		color: "success",
	},
	parameters: {
		docs: {
			description: {
				story: "긍정적인 상태를 나타내는 성공 칩입니다.",
			},
		},
	},
};

export const 경고: Story = {
	args: {
		children: "경고",
		color: "warning",
	},
	parameters: {
		docs: {
			description: {
				story: "주의가 필요한 상태를 나타내는 경고 칩입니다.",
			},
		},
	},
};

export const 위험: Story = {
	args: {
		children: "오류",
		color: "danger",
	},
	parameters: {
		docs: {
			description: {
				story: "오류 상태를 나타내는 위험 칩입니다.",
			},
		},
	},
};

export const 외곽선: Story = {
	args: {
		children: "외곽선 칩",
		variant: "tertiary",
		color: "accent",
	},
	parameters: {
		docs: {
			description: {
				story: "외곽선 스타일의 칩입니다.",
			},
		},
	},
};

export const 부드러운배경: Story = {
	args: {
		children: "부드러운 배경 칩",
		variant: "soft",
		color: "accent",
	},
	parameters: {
		docs: {
			description: {
				story: "부드러운 배경색을 가진 칩입니다.",
			},
		},
	},
};

export const 작은크기: Story = {
	args: {
		children: "작은 칩",
		size: "sm",
		color: "accent",
	},
	parameters: {
		docs: {
			description: {
				story: "작은 크기의 칩입니다.",
			},
		},
	},
};

export const 큰크기: Story = {
	args: {
		children: "큰 칩",
		size: "lg",
		color: "accent",
	},
	parameters: {
		docs: {
			description: {
				story: "큰 크기의 칩입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		children: "플레이그라운드 칩",
		color: "accent",
		variant: "primary",
		size: "md",
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 칩 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
