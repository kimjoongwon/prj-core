import type { Meta, StoryObj } from "@storybook/react";
import { observable } from "mobx";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

const meta = {
	title: "form/ForgotPasswordForm",
	component: ForgotPasswordForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof ForgotPasswordForm>;
export default meta;
type Story = StoryObj<typeof meta>;
const render: Story["render"] = (args) => (
	<div className="w-[420px]">
		<ForgotPasswordForm {...args} state={observable({ ...args.state })} />
	</div>
);
export const Default: Story = {
	args: {
		state: {
			email: "",
			errorMessage: null,
			isSubmitted: false,
			isSubmitting: false,
		},
	},
	render,
};
export const Submitted: Story = {
	args: {
		state: {
			email: "onyu@example.com",
			errorMessage: null,
			isSubmitted: true,
			isSubmitting: false,
		},
	},
	render,
};
export const Error: Story = {
	args: {
		state: {
			email: "onyu@example.com",
			errorMessage: "등록되지 않은 이메일입니다.",
			isSubmitted: false,
			isSubmitting: false,
		},
	},
	render,
};
