import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@heroui/react";
import { PageTitleBar } from "./PageTitleBar";

const meta: Meta<typeof PageTitleBar> = {
	title: "Widget/PageTitleBar",
	component: PageTitleBar,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PageLevel: Story = {
	args: {
		title: "이용자 목록",
		description: "시스템에 등록된 이용자를 조회합니다.",
		actions: <Button size="sm">이용자 등록</Button>,
	},
};

export const SectionLevel: Story = {
	args: {
		level: 2,
		title: "기본 정보",
		description: "등록/수정에 필요한 기본 필드를 입력합니다.",
	},
};
