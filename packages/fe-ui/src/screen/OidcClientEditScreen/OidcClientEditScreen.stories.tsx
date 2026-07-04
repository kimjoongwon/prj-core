import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { OidcClientEditScreen } from "./OidcClientEditScreen";

const defaultState = {
	clientId: "admin-web",
	name: "Admin Web",
	clientSecret: "client-secret",
	isPublic: false,
	tokenEndpointAuthMethod: "client_secret_basic",
	grantTypes: ["authorization_code", "refresh_token"],
	responseTypes: ["code"],
	scope: "openid profile email",
	isFirstParty: true,
	skipConsent: true,
	redirectUris: [
		"https://admin.example.com/auth/callback",
		"https://admin.example.com/auth/secondary",
	],
	loginUrl: "https://admin.example.com/login",
	defaultReturnTo: "https://admin.example.com/admin",
	logoUri: "https://example.com/logo.png",
	policyUri: "https://example.com/privacy",
	tosUri: "https://example.com/terms",
	useCustomLoginUi: true,
	loginUiVariant: "branded" as const,
	loginUiHeadline: "Admin 로그인",
	loginUiDescription: "관리자 계정으로 로그인하세요.",
	loginUiBrandLabel: "Admin",
	loginUiBrandColor: "#2563eb",
	loginUiShowIntroPanel: true,
	loginUiMobileFullScreen: false,
	errors: {},
	redirectUriErrors: {},
};

const meta = {
	title: "screen/OidcClientEditScreen",
	component: OidcClientEditScreen,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "OIDC Client 수정",
		description: "route가 전달한 OIDC client state로 설정을 편집합니다.",
		state: defaultState,
		actions: <Button color="primary">저장</Button>,
	},
} satisfies Meta<typeof OidcClientEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "OIDC Client 등록",
		description: "새로운 OIDC Client를 등록합니다.",
		state: {
			...defaultState,
			clientId: "",
			name: "",
			clientSecret: "",
			redirectUris: [""],
		},
	},
};

export const Detail: Story = {
	args: {
		title: "OIDC Client 상세",
		description: "OIDC Client 설정을 읽기 전용으로 확인합니다.",
		readOnly: true,
		actions: <Button variant="flat">수정</Button>,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
