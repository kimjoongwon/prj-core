import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
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

const renderLoginPage =
	(maxWidth = 460): Story["render"] =>
	(args) => {
		const state = useLocalObservable(() => new LoginPageStoryState(args.state));

		return (
			<div className="grid min-h-screen place-items-center bg-background p-6">
				<div className="w-full" style={{ maxWidth }}>
					<LoginPage {...args} state={state} />
				</div>
			</div>
		);
	};

export const Default: Story = {
	render: renderLoginPage(),
};

export const ServerError: Story = {
	args: {
		state: {
			loginForm: {
				email: "ops@example.com",
				password: "",
			},
			errorMessage: "이메일 또는 비밀번호를 다시 확인해주세요.",
		},
	},
	render: renderLoginPage(),
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
	render: renderLoginPage(),
};

export const LongContent: Story = {
	args: {
		caption:
			"운영 계정으로 로그인하면 예약, 결제, 권한, 이용자 상태를 같은 자리에서 이어서 확인할 수 있습니다.",
		state: {
			loginForm: {
				email: "operations.manager.with.long.name@example-reservations.com",
				password: "password123!",
			},
			errorMessage:
				"로그인 요청을 처리하지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.",
		},
	},
	render: renderLoginPage(),
};

export const NarrowViewport: Story = {
	args: {
		state: {
			loginForm: {
				email: "ops@example.com",
				password: "",
			},
			errorMessage: "",
		},
	},
	render: renderLoginPage(320),
};
