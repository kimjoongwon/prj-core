import type { PasswordRule } from "@cocrepo/constant";
import type { Meta, StoryObj } from "@storybook/react";
import { observable } from "mobx";
import { ResetPasswordForm } from "./ResetPasswordForm";

const passwordRules: PasswordRule[] = [
	{ rule: "minLength", label: "8자 이상", test: (value) => value.length >= 8 },
	{
		rule: "letter",
		label: "영문 포함",
		test: (value) => /[A-Za-z]/.test(value),
	},
	{ rule: "number", label: "숫자 포함", test: (value) => /\d/.test(value) },
];
const baseState = {
	password: "Pass1234",
	confirmPassword: "Pass1234",
	submitError: null,
	isSubmitting: false,
	isComplete: false,
};
const meta = {
	title: "form/ResetPasswordForm",
	component: ResetPasswordForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof ResetPasswordForm>;
export default meta;
type Story = StoryObj<typeof meta>;
const render: Story["render"] = (args) => (
	<div className="w-[420px]">
		<ResetPasswordForm {...args} state={observable({ ...args.state })} />
	</div>
);
export const Form: Story = {
	args: {
		step: "form",
		state: baseState,
		passwordRules,
		tokenEmail: "onyu@example.com",
	},
	render,
};
export const Invalid: Story = {
	args: {
		step: "invalid",
		tokenError: "링크가 만료되었습니다.",
		state: baseState,
		passwordRules,
	},
	render,
};
export const Complete: Story = {
	args: {
		step: "form",
		state: { ...baseState, isComplete: true },
		passwordRules,
	},
	render,
};
