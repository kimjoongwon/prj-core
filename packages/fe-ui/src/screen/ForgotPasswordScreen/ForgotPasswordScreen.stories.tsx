import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryStage } from "../storybookFrame";
import {
	ForgotPasswordScreen,
	type ForgotPasswordScreenState,
} from "./ForgotPasswordScreen";

const centeredCardStyle = {
	width: "100%",
	maxWidth: 460,
};

const meta = {
	component: ForgotPasswordScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ForgotPasswordScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

class ForgotPasswordScreenStoryState implements ForgotPasswordScreenState {
	forgotPasswordForm: ForgotPasswordScreenState["forgotPasswordForm"];

	constructor(state: ForgotPasswordScreenState) {
		this.forgotPasswordForm = { ...state.forgotPasswordForm };
		makeAutoObservable(this, {}, { autoBind: true });
	}
}

const renderForgotPasswordScreen: Story["render"] = (args) => {
	const state = useLocalObservable(
		() => new ForgotPasswordScreenStoryState(args.state),
	);

	return (
		<PageStoryStage>
			<div style={centeredCardStyle}>
				<ForgotPasswordScreen {...args} state={state} />
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
	render: renderForgotPasswordScreen,
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
	render: renderForgotPasswordScreen,
};
