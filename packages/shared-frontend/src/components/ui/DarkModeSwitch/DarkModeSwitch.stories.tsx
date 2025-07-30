import type { Meta, StoryObj } from "@storybook/react";
import { DarkModeSwitch } from "./DarkModeSwitch";

const meta = {
	title: "ui/DarkModeSwitch",
	component: DarkModeSwitch,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"라이트 모드와 다크 모드 간 전환이 가능한 토글 스위치 컴포넌트입니다. 화면의 모든 모서리 또는 인라인으로 위치시킬 수 있습니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		position: {
			control: "select",
			options: [
				"top-left",
				"top-right",
				"bottom-left",
				"bottom-right",
				"inline",
			],
			description: "다크 모드 스위치의 위치",
			defaultValue: "bottom-right",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "스위치 아이콘의 크기",
			defaultValue: "md",
		},
		className: {
			control: "text",
			description: "추가로 적용할 CSS 클래스",
		},
	},
} satisfies Meta<typeof DarkModeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {},
	parameters: {
		docs: {
			description: {
				story:
					"우측 하단에 위치한 중간 크기의 기본 다크 모드 스위치입니다.",
			},
		},
	},
};

export const 인라인: Story = {
	args: {
		position: "inline",
	},
	parameters: {
		docs: {
			description: {
				story:
					"다른 컴포넌트 내에서 사용하기 위해 인라인으로 위치한 다크 모드 스위치입니다.",
			},
		},
	},
};

export const 크기들: Story = {
	args: {
		position: "inline",
		size: "md",
	},
	parameters: {
		docs: {
			description: {
				story:
					"다크 모드 스위치의 다양한 크기들: 작음, 중간, 큼입니다.",
			},
		},
	},
};

export const 위치들: Story = {
	args: {
		position: "top-left",
	},
	parameters: {
		docs: {
			description: {
				story:
					"화면 모서리에서 사용 가능한 다크 모드 스위치의 모든 위치입니다.",
			},
		},
	},
};

export const 커스텀_스타일링: Story = {
	args: {
		position: "inline",
		className: "bg-blue-100 hover:bg-blue-200 border border-blue-300",
	},
	parameters: {
		docs: {
			description: {
				story: "커스텀 스타일이 적용된 다크 모드 스위치입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		position: "inline",
		size: "md",
	},
	parameters: {
		docs: {
			description: {
				story:
					"다양한 다크 모드 스위치 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
