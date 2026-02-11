import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "../LoginForm/LoginForm";

const meta = {
	title: "Form/LoginForm",
	component: LoginForm,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A login form component with email and password inputs using VStack layout.",
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

export const Default: Story = {
	args: {
		state: {
			email: "",
			password: "",
		},
	},
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
		},
	},
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
		},
	},
	parameters: {
		docs: {
			description: {
				story: "Login form with only email field filled.",
			},
		},
	},
};
