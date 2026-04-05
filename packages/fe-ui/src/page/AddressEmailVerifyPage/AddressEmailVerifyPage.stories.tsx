import type { Meta, StoryObj } from "@storybook/react";
import { useLocalObservable } from "mobx-react-lite";
import { PageStoryCard } from "../storybookFrame";
import {
	AddressEmailVerifyPage,
	type AddressEmailVerifyPageState,
} from "./AddressEmailVerifyPage";

const meta = {
	component: AddressEmailVerifyPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		onSendEmailVerification: () => undefined,
		onSubmit: () => undefined,
		isEmailCodeSent: false,
		isLoading: false,
	},
} satisfies Meta<typeof AddressEmailVerifyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderAddressEmailVerifyPage =
	(initialState: AddressEmailVerifyPageState): Story["render"] =>
	(args) => {
		const state = useLocalObservable(() => ({ ...initialState }));

		return (
			<PageStoryCard>
				<AddressEmailVerifyPage {...args} state={state} />
			</PageStoryCard>
		);
	};

export const Default: Story = {
	render: renderAddressEmailVerifyPage({
		address: "",
		email: "",
		emailVerificationCode: "",
		errorMessage: "",
	}),
};

export const EmailCodeSent: Story = {
	args: {
		isEmailCodeSent: true,
	},
	render: renderAddressEmailVerifyPage({
		address: "서울특별시 강남구 테헤란로 152",
		email: "member@example.com",
		emailVerificationCode: "",
		errorMessage: "",
	}),
};

export const VerificationFailed: Story = {
	args: {
		isEmailCodeSent: true,
	},
	render: renderAddressEmailVerifyPage({
		address: "서울특별시 강남구 테헤란로 152",
		email: "member@example.com",
		emailVerificationCode: "004122",
		errorMessage: "이메일 인증번호가 일치하지 않습니다.",
	}),
};
