import { PASSWORD_RULES } from "@cocrepo/constant";
import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryStage } from "../storybookFrame";
import {
	ResetPasswordScreen,
	type ResetPasswordScreenState,
} from "./ResetPasswordScreen";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	title: "screen/ResetPasswordScreen",
	component: ResetPasswordScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ResetPasswordScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

class ResetPasswordScreenStoryState implements ResetPasswordScreenState {
	resetPasswordForm: ResetPasswordScreenState["resetPasswordForm"];
	resetPasswordStep: ResetPasswordScreenState["resetPasswordStep"];
	tokenError?: string | null;
	tokenEmail?: string;
	passwordRules: ResetPasswordScreenState["passwordRules"];

	constructor(state: ResetPasswordScreenState) {
		this.resetPasswordStep = state.resetPasswordStep;
		this.tokenError = state.tokenError;
		this.tokenEmail = state.tokenEmail;
		this.passwordRules = [...state.passwordRules];
		this.resetPasswordForm = { ...state.resetPasswordForm };
		makeAutoObservable(this, {}, { autoBind: true });
	}
}

const renderResetPasswordScreen: Story["render"] = (args) => {
	const state = useLocalObservable(
		() => new ResetPasswordScreenStoryState(args.state),
	);

	return (
		<PageStoryStage>
			<div style={centeredCardStyle}>
				<ResetPasswordScreen {...args} state={state} />
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
	render: renderResetPasswordScreen,
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
	render: renderResetPasswordScreen,
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
	render: renderResetPasswordScreen,
};
