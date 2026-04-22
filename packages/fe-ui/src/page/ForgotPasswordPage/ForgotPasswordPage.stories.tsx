import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { ForgotPasswordPage } from "./ForgotPasswordPage";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	component: ForgotPasswordPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ForgotPasswordPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderForgotPasswordPage: Story["render"] = (args) => (
	<PageStoryStage>
		<div style={centeredCardStyle}>
			<ForgotPasswordPage {...args} />
		</div>
	</PageStoryStage>
);

export const Default: Story = {
	args: {
		onSubmit: async () => null,
	},
	render: renderForgotPasswordPage,
};

export const UnknownAccount: Story = {
	args: {
		onSubmit: async () => "등록된 이메일을 찾을 수 없습니다.",
	},
	render: renderForgotPasswordPage,
};
