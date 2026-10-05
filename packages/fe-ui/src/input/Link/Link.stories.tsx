import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./Link";

const meta = {
	title: "input/Link",
	component: Link,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		children: "로그인으로 돌아가기",
		href: "/auth/login",
	},
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
	args: {
		children: "문서 열기",
		href: "https://heroui.com",
		rel: "noreferrer",
		target: "_blank",
	},
};
