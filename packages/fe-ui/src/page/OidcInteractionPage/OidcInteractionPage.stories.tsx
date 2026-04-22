import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryStage } from "../storybookFrame";
import { OidcInteractionPage } from "./OidcInteractionPage";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	component: OidcInteractionPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof OidcInteractionPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderOidcInteractionPage: Story["render"] = (args) => (
	<PageStoryStage>
		<div style={centeredCardStyle}>
			<OidcInteractionPage {...args} />
		</div>
	</PageStoryStage>
);

export const Loading: Story = {
	args: {
		mode: "loading",
	},
	render: renderOidcInteractionPage,
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
	render: renderOidcInteractionPage,
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
	render: renderOidcInteractionPage,
};

export const ExpiredInteraction: Story = {
	args: {
		mode: "error",
		errorMessage: "요청한 인증 세션이 만료되어 다시 로그인이 필요합니다.",
		isExpiredInteraction: true,
		onClickRecoveryButton: () => undefined,
	},
	render: renderOidcInteractionPage,
};
