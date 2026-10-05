import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { UserForm, type UserFormState } from "./UserForm";

const meta = {
	title: "form/UserForm",
	component: UserForm,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"UserForm component with name, email, phone, and password fields.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof UserForm>;

export default meta;
type Story = StoryObj<typeof meta>;

class UserFormStoryState implements UserFormState {
	name: string;
	email: string;
	phone: string;
	password: string;
	fieldErrors: UserFormState["fieldErrors"];
	errorMessage: UserFormState["errorMessage"];

	constructor(state: UserFormState) {
		this.name = state.name;
		this.email = state.email;
		this.phone = state.phone;
		this.password = state.password;
		this.fieldErrors = { ...state.fieldErrors };
		this.errorMessage = state.errorMessage;
		makeAutoObservable(this, {}, { autoBind: true });
	}
}

const renderUserForm: Story["render"] = (args: Story["args"]) => {
	const state = useLocalObservable(() => new UserFormStoryState(args.state));

	return (
		<div className="w-[480px] max-w-[calc(100vw-32px)]">
			<UserForm {...args} state={state} />
		</div>
	);
};

export const Editable: Story = {
	args: {
		state: {
			name: "김온유",
			email: "onyu@example.com",
			phone: "010-1234-5678",
			password: "password123",
			fieldErrors: {},
			errorMessage: null,
		},
	},
	render: renderUserForm,
	parameters: {
		docs: {
			description: {
				story: "Default editable UserForm state.",
			},
		},
	},
};

export const ReadOnly: Story = {
	args: {
		state: {
			name: "김온유",
			email: "readonly@example.com",
			phone: "010-9999-8888",
			password: "readonly1234",
			fieldErrors: {},
			errorMessage: null,
		},
		readOnly: true,
	},
	render: renderUserForm,
	parameters: {
		docs: {
			description: {
				story: "UserForm rendered in read-only mode.",
			},
		},
	},
};
