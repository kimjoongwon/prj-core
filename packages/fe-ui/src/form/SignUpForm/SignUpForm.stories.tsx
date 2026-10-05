import type { Meta, StoryObj } from "@storybook/react";
import { observable } from "mobx";
import { SignUpForm } from "./SignUpForm";

const baseState = {
	spaceId: "space-gangnam",
	email: "onyu@example.com",
	password: "Pass1234",
	confirmPassword: "Pass1234",
	name: "김온유",
	phone: "010-1234-5678",
	address: "서울시 강남구",
	fieldErrors: {},
	errorMessage: null,
	isSubmitted: false,
	isSubmitting: false,
	submittedEmail: "",
	submittedSpaceName: "",
};
const spaceOptions = [
	{
		value: "space-gangnam",
		label: "강남 스페이스",
		description: "강남 지점 운영 공간",
	},
];
const handlers = {
	onChangeSpaceId: () => undefined,
	onChangeEmail: () => undefined,
	onChangePassword: () => undefined,
	onChangeConfirmPassword: () => undefined,
	onChangeName: () => undefined,
	onChangePhone: () => undefined,
	onChangeAddress: () => undefined,
	onClickUseAnotherEmailButton: () => undefined,
};
const meta = {
	title: "form/SignUpForm",
	component: SignUpForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof SignUpForm>;
export default meta;
type Story = StoryObj<typeof meta>;
const render: Story["render"] = (args) => (
	<div className="w-[520px]">
		<SignUpForm {...args} state={observable({ ...args.state })} />
	</div>
);
export const Default: Story = {
	args: { state: baseState, spaceOptions, ...handlers },
	render,
};
export const Submitted: Story = {
	args: {
		state: {
			...baseState,
			isSubmitted: true,
			submittedEmail: "onyu@example.com",
			submittedSpaceName: "강남 스페이스",
		},
		spaceOptions,
		...handlers,
	},
	render,
};
export const ValidationError: Story = {
	args: {
		state: {
			...baseState,
			fieldErrors: { email: "이메일 형식을 확인하세요." },
			errorMessage: "입력값을 확인해주세요.",
		},
		spaceOptions,
		...handlers,
	},
	render,
};
