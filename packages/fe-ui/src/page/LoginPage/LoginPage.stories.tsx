import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import type { KeyboardEvent } from "react";
import { PageStoryCard } from "../storybookFrame";
import { LoginPage, type State as LoginPageState } from "./LoginPage";

const meta = {
	component: LoginPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		title: "관리자 로그인",
		caption: "운영 계정으로 로그인해 그라운드와 이용자 상태를 관리하세요.",
		isLoading: false,
		onClickLoginButton: () => undefined,
		onKeyDownInput: (_event: KeyboardEvent) => undefined,
	},
} satisfies Meta<typeof LoginPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderLoginPage =
	(initialState: LoginPageState): Story["render"] =>
	(args) => {
		const state = useLocalObservable(() => ({ ...initialState }));

		return (
			<PageStoryCard>
				<LoginPage {...args} state={state} />
			</PageStoryCard>
		);
	};

export const Default: Story = {
	render: renderLoginPage({
		email: "",
		password: "",
		errorMessage: "",
	}),
};

export const WithEmailError: Story = {
	render: renderLoginPage({
		email: "ops@example.com",
		password: "",
		errorMessage: "이메일 또는 비밀번호를 다시 확인해주세요.",
	}),
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
	render: renderLoginPage({
		email: "ops@example.com",
		password: "password123!",
		errorMessage: "",
	}),
};
