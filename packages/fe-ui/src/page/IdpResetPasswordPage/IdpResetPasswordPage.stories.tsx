import { PASSWORD_RULES } from "@cocrepo/constant";
import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { IdpResetPasswordPage } from "./IdpResetPasswordPage";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	component: IdpResetPasswordPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof IdpResetPasswordPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderIdpResetPasswordPage: Story["render"] = (args) => (
	<PageStoryStage>
		<div style={centeredCardStyle}>
			<IdpResetPasswordPage {...args} />
		</div>
	</PageStoryStage>
);

export const ValidatingLink: Story = {
	args: {
		step: "validating",
		passwordRules: PASSWORD_RULES,
		onSubmit: async () => null,
	},
	render: renderIdpResetPasswordPage,
};

export const ReadyToReset: Story = {
	args: {
		step: "form",
		tokenEmail: "member@example.com",
		passwordRules: PASSWORD_RULES,
		onSubmit: async () => null,
	},
	render: renderIdpResetPasswordPage,
};

export const ExpiredLink: Story = {
	args: {
		step: "invalid",
		tokenError: "재설정 링크가 만료되었습니다.",
		passwordRules: PASSWORD_RULES,
		onSubmit: async () => null,
	},
	render: renderIdpResetPasswordPage,
};
