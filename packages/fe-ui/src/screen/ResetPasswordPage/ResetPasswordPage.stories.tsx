import { PASSWORD_RULES } from "@cocrepo/constant";
import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryStage } from "../storybookFrame";
import {
	ResetPasswordPage,
	type ResetPasswordPageState,
} from "./ResetPasswordPage";

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

class ResetPasswordPageStoryState implements ResetPasswordPageState {
	resetPasswordForm: ResetPasswordPageState["resetPasswordForm"];
	resetPasswordStep: ResetPasswordPageState["resetPasswordStep"];
	tokenError?: string | null;
	tokenEmail?: string;
	passwordRules: ResetPasswordPageState["passwordRules"];

	constructor(state: ResetPasswordPageState) {
		this.resetPasswordStep = state.resetPasswordStep;
		this.tokenError = state.tokenError;
		this.tokenEmail = state.tokenEmail;
		this.passwordRules = [...state.passwordRules];
		this.resetPasswordForm = { ...state.resetPasswordForm };
		makeAutoObservable(this, {}, { autoBind: true });
	}
}

const renderResetPasswordPage: Story["render"] = (args) => {
	const state = useLocalObservable(
		() => new ResetPasswordPageStoryState(args.state),
	);

	return (
		<PageStoryStage>
			<div style={centeredCardStyle}>
				<ResetPasswordPage {...args} state={state} />
			</div>
		</PageStoryStage>
	);
};

export const ValidatingLink: Story = {
	args: {
		state: {
			resetPasswordStep: "validating",
			tokenError: null,
			tokenEmail: "",
			passwordRules: PASSWORD_RULES,
			resetPasswordForm: {
				password: "",
				confirmPassword: "",
				submitError: null,
				isSubmitting: false,
				isComplete: false,
			},
		},
		onSubmitResetPasswordForm: async () => undefined,
	},
	render: renderResetPasswordPage,
};

export const ReadyToReset: Story = {
	args: {
		state: {
			resetPasswordStep: "form",
			tokenError: null,
			tokenEmail: "member@example.com",
			passwordRules: PASSWORD_RULES,
			resetPasswordForm: {
				password: "",
				confirmPassword: "",
				submitError: null,
				isSubmitting: false,
				isComplete: false,
			},
		},
		onSubmitResetPasswordForm: async () => undefined,
	},
	render: renderResetPasswordPage,
};

export const ExpiredLink: Story = {
	args: {
		state: {
			resetPasswordStep: "invalid",
			tokenError: "재설정 링크가 만료되었습니다.",
			tokenEmail: "",
			passwordRules: PASSWORD_RULES,
			resetPasswordForm: {
				password: "",
				confirmPassword: "",
				submitError: null,
				isSubmitting: false,
				isComplete: false,
			},
		},
		onSubmitResetPasswordForm: async () => undefined,
	},
	render: renderResetPasswordPage,
};
