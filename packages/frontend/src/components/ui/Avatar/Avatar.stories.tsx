import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta = {
	title: "ui/Avatar",
	component: Avatar,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "사용자 아바타 컴포넌트입니다. 사용자 정보를 표시합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		showInfo: {
			control: "boolean",
			description: "전체 사용자 정보 표시 여부",
			defaultValue: true,
		},
		onMenuAction: {
			action: "menu-action",
			description: "메뉴 아이템 선택 시 호출되는 콜백 함수",
		},
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		showInfo: true,
	},
	parameters: {
		docs: {
			description: {
				story: "기본 아바타입니다.",
			},
		},
	},
};

export const 사용자정보표시: Story = {
	args: {
		showInfo: true,
	},
	parameters: {
		docs: {
			description: {
				story: "사용자 정보를 표시하는 아바타입니다.",
			},
		},
	},
};

export const 아바타만: Story = {
	args: {
		showInfo: false,
	},
	parameters: {
		docs: {
			description: {
				story: "아바타 이미지만 표시하는 아바타입니다.",
			},
		},
	},
};

export const 인터랙티브: Story = {
	args: {
		showInfo: true,
	},
	parameters: {
		docs: {
			description: {
				story: "인터랙티브 아바타입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		showInfo: true,
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 아바타 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
