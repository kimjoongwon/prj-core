import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { AlertBanner } from "./AlertBanner";

const meta = {
	title: "feedback/AlertBanner",
	component: AlertBanner,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { type: "info", title: "알림", message: "처리 결과를 확인해 주세요." },
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Danger: Story = {
	args: {
		type: "danger",
		title: "오류",
		message: "요청을 처리하지 못했습니다.",
	},
};
export const WithAction: Story = {
	args: { actions: <Button size="sm">다시 시도</Button> },
};
