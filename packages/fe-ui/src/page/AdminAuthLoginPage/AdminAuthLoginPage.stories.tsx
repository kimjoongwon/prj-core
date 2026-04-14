import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { AdminAuthLoginPage } from "./AdminAuthLoginPage";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 420,
};

const meta = {
	component: AdminAuthLoginPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof AdminAuthLoginPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderAdminAuthLoginPage: Story["render"] = (args) => (
	<PageStoryStage>
		<div style={centeredCardStyle}>
			<AdminAuthLoginPage {...args} />
		</div>
	</PageStoryStage>
);

export const RetryRequired: Story = {
	args: {
		errorMessage: "관리자 인증 세션이 만료되었습니다. 다시 로그인해 주세요.",
		isRedirecting: false,
		onClickRetry: () => undefined,
	},
	render: renderAdminAuthLoginPage,
};

export const Redirecting: Story = {
	args: {
		errorMessage: "",
		isRedirecting: true,
	},
	render: renderAdminAuthLoginPage,
};

export const RetryUnavailable: Story = {
	args: {
		errorMessage: "관리자 인증 구성을 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.",
		isRedirecting: false,
	},
	render: renderAdminAuthLoginPage,
};
