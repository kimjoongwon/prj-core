import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { Alert } from "./Alert";

const meta = {
	title: "feedback/Alert",
	component: Alert,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		status: "accent",
		title: "알림",
		description: "처리 결과를 확인해 주세요.",
	},
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Danger: Story = {
	args: {
		status: "danger",
		title: "오류",
		description: "요청을 처리하지 못했습니다.",
	},
};
export const WithAction: Story = {
	args: { actions: <Button size="sm">다시 시도</Button> },
};
