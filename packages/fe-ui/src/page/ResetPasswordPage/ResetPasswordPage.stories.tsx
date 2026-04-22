import { PASSWORD_RULES } from "@cocrepo/constant";
import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { ResetPasswordPage } from "./ResetPasswordPage";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	component: ResetPasswordPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ResetPasswordPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderResetPasswordPage: Story["render"] = (args) => (
	<PageStoryStage>
		<div style={centeredCardStyle}>
			<ResetPasswordPage {...args} />
		</div>
	</PageStoryStage>
);

export const ValidatingLink: Story = {
	args: {
		step: "validating",
		passwordRules: PASSWORD_RULES,
		onSubmit: async () => null,
	},
	render: renderResetPasswordPage,
};

export const ReadyToReset: Story = {
	args: {
		step: "form",
		tokenEmail: "member@example.com",
		passwordRules: PASSWORD_RULES,
		onSubmit: async () => null,
	},
	render: renderResetPasswordPage,
};

export const ExpiredLink: Story = {
	args: {
		step: "invalid",
		tokenError: "재설정 링크가 만료되었습니다.",
		passwordRules: PASSWORD_RULES,
		onSubmit: async () => null,
	},
	render: renderResetPasswordPage,
};
