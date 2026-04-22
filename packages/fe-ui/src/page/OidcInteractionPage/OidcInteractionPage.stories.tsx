import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryStage } from "../storybookFrame";
import {
	OidcInteractionPage,
	type OidcInteractionPageState,
} from "./OidcInteractionPage";

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

class OidcInteractionPageStoryState implements OidcInteractionPageState {
	mode: OidcInteractionPageState["mode"];
	client?: OidcInteractionPageState["client"];
	isDev?: boolean;
	errorMessage?: string;
	isExpiredInteraction?: boolean;
	missingScopes: string[];
	oidcConsentPanel: OidcInteractionPageState["oidcConsentPanel"];
	oidcLoginForm: OidcInteractionPageState["oidcLoginForm"];

	constructor(state: OidcInteractionPageState) {
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

const renderOidcInteractionPage: Story["render"] = (args) => {
	const state = useLocalObservable(
		() => new OidcInteractionPageStoryState(args.state),
	);

	return (
		<PageStoryStage>
			<div style={centeredCardStyle}>
				<OidcInteractionPage {...args} state={state} />
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
	render: renderOidcInteractionPage,
};

export const Login: Story = {
	args: {
		state: {
			mode: "login",
			client: {
				clientId: "swagger-web",
				name: "Swagger Web",
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
	render: renderOidcInteractionPage,
};

export const Consent: Story = {
	args: {
		state: {
			mode: "consent",
			client: {
				clientId: "proposal-web",
				name: "Proposal Web",
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
	render: renderOidcInteractionPage,
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
	render: renderOidcInteractionPage,
};
