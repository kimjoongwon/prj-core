import type { Meta, StoryObj } from "@storybook/react";
import { InfoMessage } from "./InfoMessage";

const meta = {
	title: "ui/InfoMessage",
	component: InfoMessage,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"다양한 상태(정보, 경고, 오류, 성공)를 표시하는 메시지 컴포넌트입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		message: {
			control: "text",
			description: "메시지 내용",
		},
		variant: {
			control: "select",
			options: ["info", "warning", "error", "success"],
			description: "메시지 타입 (배경색과 텍스트 색상 결정)",
		},
		icon: {
			control: "text",
			description: "선택적 커스텀 아이콘",
		},
		className: {
			control: "text",
			description: "추가 CSS 클래스",
		},
	},
} satisfies Meta<typeof InfoMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 정보: Story = {
	args: {
		message: "이것은 정보 메시지입니다.",
		variant: "info",
	},
};

export const 경고: Story = {
	args: {
		message: "주의가 필요합니다.",
		variant: "warning",
	},
};

export const 오류: Story = {
	args: {
		message: "오류가 발생했습니다.",
		variant: "error",
	},
};

export const 성공: Story = {
	args: {
		message: "작업이 성공적으로 완료되었습니다.",
		variant: "success",
	},
};
