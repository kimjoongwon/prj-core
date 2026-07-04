import type { PasswordRule } from "@cocrepo/constant";
import type { Meta, StoryObj } from "@storybook/react";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

const rules: PasswordRule[] = [
	{ rule: "minLength", label: "8자 이상", test: (value) => value.length >= 8 },
	{
		rule: "letter",
		label: "영문 포함",
		test: (value) => /[A-Za-z]/.test(value),
	},
	{ rule: "number", label: "숫자 포함", test: (value) => /\d/.test(value) },
];

const meta = {
	title: "feedback/PasswordStrengthIndicator",
	component: PasswordStrengthIndicator,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { password: "Pass1234", rules },
} satisfies Meta<typeof PasswordStrengthIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Strong: Story = {};
export const Weak: Story = { args: { password: "pass" } };
