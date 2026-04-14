import type { Meta, StoryObj } from "@storybook/react";
import { IdpAuthLoginPage } from "./IdpAuthLoginPage";

const meta = {
	component: IdpAuthLoginPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof IdpAuthLoginPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RetryRequired: Story = {
	args: {
		errorMessage: "로그인 페이지를 준비하지 못했습니다. 다시 시도해 주세요.",
		isRedirecting: false,
		onClickRetry: () => undefined,
	},
};

export const Redirecting: Story = {
	args: {
		errorMessage: "",
		isRedirecting: true,
	},
};
