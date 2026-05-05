import type { Meta, StoryObj } from "@storybook/react";
import { createStorybookMock } from "../storybookMock";
import { OidcClientCreatePage } from "./OidcClientCreatePage";

const defaultArgs = {
	formState: {
		clientId: "client-1",
		clientSecret: "client-secret-1",
		defaultReturnTo: "default-return-to-1",
		errors: {},
		grantTypes: ["authorization_code", "refresh_token"],
		isPublic: false,
		loginUrl: "https://example.com/login-url-1",
		loginUiBrandColor: "#2563eb",
		loginUiBrandLabel: "Client Brand",
		loginUiDescription: "Client별 로그인 안내 문구입니다.",
		loginUiHeadline: "Client 로그인",
		loginUiMobileFullScreen: false,
		loginUiShowIntroPanel: true,
		loginUiVariant: "branded",
		logoUri: "https://placehold.co/96x96/png?text=Logo+1",
		policyUri: "https://example.com/policy-1",
		redirectUriErrors: createStorybookMock("redirectUriErrors") as never,
		redirectUris: [
			"https://example.com/auth/callback",
			"https://example.com/auth/secondary",
		],
		responseTypes: ["code"],
		scope: "scope-1",
		skipConsent: false,
		tokenEndpointAuthMethod: "token-endpoint-auth-method-1",
		tosUri: "https://example.com/tos-uri-1",
		useCustomLoginUi: true,
	},
	isSubmitting: false,
	onClickBackButton: (..._args: never[]) => undefined,
	onSubmit: (..._args: never[]) => undefined,
};

const busyArgs = {
	...defaultArgs,
	isSubmitting: true,
};

const meta = {
	component: OidcClientCreatePage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof OidcClientCreatePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs as never,
};
