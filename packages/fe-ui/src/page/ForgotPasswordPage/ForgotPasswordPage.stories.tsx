import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryStage } from "../storybookFrame";
import {
	ForgotPasswordPage,
	type ForgotPasswordPageState,
} from "./ForgotPasswordPage";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	component: ForgotPasswordPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ForgotPasswordPage>;

export default meta;

type Story = StoryObj<typeof meta>;

class ForgotPasswordPageStoryState implements ForgotPasswordPageState {
	forgotPasswordForm: ForgotPasswordPageState["forgotPasswordForm"];

	constructor(state: ForgotPasswordPageState) {
		this.forgotPasswordForm = { ...state.forgotPasswordForm };
		makeAutoObservable(this, {}, { autoBind: true });
	}
}

const renderForgotPasswordPage: Story["render"] = (args) => {
	const state = useLocalObservable(
		() => new ForgotPasswordPageStoryState(args.state),
	);

	return (
		<PageStoryStage>
			<div style={centeredCardStyle}>
				<ForgotPasswordPage {...args} state={state} />
			</div>
		</PageStoryStage>
	);
};

export const Default: Story = {
	args: {
		state: {
			forgotPasswordForm: {
				email: "",
				errorMessage: null,
				isSubmitted: false,
				isSubmitting: false,
			},
		},
		onSubmitForgotPasswordForm: async () => undefined,
	},
	render: renderForgotPasswordPage,
};

export const UnknownAccount: Story = {
	args: {
		state: {
			forgotPasswordForm: {
				email: "missing@example.com",
				errorMessage: "등록된 이메일을 찾을 수 없습니다.",
				isSubmitted: false,
				isSubmitting: false,
			},
		},
		onSubmitForgotPasswordForm: async () => undefined,
	},
	render: renderForgotPasswordPage,
};
