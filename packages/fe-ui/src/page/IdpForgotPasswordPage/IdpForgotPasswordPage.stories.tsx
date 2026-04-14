import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { IdpForgotPasswordPage } from "./IdpForgotPasswordPage";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	component: IdpForgotPasswordPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof IdpForgotPasswordPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderIdpForgotPasswordPage: Story["render"] = (args) => (
	<PageStoryStage>
		<div style={centeredCardStyle}>
			<IdpForgotPasswordPage {...args} />
		</div>
	</PageStoryStage>
);

export const Default: Story = {
	args: {
		onSubmit: async () => null,
	},
	render: renderIdpForgotPasswordPage,
};

export const UnknownAccount: Story = {
	args: {
		onSubmit: async () => "등록된 이메일을 찾을 수 없습니다.",
	},
	render: renderIdpForgotPasswordPage,
};
