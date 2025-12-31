import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
	title: "ui/Button",
	component: Button,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "커스터마이증 가능한 버튼 컴포넌트입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
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
			defaultValue: "solid",
		},
		color: {
			control: "select",
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
			description: "버튼의 색상 테마",
			defaultValue: "default",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "버튼의 크기",
			defaultValue: "md",
		},
		radius: {
			control: "select",
			options: ["none", "sm", "md", "lg", "full"],
			description: "버튼의 모서리 반지름",
			defaultValue: "md",
		},
		isDisabled: {
			control: "boolean",
			description: "버튼 비활성화 여부",
			defaultValue: false,
		},
		isLoading: {
			control: "boolean",
			description: "버튼 로딩 상태 여부",
			defaultValue: false,
		},
		fullWidth: {
			control: "boolean",
			description: "전체 너비 사용 여부",
			defaultValue: false,
		},
		isIconOnly: {
			control: "boolean",
			description: "아이콘만 표시 여부",
			defaultValue: false,
		},
		children: {
			control: "text",
			description: "버튼 내부에 표시할 컨텐츠",
		},
		onPress: {
			description: "버튼 클릭 시 호출되는 콜백 함수",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		children: "버튼",
	},
	parameters: {
		docs: {
			description: {
				story: "기본 버튼입니다.",
			},
		},
	},
};

export const 주요: Story = {
	args: {
		children: "주요 버튼",
		color: "primary",
	},
	parameters: {
		docs: {
			description: {
				story: "주요 색상의 버튼입니다.",
			},
		},
	},
};

export const 보조: Story = {
	args: {
		children: "보조 버튼",
		color: "secondary",
		variant: "bordered",
	},
	parameters: {
		docs: {
			description: {
				story: "보조 색상의 버튼입니다.",
			},
		},
	},
};

export const 위험: Story = {
	args: {
		children: "삭제",
		color: "danger",
	},
	parameters: {
		docs: {
			description: {
				story: "위험한 작업을 위한 버튼입니다.",
			},
		},
	},
};

export const 성공: Story = {
	args: {
		children: "저장",
		color: "success",
	},
	parameters: {
		docs: {
			description: {
				story: "긍정적인 작업을 위한 버튼입니다.",
			},
		},
	},
};

export const 로딩: Story = {
	args: {
		children: "로딩 중...",
		isLoading: true,
		color: "primary",
	},
	parameters: {
		docs: {
			description: {
				story: "로딩 상태의 버튼입니다.",
			},
		},
	},
};

export const 비활성화: Story = {
	args: {
		children: "비활성화된 버튼",
		isDisabled: true,
	},
	parameters: {
		docs: {
			description: {
				story: "상호작용이 불가능한 버튼입니다.",
			},
		},
	},
};

export const 작은크기: Story = {
	args: {
		children: "작은 버튼",
		size: "sm",
	},
	parameters: {
		docs: {
			description: {
				story: "작은 크기의 버튼입니다.",
			},
		},
	},
};

export const 큰크기: Story = {
	args: {
		children: "큰 버튼",
		size: "lg",
	},
	parameters: {
		docs: {
			description: {
				story: "큰 크기의 버튼입니다.",
			},
		},
	},
};

export const 경계선: Story = {
	args: {
		children: "경계선 버튼",
		variant: "bordered",
		color: "primary",
	},
	parameters: {
		docs: {
			description: {
				story: "경계선이 있는 버튼입니다.",
			},
		},
	},
};

export const 전체너비: Story = {
	args: {
		children: "전체 너비 버튼",
		fullWidth: true,
		color: "primary",
	},
	parameters: {
		docs: {
			description: {
				story: "컸테이너의 전체 너비를 차지하는 버튼입니다.",
			},
		},
	},
};

export const 아이콘만: Story = {
	args: {
		children: "❤️",
		isIconOnly: true,
		color: "danger",
		variant: "light",
	},
	parameters: {
		docs: {
			description: {
				story: "텍스트 없이 아이콘만 있는 버튼입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		children: "플레이그라운드 버튼",
		color: "primary",
		variant: "solid",
		size: "md",
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 버튼 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
