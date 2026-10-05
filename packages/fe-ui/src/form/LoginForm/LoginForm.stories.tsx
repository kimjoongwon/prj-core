import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { LoginForm, type LoginFormState } from "../LoginForm/LoginForm";

const meta = {
	title: "form/LoginForm",
	component: LoginForm,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A login form component with email and password inputs using vertical layout.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		state: {
			description: "The state object containing email and password values",
		},
	},
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

class LoginFormStoryState implements LoginFormState {
	email: string;
	password: string;
	fieldErrors: LoginFormState["fieldErrors"];
	errorMessage: string | null;

	constructor(state: LoginFormState) {
		this.email = state.email;
		this.password = state.password;
		this.fieldErrors = { ...state.fieldErrors };
		this.errorMessage = state.errorMessage;
		makeAutoObservable(this, {}, { autoBind: true });
	}
}

const renderLoginForm: Story["render"] = (args) => {
	const state = useLocalObservable(() => new LoginFormStoryState(args.state));

	return (
		<div className="w-[360px] max-w-[calc(100vw-32px)]">
			<LoginForm {...args} state={state} />
		</div>
	);
};

export const Default: Story = {
	args: {
		state: {
			email: "",
			password: "",
			fieldErrors: {},
			errorMessage: null,
		},
	},
	render: renderLoginForm,
	parameters: {
		docs: {
			description: {
				story: "Default login form with empty email and password fields.",
			},
		},
	},
};

export const WithValues: Story = {
	args: {
		state: {
			email: "user@example.com",
			password: "password123",
			fieldErrors: {},
			errorMessage: null,
		},
	},
	render: renderLoginForm,
	parameters: {
		docs: {
			description: {
				story: "Login form with pre-filled email and password values.",
			},
		},
	},
};

export const WithEmail: Story = {
	args: {
		state: {
			email: "user@example.com",
			password: "",
			fieldErrors: {},
			errorMessage: null,
		},
	},
	render: renderLoginForm,
	parameters: {
		docs: {
			description: {
				story: "Login form with only email field filled.",
			},
		},
	},
};

export const LongValues: Story = {
	args: {
		state: {
			email: "operations.manager.with.long.name@example-reservations.com",
			password: "very-long-password-value",
			fieldErrors: {},
			errorMessage: null,
		},
	},
	render: renderLoginForm,
	parameters: {
		docs: {
			description: {
				story:
					"Login form with longer field values to verify the stacked field layout remains stable.",
			},
		},
	},
};
