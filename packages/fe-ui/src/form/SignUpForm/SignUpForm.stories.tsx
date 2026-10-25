import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { SignUpForm, type SignUpFormState } from "./SignUpForm";
import { useStorybookState } from "../../storybook";

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
const createSignUpFormStoryState = (initial: SignUpFormState) => {
	let state: SignUpFormState & Record<string, unknown>;
	state = makeAutoObservable({
		...initial,
		fieldErrors: { ...initial.fieldErrors },
		onChangeSpaceId: (value: string) => { state.spaceId = value; },
		onChangeEmail: (value: string | number) => { state.email = String(value); },
		onChangePassword: (value: string | number) => { state.password = String(value); },
		onChangeConfirmPassword: (value: string | number) => { state.confirmPassword = String(value); },
		onChangeName: (value: string | number) => { state.name = String(value); },
		onChangePhone: (value: string | number) => { state.phone = String(value); },
		onChangeAddress: (value: string) => { state.address = value; },
		onClickUseAnotherEmailButton: () => { state.email = ""; },
	}, {}, { autoBind: true, name: "SignUpFormStoryState" });
	return state;
};
const meta = {
	title: "form/SignUpForm",
	component: SignUpForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof SignUpForm>;
export default meta;
type Story = StoryObj<typeof meta>;
const render: Story["render"] = (args) => {
	const state = useLocalObservable(() => createSignUpFormStoryState(args.state));
	useStorybookState(() => ({ spaceId: state.spaceId, email: state.email, name: state.name, fieldErrors: state.fieldErrors, isSubmitted: state.isSubmitted }), "SignUpForm");
	return <div className="w-[520px]"><SignUpForm {...args} {...state} state={state} /></div>;
};
export const Default: Story = {
	args: {
		state: baseState,
		spaceOptions,
		onChangeSpaceId: undefined as never,
		onChangeEmail: undefined as never,
		onChangePassword: undefined as never,
		onChangeConfirmPassword: undefined as never,
		onChangeName: undefined as never,
		onChangePhone: undefined as never,
		onChangeAddress: undefined as never,
		onClickUseAnotherEmailButton: undefined as never,
	},
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
		onChangeSpaceId: undefined as never,
		onChangeEmail: undefined as never,
		onChangePassword: undefined as never,
		onChangeConfirmPassword: undefined as never,
		onChangeName: undefined as never,
		onChangePhone: undefined as never,
		onChangeAddress: undefined as never,
		onClickUseAnotherEmailButton: undefined as never,
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
		onChangeSpaceId: undefined as never,
		onChangeEmail: undefined as never,
		onChangePassword: undefined as never,
		onChangeConfirmPassword: undefined as never,
		onChangeName: undefined as never,
		onChangePhone: undefined as never,
		onChangeAddress: undefined as never,
		onClickUseAnotherEmailButton: undefined as never,
	},
	render,
};
