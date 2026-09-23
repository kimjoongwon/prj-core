import type { Meta, StoryObj } from "@storybook/react";
import { observable } from "mobx";
import { OidcClientForm } from "./OidcClientForm";

const baseState = {
	clientId: "reservation-admin",
	name: "예약 관리자",
	clientSecret: "secret",
	isPublic: false,
	tokenEndpointAuthMethod: "client_secret_basic",
	grantTypes: ["authorization_code"],
	responseTypes: ["code"],
	scope: "openid profile email",
	isFirstParty: true,
	skipConsent: false,
	redirectUris: ["https://admin.example.com/callback"],
	loginUrl: "",
	defaultReturnTo: "",
	logoUri: "",
	policyUri: "",
	tosUri: "",
	useCustomLoginUi: true,
	loginUiVariant: "branded",
	loginUiHeadline: "관리자 로그인",
	loginUiDescription: "운영 콘솔에 접속합니다.",
	loginUiBrandLabel: "Plate",
	loginUiBrandColor: "#2563eb",
	loginUiShowIntroPanel: true,
	loginUiMobileFullScreen: false,
	errors: {},
	redirectUriErrors: {},
} as const;

const meta = {
	title: "form/OidcClientForm",
	component: OidcClientForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof OidcClientForm>;
export default meta;
type Story = StoryObj<typeof meta>;
const render: Story["render"] = (args) => (
	<div className="w-[820px]">
		<OidcClientForm {...args} state={observable({ ...args.state }) as never} />
	</div>
);
export const Create: Story = {
	args: {
		state: baseState as never,
	},
	render,
};
export const EditWithErrors: Story = {
	args: {
		state: {
			...baseState,
			errors: { name: "이름을 입력하세요." },
			redirectUriErrors: { 0: "HTTPS URI를 입력하세요." },
		} as never,
	},
	render,
};

export const ReadOnly: Story = {
	args: {
		state: baseState as never,
		readOnly: true,
	},
	render,
};
