import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryCard } from "../storybookFrame";
import { LoginPage, type LoginPageState } from "./LoginPage";

const meta = {
	component: LoginPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		state: {
			loginForm: {
				email: "",
				password: "",
			},
			errorMessage: "",
		},
		title: "관리자 로그인",
		caption: "운영 계정으로 로그인해 그라운드와 이용자 상태를 관리하세요.",
		isLoading: false,
		onSubmitLoginForm: async () => undefined,
	},
} satisfies Meta<typeof LoginPage>;

export default meta;

type Story = StoryObj<typeof meta>;

class LoginPageStoryState implements LoginPageState {
	loginForm: LoginPageState["loginForm"];
	errorMessage: string;

	constructor(state: LoginPageState) {
		this.loginForm = { ...state.loginForm };
		this.errorMessage = state.errorMessage;
		makeAutoObservable(this, {}, { autoBind: true });
	}
}

const renderLoginPage: Story["render"] = (args) => {
	const state = useLocalObservable(() => new LoginPageStoryState(args.state));

	return (
		<PageStoryCard>
			<LoginPage {...args} state={state} />
		</PageStoryCard>
	);
};

export const Default: Story = {
	render: renderLoginPage,
};

export const WithEmailError: Story = {
	args: {
		state: {
			loginForm: {
				email: "ops@example.com",
				password: "",
			},
			errorMessage: "이메일 또는 비밀번호를 다시 확인해주세요.",
		},
	},
	render: renderLoginPage,
};

export const Loading: Story = {
	args: {
		state: {
			loginForm: {
				email: "ops@example.com",
				password: "password123!",
			},
			errorMessage: "",
		},
		isLoading: true,
	},
	render: renderLoginPage,
};
