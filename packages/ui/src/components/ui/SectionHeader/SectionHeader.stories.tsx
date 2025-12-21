import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeader } from "./SectionHeader";

const meta = {
	title: "UI/SectionHeader",
	component: SectionHeader,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"섹션 제목을 표시하는 컴포넌트입니다. 텍스트를 대문자로 변환하고 회색 캡션 스타일을 적용합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			control: "text",
			description: "섹션 제목 텍스트",
		},
		className: {
			control: "text",
			description: "추가 CSS 클래스",
		},
	},
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Section Title",
	},
};

export const LocationSection: Story = {
	args: {
		children: "LOCATION",
	},
};

export const ServiceTypeSection: Story = {
	args: {
		children: "SERVICE TYPE",
	},
};

export const Multiple: Story = {
	render: () => (
		<div className="space-y-6">
			<div>
				<SectionHeader>Personal Information</SectionHeader>
				<p className="text-sm">이름, 이메일, 전화번호 등의 개인 정보</p>
			</div>
			<div>
				<SectionHeader>Account Settings</SectionHeader>
				<p className="text-sm">계정 설정 및 보안 옵션</p>
			</div>
		</div>
	),
};
