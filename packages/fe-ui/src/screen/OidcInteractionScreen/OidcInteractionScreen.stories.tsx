import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryStage } from "../storybookFrame";
import {
	OidcInteractionScreen,
	type OidcInteractionScreenState,
} from "./OidcInteractionScreen";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	title: "screen/OidcInteractionScreen",
	component: OidcInteractionScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof OidcInteractionScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

class OidcInteractionScreenStoryState implements OidcInteractionScreenState {
	mode: OidcInteractionScreenState["mode"];
	client?: OidcInteractionScreenState["client"];
	isDev?: boolean;
	errorMessage?: string;
	isExpiredInteraction?: boolean;
	missingScopes: string[];
	oidcConsentPanel: OidcInteractionScreenState["oidcConsentPanel"];
	oidcLoginForm: OidcInteractionScreenState["oidcLoginForm"];

	constructor(state: OidcInteractionScreenState) {
		this.mode = state.mode;
		this.client = state.client;
		this.isDev = state.isDev;
		this.errorMessage = state.errorMessage;
		this.isExpiredInteraction = state.isExpiredInteraction;
		this.missingScopes = [...state.missingScopes];
		this.oidcConsentPanel = { ...state.oidcConsentPanel };
		this.oidcLoginForm = { ...state.oidcLoginForm };
		makeAutoObservable(this, {}, { autoBind: true });
	}
}

const renderOidcInteractionScreen: Story["render"] = (args) => {
	const state = useLocalObservable(
		() => new OidcInteractionScreenStoryState(args.state),
	);

	return (
		<PageStoryStage>
			<div style={centeredCardStyle}>
				<OidcInteractionScreen {...args} state={state} />
			</div>
		</PageStoryStage>
	);
};

export const Loading: Story = {
	args: {
		state: {
			mode: "loading",
			client: null,
			isDev: false,
			errorMessage: "",
			isExpiredInteraction: false,
			missingScopes: [],
			oidcConsentPanel: {
				errorMessage: null,
				isSubmitting: false,
			},
			oidcLoginForm: {
				email: "",
				password: "",
				remember: false,
				error: null,
				isSubmitting: false,
			},
		},
		onSubmitLoginForm: async () => undefined,
		onAbortInteraction: () => undefined,
		onConfirmConsent: async () => undefined,
	},
	render: renderOidcInteractionScreen,
};

export const Login: Story = {
	args: {
		state: {
			mode: "login",
			client: {
				clientId: "user-mobile",
				name: "Onora Mobile",
				loginUi: {
					variant: "compact",
					headline: "오노라 로그인",
					description:
						"예약과 방문 일정을 계속 확인하려면 계정으로 로그인하세요.",
					brandLabel: "Onora Mobile",
					brandColor: "#16a34a",
					showIntroPanel: false,
					mobileFullScreen: true,
				},
			},
			isDev: false,
			errorMessage: "",
			isExpiredInteraction: false,
			missingScopes: [],
			oidcConsentPanel: {
				errorMessage: null,
				isSubmitting: false,
			},
			oidcLoginForm: {
				email: "",
				password: "",
				remember: false,
				error: null,
				isSubmitting: false,
			},
		},
		onSubmitLoginForm: async () => undefined,
		onAbortInteraction: () => undefined,
		onConfirmConsent: async () => undefined,
	},
	render: renderOidcInteractionScreen,
};

export const Consent: Story = {
	args: {
		state: {
			mode: "consent",
			client: {
				clientId: "proposal-web",
				name: "Proposal Web",
				loginUi: {
					variant: "branded",
					brandLabel: "Proposal Web",
					brandColor: "#2563eb",
					showIntroPanel: true,
				},
			},
			isDev: false,
			errorMessage: "",
			isExpiredInteraction: false,
			missingScopes: ["openid", "profile", "email"],
			oidcConsentPanel: {
				errorMessage: null,
				isSubmitting: false,
			},
			oidcLoginForm: {
				email: "",
				password: "",
				remember: false,
				error: null,
				isSubmitting: false,
			},
		},
		onConfirmConsent: async () => undefined,
		onAbortInteraction: () => undefined,
		onSubmitLoginForm: async () => undefined,
	},
	render: renderOidcInteractionScreen,
};

export const ExpiredInteraction: Story = {
	args: {
		state: {
			mode: "error",
			client: null,
			isDev: false,
			errorMessage: "요청한 인증 세션이 만료되어 다시 로그인이 필요합니다.",
			isExpiredInteraction: true,
			missingScopes: [],
			oidcConsentPanel: {
				errorMessage: null,
				isSubmitting: false,
			},
			oidcLoginForm: {
				email: "",
				password: "",
				remember: false,
				error: null,
				isSubmitting: false,
			},
		},
		onClickRecoveryButton: () => undefined,
		onAbortInteraction: () => undefined,
		onSubmitLoginForm: async () => undefined,
		onConfirmConsent: async () => undefined,
	},
	render: renderOidcInteractionScreen,
};
