import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { IdpInteractionPage } from "./IdpInteractionPage";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	component: IdpInteractionPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof IdpInteractionPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderIdpInteractionPage: Story["render"] = (args) => (
	<PageStoryStage>
		<div style={centeredCardStyle}>
			<IdpInteractionPage {...args} />
		</div>
	</PageStoryStage>
);

export const Loading: Story = {
	args: {
		mode: "loading",
	},
	render: renderIdpInteractionPage,
};

export const Login: Story = {
	args: {
		mode: "login",
		client: {
			clientId: "swagger-web",
			name: "Swagger Web",
		},
		onSubmitLogin: async () => null,
		onAbortInteraction: () => undefined,
	},
	render: renderIdpInteractionPage,
};

export const Consent: Story = {
	args: {
		mode: "consent",
		client: {
			clientId: "proposal-web",
			name: "Proposal Web",
		},
		missingScopes: ["openid", "profile", "email"],
		onConfirmConsent: async () => null,
		onAbortInteraction: () => undefined,
	},
	render: renderIdpInteractionPage,
};

export const ExpiredInteraction: Story = {
	args: {
		mode: "error",
		errorMessage: "요청한 인증 세션이 만료되어 다시 로그인이 필요합니다.",
		isExpiredInteraction: true,
		onClickRecoveryButton: () => undefined,
	},
	render: renderIdpInteractionPage,
};
